//! Transporte SSE do MCP (o de 2024-11-05), port do `SSEClientTransport` que
//! o CLI embute: um GET de longa duração traz primeiro o evento `endpoint` e
//! depois as respostas; as requests vão por POST no endpoint anunciado.
//!
//! Duas decisões do CLI preservadas de propósito:
//! - o endpoint precisa ter a MESMA origem do stream. Um servidor não pode
//!   mandar o cliente postar os cabeçalhos (com credencial) em outro host;
//! - o corpo do POST é descartado: a resposta vem sempre pelo stream. Quem
//!   responde no corpo do POST é servidor fora da spec, e o CLI o ignora.

use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use eventsource_stream::Eventsource;
use futures::StreamExt;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, CONTENT_TYPE};
use reqwest::Url;
use serde_json::Value;
use tokio::sync::oneshot;

use crate::mcp::error::McpError;
use crate::mcp::http::{envelope, settled, PROTOCOL_VERSION_HEADER};
use crate::mcp::transport::McpTransport;

const EVENT_STREAM: &str = "text/event-stream";

const JSON: &str = "application/json";

type Pending = Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>>;

struct Inner {
    headers: HeaderMap,
    client: reqwest::Client,
    request_timeout: Duration,
    protocol_version: Mutex<Option<String>>,
}

impl Inner {
    fn common_headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        let version = self
            .protocol_version
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .clone();
        if let Some(value) = version.and_then(|text| HeaderValue::from_str(&text).ok()) {
            headers.insert(PROTOCOL_VERSION_HEADER, value);
        }
        for (name, value) in &self.headers {
            headers.insert(name.clone(), value.clone());
        }
        headers
    }
}

pub struct SseTransport {
    inner: Arc<Inner>,
    endpoint: Url,
    pending: Pending,
    next_id: AtomicU64,
    reader: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl SseTransport {
    /// Abre o stream em `url`, espera o `endpoint`, e deixa um leitor
    /// roteando as respostas. Quem chama põe o prazo por fora: é a conexão
    /// inteira que tem prazo no CLI, não este passo.
    pub async fn connect(
        url: Url,
        headers: HeaderMap,
        request_timeout: Duration,
    ) -> Result<Self, McpError> {
        let client = reqwest::Client::builder()
            .user_agent(format!("rust-agent-sdk/{}", env!("CARGO_PKG_VERSION")))
            .build()
            .map_err(McpError::transport)?;
        let inner = Arc::new(Inner {
            headers,
            client,
            request_timeout,
            protocol_version: Mutex::new(None),
        });
        let response = inner
            .client
            .get(url.clone())
            .headers(inner.common_headers())
            .header(ACCEPT, EVENT_STREAM)
            .send()
            .await
            .map_err(McpError::transport)?;
        let status = response.status();
        if !status.is_success() {
            return Err(McpError::Http {
                status: status.as_u16(),
                body: response.text().await.unwrap_or_default(),
            });
        }
        let mut stream = Box::pin(response.bytes_stream().eventsource());
        let endpoint = loop {
            match stream.next().await {
                Some(Ok(event)) if event.event == "endpoint" => {
                    break resolve_endpoint(&url, &event.data)?;
                }
                Some(Ok(_)) => continue,
                Some(Err(error)) => return Err(McpError::transport(error)),
                None => {
                    return Err(McpError::Closed(
                        "the SSE stream closed before announcing the endpoint".to_string(),
                    ))
                }
            }
        };
        let pending: Pending = Arc::new(Mutex::new(HashMap::new()));
        let routed = Arc::clone(&pending);
        let reader = tokio::spawn(async move {
            while let Some(Ok(event)) = stream.next().await {
                if !(event.event.is_empty() || event.event == "message") {
                    continue;
                }
                let Ok(message) = serde_json::from_str::<Value>(&event.data) else {
                    continue;
                };
                let Some(id) = message.get("id").and_then(Value::as_u64) else {
                    continue;
                };
                let waiting = routed
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner())
                    .remove(&id);
                if let Some(waiting) = waiting {
                    let _ = waiting.send(message);
                }
            }
            // O stream fechou: quem espera recebe o fechamento, não um prazo.
            routed
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner())
                .clear();
        });
        Ok(Self {
            inner,
            endpoint,
            pending,
            next_id: AtomicU64::new(1),
            reader: Mutex::new(Some(reader)),
        })
    }

    /// O endpoint que o servidor anunciou.
    pub fn endpoint(&self) -> &Url {
        &self.endpoint
    }

    fn forget(&self, id: u64) {
        self.pending
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .remove(&id);
    }

    async fn post(&self, body: &Value) -> Result<(), McpError> {
        let request = self
            .inner
            .client
            .post(self.endpoint.clone())
            .headers(self.inner.common_headers())
            .header(CONTENT_TYPE, JSON)
            .json(body);
        let response = tokio::time::timeout(self.inner.request_timeout, request.send())
            .await
            .map_err(|_| McpError::Timeout {
                what: "MCP request".to_string(),
                after: self.inner.request_timeout,
            })?
            .map_err(McpError::transport)?;
        let status = response.status();
        if status.is_success() {
            return Ok(());
        }
        Err(McpError::Http {
            status: status.as_u16(),
            body: response.text().await.unwrap_or_default(),
        })
    }

    fn stop_reading(&self) {
        if let Some(task) = self
            .reader
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .take()
        {
            task.abort();
        }
        self.pending
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .clear();
    }
}

