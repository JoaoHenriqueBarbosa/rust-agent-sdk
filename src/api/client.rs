use std::pin::Pin;
use std::task::{Context, Poll};
use std::time::Duration;

use bytes::Bytes;
use futures::stream::{Stream, StreamExt};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use tokio_stream::wrappers::ReceiverStream;

use crate::api::error_classifier::classify_api_error;
use crate::api::retry::{ErrorKind, RetryConfig, get_retry_delay, should_retry};
use crate::api::streaming::{AssistantMessage, StreamAccumulator, StreamUpdate, parse_sse_data};
use crate::api::types::*;
use crate::errors::{ClaudeSDKError, Result};

const DEFAULT_BASE_URL: &str = "https://api.anthropic.com";
const DEFAULT_ANTHROPIC_VERSION: &str = "2023-06-01";
const DEFAULT_MODEL: &str = "claude-sonnet-4-20250514";
const DEFAULT_MAX_TOKENS: u32 = 16384;

/// Client for the Anthropic Messages API.
#[derive(Debug, Clone)]
pub struct AnthropicClient {
    http_client: reqwest::Client,
    api_key: String,
    base_url: String,
    anthropic_version: String,
    beta_features: Vec<String>,
    pub default_model: String,
    pub default_max_tokens: u32,
    pub retry_config: RetryConfig,
}

impl AnthropicClient {
    /// Create a new client with an API key.
    pub fn new(api_key: impl Into<String>) -> Self {
        let http_client = reqwest::Client::builder()
            .connect_timeout(Duration::from_secs(30))
            .timeout(Duration::from_secs(600))
            .build()
            .expect("Failed to build HTTP client");

        Self {
            http_client,
            api_key: api_key.into(),
            base_url: DEFAULT_BASE_URL.to_string(),
            anthropic_version: DEFAULT_ANTHROPIC_VERSION.to_string(),
            beta_features: vec![
                "interleaved-thinking-2025-05-14".to_string(),
                "prompt-caching-2024-07-31".to_string(),
            ],
            default_model: DEFAULT_MODEL.to_string(),
            default_max_tokens: DEFAULT_MAX_TOKENS,
            retry_config: RetryConfig::default(),
        }
    }

    pub fn with_base_url(mut self, url: impl Into<String>) -> Self {
        self.base_url = url.into();
        self
    }

    pub fn with_model(mut self, model: impl Into<String>) -> Self {
        self.default_model = model.into();
        self
    }

    pub fn with_max_tokens(mut self, max_tokens: u32) -> Self {
        self.default_max_tokens = max_tokens;
        self
    }

    pub fn with_beta(mut self, beta: impl Into<String>) -> Self {
        self.beta_features.push(beta.into());
        self
    }

    pub fn with_retry_config(mut self, config: RetryConfig) -> Self {
        self.retry_config = config;
        self
    }

    /// Build headers common to all requests.
    fn build_headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert("x-api-key", HeaderValue::from_str(&self.api_key).unwrap());
        headers.insert(
            "anthropic-version",
            HeaderValue::from_str(&self.anthropic_version).unwrap(),
        );
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

        if !self.beta_features.is_empty() {
            let beta_value = self.beta_features.join(",");
            headers.insert(
                "anthropic-beta",
                HeaderValue::from_str(&beta_value).unwrap(),
            );
        }

        let request_id = uuid::Uuid::new_v4().to_string();
        headers.insert(
            "x-client-request-id",
            HeaderValue::from_str(&request_id).unwrap(),
        );

