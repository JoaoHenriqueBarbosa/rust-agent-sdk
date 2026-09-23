use std::pin::Pin;
use std::task::{Context, Poll};
use std::time::Duration;

use bytes::Bytes;
use futures::stream::{Stream, StreamExt};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use tokio_stream::wrappers::ReceiverStream;

use crate::api::error_classifier::classify_api_error;
use crate::api::retry::{
    apply_unified_reset, get_retry_delay, should_retry, ErrorKind, RetryConfig,
};
use crate::api::streaming::{parse_sse_data, AssistantMessage, StreamAccumulator, StreamUpdate};
use crate::api::types::*;
use crate::errors::{ClaudeSDKError, Result};

const DEFAULT_BASE_URL: &str = "https://api.anthropic.com";
const DEFAULT_ANTHROPIC_VERSION: &str = "2023-06-01";
/// Modelo default quando nada foi configurado.
pub const DEFAULT_MODEL: &str = "claude-sonnet-4-20250514";
const DEFAULT_MAX_TOKENS: u32 = 16384;

/// Teto de `max_tokens` da chamada sem streaming que substitui um stream
/// quebrado (`MAX_NON_STREAMING_TOKENS` do CLI).
pub const MAX_NON_STREAMING_TOKENS: u32 = 64_000;

/// Timeout de inatividade do watchdog de stream quando
/// `CLAUDE_STREAM_IDLE_TIMEOUT_MS` não diz outro (90s, como no CLI).
const DEFAULT_STREAM_IDLE_TIMEOUT_MS: u64 = 90_000;

/// Mensagem do erro que o watchdog produz ao abandonar um stream parado.
const STREAM_IDLE_TIMEOUT_MESSAGE: &str = "Stream idle timeout - no chunks received";

/// Mensagem do erro de timeout do próprio cliente HTTP durante a leitura do
/// stream. No CLI esse é o "Streaming timeout (SDK abort)", que vira
/// `APIConnectionTimeoutError` e NÃO passa pelo fallback sem streaming.
const STREAM_REQUEST_TIMEOUT_MESSAGE: &str = "Request timed out";

/// `isEnvTruthy` do CLI.
fn is_env_truthy(value: Option<&str>) -> bool {
    value.is_some_and(|v| {
        matches!(
            v.trim().to_lowercase().as_str(),
            "1" | "true" | "yes" | "on"
        )
    })
}

/// Como o cliente reage a um stream que quebra: o CLI repete a MESMA chamada
/// sem streaming, e um model-router atrás de `ANTHROPIC_BASE_URL` pode mandar
/// essa segunda chamada para outro provider. Cada campo vem da mesma variável
/// de ambiente que o CLI lê.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StreamFallbackConfig {
    /// `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK`: o erro do stream sobe
    /// direto, sem a chamada sem streaming. Não vale para o 404 na abertura
    /// do stream, que no CLI cai na não-streaming mesmo assim.
    pub disabled: bool,
    /// Watchdog de inatividade (`CLAUDE_ENABLE_STREAM_WATCHDOG`, desligado por
    /// padrão): sem evento por este tempo (`CLAUDE_STREAM_IDLE_TIMEOUT_MS`,
    /// 90s por padrão), o stream é abandonado e a chamada vai sem streaming.
    pub idle_timeout: Option<Duration>,
    /// Timeout de cada tentativa da chamada sem streaming: `API_TIMEOUT_MS`,
    /// ou 300s (120s com `CLAUDE_CODE_REMOTE`).
    pub non_streaming_timeout: Duration,
}