impl Drop for SseTransport {
    fn drop(&mut self) {
        self.stop_reading();
    }
}

/// `new URL(data, url)` mais a checagem de origem do CLI.
fn resolve_endpoint(base: &Url, data: &str) -> Result<Url, McpError> {
    let endpoint = base
        .join(data.trim())
        .map_err(|error| McpError::Transport(format!("invalid endpoint '{data}': {error}")))?;
    if endpoint.origin() != base.origin() {
        return Err(McpError::Transport(format!(
            "Endpoint origin does not match connection origin: {}",
            endpoint.origin().ascii_serialization()
        )));
    }
    Ok(endpoint)
}

#[async_trait::async_trait]
impl McpTransport for SseTransport {
    async fn request(&self, method: &str, params: Option<Value>) -> Result<Value, McpError> {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let (tx, rx) = oneshot::channel();
        self.pending
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .insert(id, tx);
        if let Err(error) = self.post(&envelope(Some(id), method, params)).await {
            self.forget(id);
            return Err(error);
        }
        match rx.await {
            Ok(reply) => settled(reply),
            Err(_) => Err(McpError::Closed(format!(
                "the SSE stream closed before responding to '{method}'"
            ))),
        }
    }

    async fn notify(&self, method: &str, params: Option<Value>) -> Result<(), McpError> {
        self.post(&envelope(None, method, params)).await
    }

    fn set_protocol_version(&self, version: &str) {
        *self
            .inner
            .protocol_version
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner()) = Some(version.to_string());
    }

    async fn close(&self) {
        self.stop_reading();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_endpoint_is_resolved_against_the_stream_url() {
        let base = Url::parse("http://h:1/sse").unwrap();
        assert_eq!(
            resolve_endpoint(&base, "/messages?s=1").unwrap().as_str(),
            "http://h:1/messages?s=1"
        );
        let nested = Url::parse("http://h:1/a/sse").unwrap();
        assert_eq!(
            resolve_endpoint(&nested, "messages").unwrap().as_str(),
            "http://h:1/a/messages"
        );
    }

    #[test]
    fn an_endpoint_on_another_origin_is_refused() {
        let base = Url::parse("http://h:1/sse").unwrap();
        let refused = resolve_endpoint(&base, "https://outro/x");
        assert!(matches!(refused, Err(McpError::Transport(reason)) if reason.contains("origin")));
        let other_port = resolve_endpoint(&base, "http://h:2/x");
        assert!(other_port.is_err());
    }
}