        headers
    }

    /// Generic POST request that sends a JSON body and returns the parsed JSON response.
    /// Used for endpoints like /v1/messages/count_tokens that share auth/headers
    /// but have different request/response shapes.
    pub async fn post_json(
        &self,
        path: &str,
        body: &serde_json::Value,
    ) -> Result<serde_json::Value> {
        let url = format!("{}{}", self.base_url, path);
        let headers = self.build_headers();
        let body_str = serde_json::to_string(body)
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize request: {e}")))?;

        let response = self
            .http_client
            .post(&url)
            .headers(headers)
            .body(body_str)
            .send()
            .await
            .map_err(|e| ClaudeSDKError::cli_connection(format!("Connection failed: {e}")))?;

        let status = response.status().as_u16();
        let text = response
            .text()
            .await
            .map_err(|e| ClaudeSDKError::cli_connection(format!("Failed to read response: {e}")))?;

        if status != 200 {
            return Err(ClaudeSDKError::process(
                format!("API request to {path} failed with status {status}"),
                Some(status as i32),
                Some(text),
            ));
        }

        serde_json::from_str(&text).map_err(|e| ClaudeSDKError::json_decode(text, e))
    }

    /// Non-streaming message creation (for compaction, summarization, etc.).
    pub async fn create_message(&self, mut request: CreateMessageRequest) -> Result<ApiResponse> {
        request.stream = false;

        let url = format!("{}/v1/messages", self.base_url);
        let headers = self.build_headers();
        let body = serde_json::to_string(&request)
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize request: {e}")))?;

        let mut attempt = 0u32;
        let mut consecutive_529s = 0u32;

        loop {
            let response = self
                .http_client
                .post(&url)
                .headers(headers.clone())
                .body(body.clone())
                .send()
                .await;

            match response {
                Ok(resp) => {
                    let status = resp.status().as_u16();
                    if status == 200 {
                        let text = resp.text().await.map_err(|e| {
                            ClaudeSDKError::cli_connection(format!("Failed to read response: {e}"))
                        })?;
                        let api_response: ApiResponse = serde_json::from_str(&text)
                            .map_err(|e| ClaudeSDKError::json_decode(text, e))?;
                        return Ok(api_response);
                    }

                    let retry_after = resp
                        .headers()
                        .get("retry-after")
                        .and_then(|v| v.to_str().ok().map(|s| s.to_string()));
                    let response_body = resp.text().await.ok();
                    let error_kind = ErrorKind::from_status(
                        status,
                        retry_after.as_deref(),
                        response_body.as_deref(),
                    );

                    if error_kind == ErrorKind::Overloaded {
                        consecutive_529s += 1;
                    } else {
                        consecutive_529s = 0;
                    }

                    if should_retry(&self.retry_config, &error_kind, attempt, consecutive_529s) {
                        let delay = get_retry_delay(&self.retry_config, &error_kind, attempt);
                        tokio::time::sleep(delay).await;
                        attempt += 1;
                        continue;
                    }

                    // Signal fallback when consecutive 529s hit the overload limit
                    if error_kind == ErrorKind::Overloaded
                        && consecutive_529s >= self.retry_config.overload_max_retries
                    {
                        return Err(ClaudeSDKError::overloaded_fallback(consecutive_529s));
                    }

                    let classified = classify_api_error(
                        status,
                        response_body.as_deref().unwrap_or(""),
                    );
                    return Err(ClaudeSDKError::process(
                        classified,
                        Some(status as i32),
                        response_body,
                    ));
                }
                Err(e) => {
                    let error_kind = ErrorKind::ConnectionError;
                    consecutive_529s = 0;
                    if should_retry(&self.retry_config, &error_kind, attempt, consecutive_529s) {
                        let delay = get_retry_delay(&self.retry_config, &error_kind, attempt);
                        tokio::time::sleep(delay).await;
                        attempt += 1;
                        continue;
                    }
                    return Err(ClaudeSDKError::cli_connection(format!(
                        "Connection failed: {e}"
                    )));
                }
            }
        }
    }

    /// Streaming message creation — returns a Stream of StreamUpdate events.
    pub async fn create_message_stream(
        &self,
        mut request: CreateMessageRequest,
    ) -> Result<Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>>> {
        request.stream = true;

        let url = format!("{}/v1/messages", self.base_url);
        let headers = self.build_headers();
        let body = serde_json::to_string(&request)
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize request: {e}")))?;

        let response = self.send_with_retry(&url, &headers, &body).await?;

        let byte_stream = response.bytes_stream();
        let stream = sse_to_stream_updates(byte_stream);

        Ok(Box::pin(stream))
    }

    /// Wrap a non-streaming ApiResponse as a stream yielding the equivalent StreamUpdate events.
    /// Produces a single MessageComplete event with an AssistantMessage built from the response.
    pub fn wrap_response_as_stream(
        response: ApiResponse,
    ) -> Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>> {
        let assistant_msg = AssistantMessage {
            id: response.id,
            model: response.model,
            content: response.content,
            stop_reason: StopReason::from(response.stop_reason.as_ref()),
            usage: response.usage,
        };
        let update = StreamUpdate::MessageComplete {
            message: assistant_msg,
        };
        Box::pin(futures::stream::once(async move { Ok(update) }))
    }

    /// Streaming message creation with non-streaming fallback.
    ///
    /// First tries `create_message_stream`. If the stream errors AFTER receiving
    /// at least one event (partial response), falls back to `create_message`
    /// (non-streaming) and wraps the result as a single `MessageComplete` event.
    /// If the stream errors BEFORE any events, returns the error directly
    /// (letting the caller's retry logic handle it).
    pub async fn create_message_with_fallback(
        &self,
        request: CreateMessageRequest,
    ) -> Result<Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>>> {
        let fallback_request = request.clone();
        let stream = self.create_message_stream(request).await?;

        let client = self.clone();
        let wrapper_stream = FallbackStream::new(stream, client, fallback_request);
        Ok(Box::pin(wrapper_stream))
    }

    /// Send a POST request with retry logic, returning the raw response for streaming.
    async fn send_with_retry(
        &self,
        url: &str,
        headers: &HeaderMap,
        body: &str,
    ) -> Result<reqwest::Response> {
        let mut attempt = 0u32;
        let mut consecutive_529s = 0u32;

        loop {
            let response = self
                .http_client
                .post(url)
                .headers(headers.clone())
                .body(body.to_string())
                .send()
                .await;

            match response {
                Ok(resp) => {
                    let status = resp.status().as_u16();
                    if status == 200 {
                        return Ok(resp);
                    }

                    let retry_after = resp
                        .headers()
                        .get("retry-after")
                        .and_then(|v| v.to_str().ok().map(|s| s.to_string()));
                    let response_body = resp.text().await.ok();
                    let error_kind = ErrorKind::from_status(
                        status,
                        retry_after.as_deref(),
                        response_body.as_deref(),
                    );

                    if error_kind == ErrorKind::Overloaded {
                        consecutive_529s += 1;
                    } else {
                        consecutive_529s = 0;
                    }

                    if should_retry(&self.retry_config, &error_kind, attempt, consecutive_529s) {
                        let delay = get_retry_delay(&self.retry_config, &error_kind, attempt);
                        tokio::time::sleep(delay).await;
                        attempt += 1;
                        continue;
                    }

                    // Signal fallback when consecutive 529s hit the overload limit
                    if error_kind == ErrorKind::Overloaded
                        && consecutive_529s >= self.retry_config.overload_max_retries
                    {
                        return Err(ClaudeSDKError::overloaded_fallback(consecutive_529s));
                    }

                    let classified = classify_api_error(
                        status,
                        response_body.as_deref().unwrap_or(""),
                    );
                    return Err(ClaudeSDKError::process(
                        classified,
                        Some(status as i32),
                        response_body,
                    ));
                }
                Err(e) => {
                    let error_kind = ErrorKind::ConnectionError;
                    consecutive_529s = 0;
                    if should_retry(&self.retry_config, &error_kind, attempt, consecutive_529s) {
                        let delay = get_retry_delay(&self.retry_config, &error_kind, attempt);
                        tokio::time::sleep(delay).await;
                        attempt += 1;
                        continue;
                    }
                    return Err(ClaudeSDKError::cli_connection(format!(
                        "Connection failed: {e}"
                    )));
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// SSE byte stream → StreamUpdate stream
// ---------------------------------------------------------------------------

/// Convert a raw byte stream (SSE) into a stream of StreamUpdate events.
fn sse_to_stream_updates<S>(byte_stream: S) -> impl Stream<Item = Result<StreamUpdate>>
where
    S: Stream<Item = std::result::Result<Bytes, reqwest::Error>> + Send + 'static,
{
    let (tx, rx) = tokio::sync::mpsc::channel::<Result<StreamUpdate>>(64);

    tokio::spawn(async move {
        let mut accumulator = StreamAccumulator::new();
        let mut buffer = String::new();

        tokio::pin!(byte_stream);

        while let Some(chunk_result) = byte_stream.next().await {
            match chunk_result {
                Ok(chunk) => {
                    let text = match std::str::from_utf8(&chunk) {
                        Ok(t) => t,
                        Err(e) => {
                            let _ = tx
                                .send(Err(ClaudeSDKError::sdk(format!(
                                    "Invalid UTF-8 in SSE stream: {e}"
                                ))))
                                .await;
                            return;
                        }
                    };

                    buffer.push_str(text);

                    // Process complete SSE events from buffer
                    while let Some(event_end) = buffer.find("\n\n") {
                        let event_text = buffer[..event_end].to_string();
                        buffer = buffer[event_end + 2..].to_string();

                        if let Some(data) = extract_sse_data(&event_text) {
                            match parse_sse_data(data) {
                                Ok(stream_event) => {
                                    match accumulator.process_event(stream_event) {
                                        Ok(Some(update)) => {
                                            if tx.send(Ok(update)).await.is_err() {
                                                return; // Consumer dropped
                                            }
                                        }
                                        Ok(None) => {}
                                        Err(e) => {
                                            let _ = tx.send(Err(e)).await;
                                            return;
                                        }
                                    }
                                }
                                Err(e) => {
                                    let _ = tx.send(Err(e)).await;
                                    return;
                                }
                            }
                        }
                    }
                }
                Err(e) => {
                    let _ = tx
                        .send(Err(ClaudeSDKError::cli_connection(format!(
                            "Stream read error: {e}"
                        ))))
                        .await;
                    return;
                }
            }
        }
    });

    ReceiverStream::new(rx)
}

/// Extract the data payload from an SSE event text block.
fn extract_sse_data(event_text: &str) -> Option<&str> {
    for line in event_text.lines() {
        if let Some(data) = line.strip_prefix("data: ") {
            return Some(data);
        }
        if let Some(data) = line.strip_prefix("data:") {
            let trimmed = data.trim_start();
            if !trimmed.is_empty() {
                return Some(trimmed);
            }
        }
    }
    None
}

// ---------------------------------------------------------------------------
// FallbackStream — wraps a streaming response with non-streaming fallback
// ---------------------------------------------------------------------------

/// Stream wrapper that falls back to a non-streaming API call when the inner
/// stream errors after having already yielded at least one event.
struct FallbackStream {
    inner: Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>>,
}

impl FallbackStream {
    fn new(
        inner: Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>>,
        client: AnthropicClient,
        request: CreateMessageRequest,
    ) -> Self {
        let (tx, rx) = tokio::sync::mpsc::channel::<Result<StreamUpdate>>(64);

        // Spawn a task that drives the inner stream, counts events, and
        // triggers the fallback if needed.
        tokio::spawn(async move {
            let mut events_received = false;
            tokio::pin!(inner);

            while let Some(item) = inner.next().await {
                match item {
                    Ok(update) => {
                        events_received = true;
                        if tx.send(Ok(update)).await.is_err() {
                            return; // consumer dropped
                        }
                    }
                    Err(e) => {
                        if !events_received {
                            // No events received yet — propagate error directly
                            let _ = tx.send(Err(e)).await;
                            return;
                        }

                        // Events were received before the error — fall back to
                        // non-streaming API call.
                        let _ = tx.send(Ok(StreamUpdate::TextDelta {
                            index: 0,
                            text: String::new(), // empty delta signals fallback transition
                        })).await;

                        match client.create_message(request).await {
                            Ok(response) => {
                                let assistant_msg = AssistantMessage {
                                    id: response.id,
                                    model: response.model,
                                    content: response.content,
                                    stop_reason: StopReason::from(response.stop_reason.as_ref()),
                                    usage: response.usage,
                                };
                                let _ = tx
                                    .send(Ok(StreamUpdate::MessageComplete {
                                        message: assistant_msg,
                                    }))
                                    .await;
                            }
                            Err(fallback_err) => {
                                let _ = tx.send(Err(fallback_err)).await;
                            }
                        }
                        return;
                    }
                }
            }
        });

        Self {
            inner: Box::pin(ReceiverStream::new(rx)),
        }
    }
}

impl Stream for FallbackStream {
    type Item = Result<StreamUpdate>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        self.inner.as_mut().poll_next(cx)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_sse_data() {
        assert_eq!(
            extract_sse_data("event: message_start\ndata: {\"type\":\"message_start\"}"),
            Some("{\"type\":\"message_start\"}")
        );

        assert_eq!(
            extract_sse_data("data:{\"type\":\"ping\"}"),
            Some("{\"type\":\"ping\"}")
        );

        assert_eq!(extract_sse_data("event: ping"), None);
        assert_eq!(extract_sse_data(": comment"), None);
    }

    #[test]
    fn test_build_headers() {
        let client = AnthropicClient::new("sk-ant-test123");
        let headers = client.build_headers();

        assert_eq!(
            headers.get("x-api-key").unwrap().to_str().unwrap(),
            "sk-ant-test123"
        );
        assert_eq!(
            headers.get("anthropic-version").unwrap().to_str().unwrap(),
            "2023-06-01"
        );
        assert_eq!(
            headers.get("content-type").unwrap().to_str().unwrap(),
            "application/json"
        );
        assert!(headers.get("anthropic-beta").is_some());
        assert!(headers.get("x-client-request-id").is_some());
    }

    #[test]
    fn test_client_builder() {
        let client = AnthropicClient::new("test-key")
            .with_base_url("http://localhost:8080")
            .with_model("claude-opus-4-20250514")
            .with_max_tokens(4096)
            .with_beta("some-beta-2024-01-01");

        assert_eq!(client.base_url, "http://localhost:8080");
        assert_eq!(client.default_model, "claude-opus-4-20250514");
        assert_eq!(client.default_max_tokens, 4096);
        assert_eq!(client.beta_features.len(), 3); // 2 defaults + 1
    }
}