impl StreamFallbackConfig {
    /// Monta a configuração a partir de um leitor de variáveis de ambiente
    /// (o transporte nativo passa o env das opções sobreposto ao do processo).
    pub fn from_env(get: impl Fn(&str) -> Option<String>) -> Self {
        let disabled = is_env_truthy(get("CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK").as_deref());
        let idle_timeout =
            is_env_truthy(get("CLAUDE_ENABLE_STREAM_WATCHDOG").as_deref()).then(|| {
                let ms = get("CLAUDE_STREAM_IDLE_TIMEOUT_MS")
                    .and_then(|v| v.trim().parse::<u64>().ok())
                    .filter(|ms| *ms > 0)
                    .unwrap_or(DEFAULT_STREAM_IDLE_TIMEOUT_MS);
                Duration::from_millis(ms)
            });
        let non_streaming_timeout = get("API_TIMEOUT_MS")
            .and_then(|v| v.trim().parse::<u64>().ok())
            .filter(|ms| *ms > 0)
            .map(Duration::from_millis)
            .unwrap_or_else(|| {
                if is_env_truthy(get("CLAUDE_CODE_REMOTE").as_deref()) {
                    Duration::from_secs(120)
                } else {
                    Duration::from_secs(300)
                }
            });
        Self {
            disabled,
            idle_timeout,
            non_streaming_timeout,
        }
    }
}

impl Default for StreamFallbackConfig {
    /// Lida do ambiente do processo.
    fn default() -> Self {
        Self::from_env(|key| std::env::var(key).ok())
    }
}

/// `adjustParamsForNonStreaming` do CLI: `max_tokens` limitado ao teto, e o
/// orçamento de thinking abaixo dele.
pub fn adjust_params_for_non_streaming(request: &mut CreateMessageRequest, max_tokens_cap: u32) {
    let capped = request.max_tokens.min(max_tokens_cap);
    if let Some(thinking) = request.thinking.as_mut() {
        if thinking.r#type == "enabled" {
            if let Some(budget) = thinking.budget_tokens.filter(|b| *b > 0) {
                thinking.budget_tokens = Some(budget.min(capped.saturating_sub(1)));
            }
        }
    }
    request.max_tokens = capped;
}

/// `is529Error` do CLI: status 529, ou o corpo do erro com `overloaded_error`
/// (é o caso do `event: error` no meio do SSE, que chega com HTTP 200).
fn is_529_error(error: &ClaudeSDKError) -> bool {
    match error {
        ClaudeSDKError::Process {
            exit_code: Some(529),
            ..
        }
        | ClaudeSDKError::OverloadedFallback { .. } => true,
        other => other.to_string().contains("overloaded_error"),
    }
}

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
    pub stream_fallback: StreamFallbackConfig,
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
                crate::api::cache_breakpoints::EXTENDED_CACHE_TTL_BETA.to_string(),
            ],
            default_model: DEFAULT_MODEL.to_string(),
            default_max_tokens: DEFAULT_MAX_TOKENS,
            retry_config: RetryConfig::default(),
            stream_fallback: StreamFallbackConfig::default(),
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

    pub fn with_stream_fallback(mut self, config: StreamFallbackConfig) -> Self {
        self.stream_fallback = config;
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
    pub async fn create_message(&self, request: CreateMessageRequest) -> Result<ApiResponse> {
        self.create_message_with_retry(request, 0, None).await
    }

    /// A chamada sem streaming que substitui um stream quebrado
    /// (`executeNonStreamingRequest` do CLI): mesmos parâmetros e headers,
    /// `max_tokens` limitado a [`MAX_NON_STREAMING_TOKENS`], timeout próprio
    /// por tentativa e o retry de sempre, que já começa contando o 529 do
    /// stream quando foi um 529 que o quebrou.
    pub async fn create_message_non_streaming_fallback(
        &self,
        mut request: CreateMessageRequest,
        initial_consecutive_529s: u32,
    ) -> Result<ApiResponse> {
        adjust_params_for_non_streaming(&mut request, MAX_NON_STREAMING_TOKENS);
        self.create_message_with_retry(
            request,
            initial_consecutive_529s,
            Some(self.stream_fallback.non_streaming_timeout),
        )
        .await
    }

    async fn create_message_with_retry(
        &self,
        mut request: CreateMessageRequest,
        initial_consecutive_529s: u32,
        timeout: Option<Duration>,
    ) -> Result<ApiResponse> {
        request.stream = false;

        let url = format!("{}/v1/messages", self.base_url);
        let headers = self.build_headers();
        let mut body = request_body(&request)?;

        let mut attempt = 0u32;
        let mut consecutive_529s = initial_consecutive_529s;

        loop {
            let mut builder = self
                .http_client
                .post(&url)
                .headers(headers.clone())
                .body(body.clone());
            if let Some(timeout) = timeout {
                builder = builder.timeout(timeout);
            }
            let response = builder.send().await;

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

                    let header = |name: &str| {
                        resp.headers()
                            .get(name)
                            .and_then(|v| v.to_str().ok().map(str::to_string))
                    };
                    let retry_after = header("retry-after");
                    let should_retry_header = header("x-should-retry");
                    let ratelimit_reset = header("anthropic-ratelimit-unified-reset");
                    let response_body = resp.text().await.ok();
                    let error_kind = apply_unified_reset(
                        ErrorKind::from_status(
                            status,
                            retry_after.as_deref(),
                            response_body.as_deref(),
                            should_retry_header.as_deref(),
                        ),
                        ratelimit_reset.as_deref(),
                    );

                    // Overflow de max_tokens: reduz para o espaço disponível e
                    // retenta a MESMA chamada (o que o withRetry do CLI faz),
                    // em vez de falhar a run.
                    if let ErrorKind::MaxTokensContextOverflow { available } = &error_kind {
                        let adjusted = available
                            .unwrap_or(crate::api::retry::FLOOR_OUTPUT_TOKENS)
                            .max(crate::api::retry::FLOOR_OUTPUT_TOKENS);
                        if request.max_tokens > adjusted && attempt < self.retry_config.max_retries
                        {
                            request.max_tokens = adjusted;
                            body = request_body(&request)?;
                            attempt += 1;
                            continue;
                        }
                    }

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

                    let classified =
                        classify_api_error(status, response_body.as_deref().unwrap_or(""));
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

        let response = self.send_with_retry(&url, &headers, &mut request).await?;

        let request_id = response
            .headers()
            .get("request-id")
            .and_then(|v| v.to_str().ok())
            .map(str::to_string);
        let byte_stream = response.bytes_stream();
        let stream = sse_to_stream_updates(byte_stream, self.stream_fallback.idle_timeout);
        let started =
            futures::stream::once(async move { Ok(StreamUpdate::ResponseStarted { request_id }) });

        Ok(Box::pin(started.chain(stream)))
    }

    /// Wrap a non-streaming ApiResponse as a stream yielding the equivalent StreamUpdate events.
    /// Produces a single MessageComplete event with an AssistantMessage built from the response.
    pub fn wrap_response_as_stream(
        response: ApiResponse,
    ) -> Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>> {
        let update = StreamUpdate::MessageComplete {
            message: assistant_from_response(response),
        };
        Box::pin(futures::stream::once(async move { Ok(update) }))
    }

    /// Chamada streaming com o fallback sem streaming do `queryModel` do CLI.
    ///
    /// A abertura do stream passa pelo retry de sempre. Depois que a resposta
    /// abriu (HTTP 200), QUALQUER erro na leitura do stream, antes ou depois
    /// do primeiro evento, faz a MESMA chamada ser repetida uma vez sem
    /// streaming: `event: error` no SSE (o que um model-router manda quando o
    /// provider primário cai), conexão cortada, JSON inválido, stream que
    /// termina sem `message_start` ou sem nenhum bloco e sem `stop_reason`, e
    /// o watchdog de inatividade. Não caem no fallback o timeout do próprio
    /// cliente HTTP, nem nada quando `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK`
    /// está ligado. Um 404 na abertura do stream também cai na não-streaming,
    /// e esse ignora a variável, como no CLI.
    ///
    /// O consumidor recebe [`StreamUpdate::NonStreamingFallback`] antes do
    /// `MessageComplete` que a não-streaming produziu.
    pub async fn create_message_with_fallback(
        &self,
        request: CreateMessageRequest,
    ) -> Result<Pin<Box<dyn Stream<Item = Result<StreamUpdate>> + Send>>> {
        let fallback_request = request.clone();
        let stream = match self.create_message_stream(request).await {
            Ok(stream) => stream,
            Err(err) if is_not_found(&err) => {
                let response = self
                    .create_message_non_streaming_fallback(fallback_request, 0)
                    .await?;
                let updates = vec![
                    Ok(StreamUpdate::NonStreamingFallback {
                        cause: err.to_string(),
                    }),
                    Ok(StreamUpdate::MessageComplete {
                        message: assistant_from_response(response),
                    }),
                ];
                return Ok(Box::pin(futures::stream::iter(updates)));
            }
            Err(err) => return Err(err),
        };

        let client = self.clone();
        let wrapper_stream = FallbackStream::new(stream, client, fallback_request);
        Ok(Box::pin(wrapper_stream))
    }

    /// Send a POST request with retry logic, returning the raw response for streaming.
    async fn send_with_retry(
        &self,
        url: &str,
        headers: &HeaderMap,
        request: &mut CreateMessageRequest,
    ) -> Result<reqwest::Response> {
        let mut body = request_body(request)?;
        let mut attempt = 0u32;
        let mut consecutive_529s = 0u32;

        loop {
            let response = self
                .http_client
                .post(url)
                .headers(headers.clone())
                .body(body.clone())
                .send()
                .await;

            match response {
                Ok(resp) => {
                    let status = resp.status().as_u16();
                    if status == 200 {
                        return Ok(resp);
                    }

                    let header = |name: &str| {
                        resp.headers()
                            .get(name)
                            .and_then(|v| v.to_str().ok().map(str::to_string))
                    };
                    let retry_after = header("retry-after");
                    let should_retry_header = header("x-should-retry");
                    let ratelimit_reset = header("anthropic-ratelimit-unified-reset");
                    let response_body = resp.text().await.ok();
                    let error_kind = apply_unified_reset(
                        ErrorKind::from_status(
                            status,
                            retry_after.as_deref(),
                            response_body.as_deref(),
                            should_retry_header.as_deref(),
                        ),
                        ratelimit_reset.as_deref(),
                    );

                    // Overflow de max_tokens: reduz para o espaço disponível e
                    // retenta a MESMA chamada (o que o withRetry do CLI faz),
                    // em vez de falhar a run.
                    if let ErrorKind::MaxTokensContextOverflow { available } = &error_kind {
                        let adjusted = available
                            .unwrap_or(crate::api::retry::FLOOR_OUTPUT_TOKENS)
                            .max(crate::api::retry::FLOOR_OUTPUT_TOKENS);
                        if request.max_tokens > adjusted && attempt < self.retry_config.max_retries
                        {
                            request.max_tokens = adjusted;
                            body = request_body(request)?;
                            attempt += 1;
                            continue;
                        }
                    }

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

                    let classified =
                        classify_api_error(status, response_body.as_deref().unwrap_or(""));
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

/// Serializa o request com os breakpoints de cache redistribuídos: toda
/// chamada a `/v1/messages` sai por aqui, então a regra vale para o loop
/// principal, subagentes, compactação e título, como vale no proxy do jai.
fn request_body(request: &CreateMessageRequest) -> Result<String> {
    let mut value = serde_json::to_value(request)
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize request: {e}")))?;
    crate::api::cache_breakpoints::optimize_cache_breakpoints(&mut value);
    serde_json::to_string(&value)
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize request: {e}")))
}

/// A resposta sem streaming no formato da mensagem que o stream fecharia.
fn assistant_from_response(response: ApiResponse) -> AssistantMessage {
    AssistantMessage {
        id: response.id,
        model: response.model,
        content: response.content,
        stop_reason: StopReason::from(response.stop_reason.as_ref()),
        usage: response.usage,
        api_error: None,
    }
}

/// A abertura do stream voltou 404 (o `CannotRetryError` com status 404 que
/// o CLI desvia para a não-streaming).
fn is_not_found(error: &ClaudeSDKError) -> bool {
    matches!(
        error,
        ClaudeSDKError::Process {
            exit_code: Some(404),
            ..
        }
    )
}

// ---------------------------------------------------------------------------
// SSE byte stream → StreamUpdate stream
// ---------------------------------------------------------------------------

/// Convert a raw byte stream (SSE) into a stream of StreamUpdate events.
///
/// Com `idle_timeout`, é o watchdog do CLI: o prazo recomeça a cada evento
/// do stream (o `ping` não conta, o iterador do SDK nem o entrega), e quando
/// estoura o stream é abandonado com erro. Um stream que termina limpo passa
/// pela regra de [`StreamAccumulator::end_of_stream`].
fn sse_to_stream_updates<S>(
    byte_stream: S,
    idle_timeout: Option<Duration>,
) -> impl Stream<Item = Result<StreamUpdate>>
where
    S: Stream<Item = std::result::Result<Bytes, reqwest::Error>> + Send + 'static,
{
    let (tx, rx) = tokio::sync::mpsc::channel::<Result<StreamUpdate>>(64);

    tokio::spawn(async move {
        let mut accumulator = StreamAccumulator::new();
        let mut buffer = String::new();
        let mut idle_deadline = idle_timeout.map(|d| tokio::time::Instant::now() + d);

        tokio::pin!(byte_stream);

        loop {
            let next = match idle_deadline {
                Some(deadline) => match tokio::time::timeout_at(deadline, byte_stream.next()).await
                {
                    Ok(next) => next,
                    Err(_) => {
                        let _ = tx
                            .send(Err(ClaudeSDKError::sdk(STREAM_IDLE_TIMEOUT_MESSAGE)))
                            .await;
                        return;
                    }
                },
                None => byte_stream.next().await,
            };
            let Some(chunk_result) = next else {
                break;
            };
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
                            let raw: Option<serde_json::Value> = serde_json::from_str(data).ok();
                            match parse_sse_data(data) {
                                Ok(stream_event) => {
                                    if !matches!(
                                        stream_event,
                                        StreamEvent::Ping | StreamEvent::Unknown
                                    ) {
                                        idle_deadline =
                                            idle_timeout.map(|d| tokio::time::Instant::now() + d);
                                    }
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
                                    // O evento cru sai DEPOIS do que ele produziu,
                                    // na ordem do `queryModel` do CLI.
                                    if let Some(event) = raw {
                                        if tx
                                            .send(Ok(StreamUpdate::RawEvent { event }))
                                            .await
                                            .is_err()
                                        {
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
                    let error = if e.is_timeout() {
                        ClaudeSDKError::cli_connection(STREAM_REQUEST_TIMEOUT_MESSAGE)
                    } else {
                        ClaudeSDKError::cli_connection(format!("Stream read error: {e}"))
                    };
                    let _ = tx.send(Err(error)).await;
                    return;
                }
            }
        }

        match accumulator.end_of_stream() {
            Ok(Some(update)) => {
                let _ = tx.send(Ok(update)).await;
            }
            Ok(None) => {}
            Err(e) => {
                let _ = tx.send(Err(e)).await;
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

/// Envolve um stream já aberto e, quando a leitura dele falha, repete a
/// MESMA chamada uma única vez sem streaming (o `catch (streamingError)` do
/// `queryModel` do CLI). O que o stream já entregou continua entregue; o
/// consumidor recebe [`StreamUpdate::NonStreamingFallback`] e depois o
/// `MessageComplete` da não-streaming, ou o erro dela.
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

        tokio::spawn(async move {
            tokio::pin!(inner);

            while let Some(item) = inner.next().await {
                let stream_error = match item {
                    Ok(update) => {
                        if tx.send(Ok(update)).await.is_err() {
                            return; // consumer dropped
                        }
                        continue;
                    }
                    Err(e) => e,
                };

                // O timeout do próprio cliente HTTP é o "Streaming timeout
                // (SDK abort)" do CLI, que sobe como erro; e a variável de
                // ambiente desliga o fallback.
                let is_client_timeout = matches!(
                    &stream_error,
                    ClaudeSDKError::CliConnection(message) if message == STREAM_REQUEST_TIMEOUT_MESSAGE
                );
                if is_client_timeout || client.stream_fallback.disabled {
                    let _ = tx.send(Err(stream_error)).await;
                    return;
                }

                let initial_529s = u32::from(is_529_error(&stream_error));
                if tx
                    .send(Ok(StreamUpdate::NonStreamingFallback {
                        cause: stream_error.to_string(),
                    }))
                    .await
                    .is_err()
                {
                    return;
                }

                // Consumidor que desistiu (interrupção) cancela a chamada.
                let outcome = tokio::select! {
                    result = client.create_message_non_streaming_fallback(request, initial_529s) => result,
                    () = tx.closed() => return,
                };
                let update = outcome.map(|response| StreamUpdate::MessageComplete {
                    message: assistant_from_response(response),
                });
                let _ = tx.send(update).await;
                return;
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
    fn stream_fallback_config_reads_the_cli_env_vars() {
        let config = |pairs: &[(&str, &str)]| {
            let map: std::collections::HashMap<String, String> = pairs
                .iter()
                .map(|(k, v)| ((*k).to_string(), (*v).to_string()))
                .collect();
            StreamFallbackConfig::from_env(|key| map.get(key).cloned())
        };

        let defaults = config(&[]);
        assert!(!defaults.disabled);
        assert_eq!(defaults.idle_timeout, None);
        assert_eq!(defaults.non_streaming_timeout, Duration::from_secs(300));

        let custom = config(&[
            ("CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK", "true"),
            ("CLAUDE_ENABLE_STREAM_WATCHDOG", "1"),
            ("API_TIMEOUT_MS", "4500"),
        ]);
        assert!(custom.disabled);
        assert_eq!(custom.idle_timeout, Some(Duration::from_secs(90)));
        assert_eq!(custom.non_streaming_timeout, Duration::from_millis(4500));

        let remote = config(&[
            ("CLAUDE_CODE_REMOTE", "yes"),
            ("CLAUDE_ENABLE_STREAM_WATCHDOG", "on"),
            ("CLAUDE_STREAM_IDLE_TIMEOUT_MS", "2000"),
        ]);
        assert_eq!(remote.non_streaming_timeout, Duration::from_secs(120));
        assert_eq!(remote.idle_timeout, Some(Duration::from_secs(2)));

        // O watchdog só liga com a variável própria.
        assert_eq!(
            config(&[("CLAUDE_STREAM_IDLE_TIMEOUT_MS", "2000")]).idle_timeout,
            None
        );
    }

    #[test]
    fn non_streaming_params_cap_max_tokens_and_the_thinking_budget() {
        let mut request = CreateMessageRequest::new("m", 100_000, Vec::new());
        request.thinking = Some(ThinkingParam::enabled(80_000));
        adjust_params_for_non_streaming(&mut request, MAX_NON_STREAMING_TOKENS);
        assert_eq!(request.max_tokens, 64_000);
        assert_eq!(
            request.thinking.as_ref().and_then(|t| t.budget_tokens),
            Some(63_999)
        );

        let mut small = CreateMessageRequest::new("m", 8_000, Vec::new());
        small.thinking = Some(ThinkingParam::enabled(4_000));
        adjust_params_for_non_streaming(&mut small, MAX_NON_STREAMING_TOKENS);
        assert_eq!(small.max_tokens, 8_000);
        assert_eq!(
            small.thinking.as_ref().and_then(|t| t.budget_tokens),
            Some(4_000)
        );
    }

    #[test]
    fn overloaded_stream_errors_count_as_529() {
        assert!(is_529_error(&ClaudeSDKError::sdk(
            "API stream error: overloaded_error - Overloaded"
        )));
        assert!(is_529_error(&ClaudeSDKError::process("x", Some(529), None)));
        assert!(!is_529_error(&ClaudeSDKError::sdk(
            "API stream error: api_error - boom"
        )));
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
        assert_eq!(client.beta_features.len(), 4); // 3 defaults + 1
    }
}
