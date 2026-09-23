//! Transporte HTTP streamável do MCP (spec 2025-03-26 em diante), port do
//! `StreamableHTTPClientTransport` que o CLI embute, menos o OAuth: aqui o
//! token chega pronto nos `headers` da configuração.
//!
//! O que o port preserva, e por quê:
//! - toda mensagem vai por POST com `Accept: application/json, text/event-stream`,
//!   e a resposta pode vir num JSON só ou num stream de eventos; um servidor
//!   escolhe por request, então o cliente aceita os dois sempre;
//! - o `mcp-session-id` que o servidor devolve volta em toda request seguinte,
//!   e a versão negociada no `initialize` vai em `mcp-protocol-version`;
//! - um stream que fecha antes da resposta é retomado por GET com
//!   `last-event-id`, com o mesmo recuo e o mesmo teto de tentativas do CLI
//!   (1 s, fator 1,5, teto de 30 s, duas tentativas);
//! - depois do `notifications/initialized` abre-se o GET de longa duração
//!   por onde o servidor manda o que quiser; 405 quer dizer que ele não tem
//!   isso, e não é erro;
//! - os cabeçalhos da configuração entram por cima dos comuns, como no CLI,
//!   para quem precisa forçar um `Authorization` próprio;
//! - `close` encerra a sessão com DELETE, e 405 é aceito.

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use eventsource_stream::{Event, Eventsource};
use futures::{Stream, StreamExt};
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, CONTENT_TYPE};
use reqwest::{StatusCode, Url};
use serde_json::Value;

use crate::mcp::error::McpError;
use crate::mcp::transport::McpTransport;

/// Cabeçalho da sessão que o servidor abre no `initialize`.
pub const SESSION_HEADER: &str = "mcp-session-id";

/// Cabeçalho da versão negociada, presente em toda request após o `initialize`.
pub const PROTOCOL_VERSION_HEADER: &str = "mcp-protocol-version";

/// Cabeçalho da retomada de um stream interrompido.
pub const LAST_EVENT_ID_HEADER: &str = "last-event-id";

/// O `Accept` de toda request: o servidor decide se responde JSON ou stream.
pub const ACCEPT_BOTH: &str = "application/json, text/event-stream";

const EVENT_STREAM: &str = "text/event-stream";

const JSON: &str = "application/json";

/// `DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS` do CLI.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Reconnection {
    pub initial_delay: Duration,
    pub max_delay: Duration,
    pub grow_factor: f64,
    pub max_retries: u32,
}

impl Default for Reconnection {
    fn default() -> Self {
        Self {
            initial_delay: Duration::from_millis(1000),
            max_delay: Duration::from_millis(30000),
            grow_factor: 1.5,
            max_retries: 2,
        }
    }
}

impl Reconnection {
    /// O intervalo antes da tentativa `attempt`: o que o servidor pediu em
    /// `retry:`, se pediu; senão o recuo exponencial com teto.
    pub fn delay(&self, attempt: u32, server_retry: Option<Duration>) -> Duration {
        if let Some(retry) = server_retry {
            return retry;
        }
        let grown = self.initial_delay.as_secs_f64() * self.grow_factor.powi(attempt as i32);
        Duration::from_secs_f64(grown.min(self.max_delay.as_secs_f64()))
    }
}

/// O que o cliente já viu do stream: o último `id` (token de retomada) e o
/// último `retry:` que o servidor pediu.
#[derive(Debug, Default, Clone)]
struct Cursor {
    last_event_id: Option<String>,
    server_retry: Option<Duration>,
}

impl Cursor {
    fn note(&mut self, event: &Event) {
        if !event.id.is_empty() {
            self.last_event_id = Some(event.id.clone());
        }
        if let Some(retry) = event.retry {
            self.server_retry = Some(retry);
        }
    }
}

struct Inner {
    url: Url,
    headers: HeaderMap,
    client: reqwest::Client,
    request_timeout: Duration,
    reconnection: Reconnection,
    session_id: Mutex<Option<String>>,
    protocol_version: Mutex<Option<String>>,
}

impl Inner {
    fn locked<T: Clone>(slot: &Mutex<Option<T>>) -> Option<T> {
        slot.lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .clone()
    }

    fn set<T>(slot: &Mutex<Option<T>>, value: Option<T>) {
        *slot.lock().unwrap_or_else(|poisoned| poisoned.into_inner()) = value;
    }

    /// `_commonHeaders` do CLI: sessão, versão, e os da configuração por cima.
    fn common_headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        if let Some(session) = Self::locked(&self.session_id) {
            if let Ok(value) = HeaderValue::from_str(&session) {
                headers.insert(SESSION_HEADER, value);
            }
        }
        if let Some(version) = Self::locked(&self.protocol_version) {
            if let Ok(value) = HeaderValue::from_str(&version) {
                headers.insert(PROTOCOL_VERSION_HEADER, value);
            }
        }
        for (name, value) in &self.headers {
            headers.insert(name.clone(), value.clone());
        }
        headers
    }

    /// O POST de uma mensagem, com o prazo do CLI para os cabeçalhos da
    /// resposta chegarem. O corpo pode demorar mais: é um stream.
    async fn post(&self, body: &Value) -> Result<reqwest::Response, McpError> {
        let request = self
            .client
            .post(self.url.clone())
            .headers(self.common_headers())
            .header(CONTENT_TYPE, JSON)
            .header(ACCEPT, ACCEPT_BOTH)
            .json(body);
        let sent = tokio::time::timeout(self.request_timeout, request.send())
            .await
            .map_err(|_| McpError::Timeout {
                what: "MCP request".to_string(),
                after: self.request_timeout,
            })?
            .map_err(McpError::transport)?;
        if let Some(session) = sent
            .headers()
            .get(SESSION_HEADER)
            .and_then(|value| value.to_str().ok())
        {
            Self::set(&self.session_id, Some(session.to_string()));
        }
        let status = sent.status();
        if status.is_success() {
            return Ok(sent);
        }
        Err(McpError::Http {
            status: status.as_u16(),
            body: sent.text().await.unwrap_or_default(),
        })
    }

    /// O GET de um stream de eventos. `Ok(None)` é o 405 do servidor que não
    /// oferece stream nenhum, que o CLI trata como ausência e não como falha.
    async fn get_stream(
        &self,
        last_event_id: Option<&str>,
    ) -> Result<Option<reqwest::Response>, McpError> {
        let mut request = self
            .client
            .get(self.url.clone())
            .headers(self.common_headers())
            .header(ACCEPT, EVENT_STREAM);
        if let Some(token) = last_event_id {
            request = request.header(LAST_EVENT_ID_HEADER, token);
        }
        let response = request.send().await.map_err(McpError::transport)?;
        let status = response.status();
        if status == StatusCode::METHOD_NOT_ALLOWED {
            return Ok(None);
        }
        if !status.is_success() {
            return Err(McpError::Http {
                status: status.as_u16(),
                body: response.text().await.unwrap_or_default(),
            });
        }
        Ok(Some(response))
    }

    /// Lê o stream até a resposta ao id pedido, anotando o cursor no caminho.
    async fn scan<S, E>(stream: &mut S, id: u64, cursor: &mut Cursor) -> Option<Value>
    where
        S: Stream<Item = Result<Event, E>> + Unpin,
    {
        while let Some(Ok(event)) = stream.next().await {
            cursor.note(&event);
            if let Some(reply) = reply_for(&event, id) {
                return Some(reply);
            }
        }
        None
    }

    /// A resposta veio num stream: lê até o nosso id, e se o stream fechar
    /// antes, retoma pelo `last-event-id` como o CLI faz.
    async fn answered_on_stream(
        &self,
        response: reqwest::Response,
        id: u64,
    ) -> Result<Value, McpError> {
        let mut stream = response.bytes_stream().eventsource();
        let mut cursor = Cursor::default();
        if let Some(reply) = Self::scan(&mut stream, id, &mut cursor).await {
            return settled(reply);
        }
        self.resumed(id, cursor).await
    }

    async fn resumed(&self, id: u64, mut cursor: Cursor) -> Result<Value, McpError> {
        if cursor.last_event_id.is_none() {
            return Err(McpError::Closed(
                "the event stream ended before the response".to_string(),
            ));
        }
        for attempt in 0..self.reconnection.max_retries {
            tokio::time::sleep(self.reconnection.delay(attempt, cursor.server_retry)).await;
            let Ok(Some(response)) = self.get_stream(cursor.last_event_id.as_deref()).await else {
                continue;
            };
            let mut stream = response.bytes_stream().eventsource();
            if let Some(reply) = Self::scan(&mut stream, id, &mut cursor).await {
                return settled(reply);
            }
        }
        Err(McpError::Closed(format!(
            "maximum reconnection attempts ({}) exceeded",
            self.reconnection.max_retries
        )))
    }
}

/// O GET de longa duração que o CLI abre depois do `initialized`: por ele o
/// servidor manda notificações. Sem handler para requests do servidor, tudo
/// que chega é lido e descartado; o que importa é manter o canal aberto e
/// retomá-lo com o token quando cair, dentro do teto de tentativas.
async fn listen(inner: Arc<Inner>) {
    let mut cursor = Cursor::default();
    let mut attempt = 0;
    loop {
        match inner.get_stream(cursor.last_event_id.as_deref()).await {
            Ok(None) => return,
            Ok(Some(response)) => {
                attempt = 0;
                let mut stream = response.bytes_stream().eventsource();
                while let Some(Ok(event)) = stream.next().await {
                    cursor.note(&event);
                }
            }
            Err(_) => {}
        }
        if attempt >= inner.reconnection.max_retries {
            return;
        }
        tokio::time::sleep(inner.reconnection.delay(attempt, cursor.server_retry)).await;
        attempt += 1;
    }
}

/// A mensagem JSON-RPC de um evento, se for a resposta ao id pedido. Um
/// evento pode trazer uma mensagem ou um lote delas.
fn reply_for(event: &Event, id: u64) -> Option<Value> {
    if !(event.event.is_empty() || event.event == "message") || event.data.is_empty() {
        return None;
    }
    let parsed: Value = serde_json::from_str(&event.data).ok()?;
    match parsed {
        Value::Array(messages) => messages.into_iter().find(|message| is_reply(message, id)),
        message if is_reply(&message, id) => Some(message),
        _ => None,
    }
}

fn is_reply(message: &Value, id: u64) -> bool {
    message.get("id").and_then(Value::as_u64) == Some(id)
        && (message.get("result").is_some() || message.get("error").is_some())
}

/// De uma resposta JSON-RPC ao resultado, ou ao erro que ela carrega.
pub(crate) fn settled(reply: Value) -> Result<Value, McpError> {
    if let Some(error) = reply.get("error") {
        return Err(McpError::Rpc {
            code: error
                .get("code")
                .and_then(Value::as_i64)
                .unwrap_or_default(),
            message: error
                .get("message")
                .and_then(Value::as_str)
                .unwrap_or("MCP error")
                .to_string(),
        });
    }
    Ok(reply.get("result").cloned().unwrap_or(Value::Null))
}

/// A mensagem JSON-RPC: request quando tem id, notificação quando não tem.
/// `params` só entra quando existe, porque `tools/list` sem cursor vai sem.
pub(crate) fn envelope(id: Option<u64>, method: &str, params: Option<Value>) -> Value {
    let mut message = serde_json::Map::new();
    message.insert("jsonrpc".to_string(), Value::String("2.0".to_string()));
    if let Some(id) = id {
        message.insert("id".to_string(), Value::from(id));
    }
    message.insert("method".to_string(), Value::String(method.to_string()));
    if let Some(params) = params {
        message.insert("params".to_string(), params);
    }
    Value::Object(message)
}

pub struct StreamableHttpTransport {
    inner: Arc<Inner>,
    next_id: AtomicU64,
    listener: Mutex<Option<tokio::task::JoinHandle<()>>>,
}

impl StreamableHttpTransport {
    /// Um transporte para `url`, com os cabeçalhos da configuração e o prazo
    /// de cada POST (o `MCP_REQUEST_TIMEOUT_MS` do CLI, 60 s).
    pub fn new(url: Url, headers: HeaderMap, request_timeout: Duration) -> Result<Self, McpError> {
        Self::with_reconnection(url, headers, request_timeout, Reconnection::default())
    }

    pub fn with_reconnection(
        url: Url,
        headers: HeaderMap,
        request_timeout: Duration,
        reconnection: Reconnection,
    ) -> Result<Self, McpError> {
        let client = reqwest::Client::builder()
            .user_agent(concat!(
                env!("CARGO_PKG_NAME"),
                "/",
                env!("CARGO_PKG_VERSION")
            ))
            .build()
            .map_err(McpError::transport)?;
        Ok(Self {
            inner: Arc::new(Inner {
                url,
                headers,
                client,
                request_timeout,
                reconnection,
                session_id: Mutex::new(None),
                protocol_version: Mutex::new(None),
            }),
            next_id: AtomicU64::new(1),
            listener: Mutex::new(None),
        })
    }

    /// A sessão que o servidor abriu, se abriu.
    pub fn session_id(&self) -> Option<String> {
        Inner::locked(&self.inner.session_id)
    }

    /// A versão negociada, depois do `initialize`.
    pub fn protocol_version(&self) -> Option<String> {
        Inner::locked(&self.inner.protocol_version)
    }

    fn stop_listening(&self) {
        if let Some(task) = self
            .listener
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner())
            .take()
        {
            task.abort();
        }
    }

    /// `terminateSession` do CLI: DELETE com a sessão; 405 é aceito.
    async fn terminate_session(&self) {
        if self.session_id().is_none() {
            return;
        }
        let request = self
            .inner
            .client
            .delete(self.inner.url.clone())
            .headers(self.inner.common_headers());
        let _ = tokio::time::timeout(self.inner.request_timeout, request.send()).await;
        Inner::set(&self.inner.session_id, None);
    }
}

impl Drop for StreamableHttpTransport {
    fn drop(&mut self) {
        self.stop_listening();
    }
}

#[async_trait::async_trait]
impl McpTransport for StreamableHttpTransport {
    async fn request(&self, method: &str, params: Option<Value>) -> Result<Value, McpError> {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let response = self.inner.post(&envelope(Some(id), method, params)).await?;
        let status = response.status();
        if status == StatusCode::ACCEPTED || status == StatusCode::NO_CONTENT {
            return Err(McpError::Transport(format!(
                "server accepted '{method}' with HTTP {status} but a request needs a response"
            )));
        }
        let content_type = response
            .headers()
            .get(CONTENT_TYPE)
            .and_then(|value| value.to_str().ok())
            .unwrap_or_default()
            .to_ascii_lowercase();
        if content_type.contains(EVENT_STREAM) {
            return self.inner.answered_on_stream(response, id).await;
        }
        if content_type.contains(JSON) {
            let payload: Value = response.json().await.map_err(McpError::transport)?;
            let reply = match payload {
                Value::Array(messages) => {
                    messages.into_iter().find(|message| is_reply(message, id))
                }
                message if is_reply(&message, id) => Some(message),
                _ => None,
            };
            return settled(reply.ok_or_else(|| {
                McpError::Transport(format!("no JSON-RPC response to '{method}' in the body"))
            })?);
        }
        Err(McpError::Transport(format!(
            "Unexpected content type: {content_type}"
        )))
    }

    async fn notify(&self, method: &str, params: Option<Value>) -> Result<(), McpError> {
        self.inner.post(&envelope(None, method, params)).await?;
        if method == "notifications/initialized" {
            let inner = Arc::clone(&self.inner);
            let task = tokio::spawn(listen(inner));
            self.stop_listening();
            *self
                .listener
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner()) = Some(task);
        }
        Ok(())
    }

    fn set_protocol_version(&self, version: &str) {
        Inner::set(&self.inner.protocol_version, Some(version.to_string()));
    }

    async fn close(&self) {
        self.stop_listening();
        self.terminate_session().await;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn event(name: &str, data: &str, id: &str) -> Event {
        Event {
            event: name.to_string(),
            data: data.to_string(),
            id: id.to_string(),
            retry: None,
        }
    }

    #[test]
    fn only_a_message_event_with_our_id_and_an_outcome_is_the_reply() {
        let ours = event(
            "message",
            r#"{"jsonrpc":"2.0","id":7,"result":{"ok":true}}"#,
            "",
        );
        assert!(reply_for(&ours, 7).is_some());
        assert!(reply_for(&ours, 8).is_none());
        let unnamed = event(
            "",
            r#"{"jsonrpc":"2.0","id":7,"error":{"code":1,"message":"x"}}"#,
            "",
        );
        assert!(reply_for(&unnamed, 7).is_some());
        let notification = event(
            "message",
            r#"{"jsonrpc":"2.0","method":"notifications/message"}"#,
            "",
        );
        assert!(reply_for(&notification, 7).is_none());
        let request_from_server = event(
            "message",
            r#"{"jsonrpc":"2.0","id":7,"method":"roots/list"}"#,
            "",
        );
        assert!(reply_for(&request_from_server, 7).is_none());
        let other_kind = event("endpoint", r#"{"jsonrpc":"2.0","id":7,"result":{}}"#, "");
        assert!(reply_for(&other_kind, 7).is_none());
        let batched = event(
            "message",
            r#"[{"jsonrpc":"2.0","id":6,"result":1},{"jsonrpc":"2.0","id":7,"result":2}]"#,
            "",
        );
        assert_eq!(
            reply_for(&batched, 7).and_then(|m| m.get("result").cloned()),
            Some(Value::from(2))
        );
    }

    #[test]
    fn the_cursor_keeps_the_last_id_and_the_server_retry() {
        let mut cursor = Cursor::default();
        cursor.note(&event("message", "{}", "ev-1"));
        cursor.note(&event("message", "{}", ""));
        assert_eq!(cursor.last_event_id.as_deref(), Some("ev-1"));
        let mut with_retry = event("message", "{}", "ev-2");
        with_retry.retry = Some(Duration::from_millis(250));
        cursor.note(&with_retry);
        assert_eq!(cursor.last_event_id.as_deref(), Some("ev-2"));
        assert_eq!(cursor.server_retry, Some(Duration::from_millis(250)));
    }

    #[test]
    fn the_reconnection_delay_grows_and_is_capped_unless_the_server_says_otherwise() {
        let policy = Reconnection::default();
        assert_eq!(policy.delay(0, None), Duration::from_millis(1000));
        assert_eq!(policy.delay(1, None), Duration::from_millis(1500));
        assert_eq!(policy.delay(20, None), Duration::from_millis(30000));
        assert_eq!(
            policy.delay(20, Some(Duration::from_millis(10))),
            Duration::from_millis(10)
        );
    }

    #[test]
    fn a_notification_has_no_id_and_no_empty_params() {
        let notification = envelope(None, "notifications/initialized", None);
        assert!(notification.get("id").is_none());
        assert!(notification.get("params").is_none());
        let request = envelope(
            Some(3),
            "tools/list",
            Some(serde_json::json!({"cursor": "x"})),
        );
        assert_eq!(request["id"], Value::from(3));
        assert_eq!(request["params"]["cursor"], Value::from("x"));
    }

    #[test]
    fn an_error_reply_becomes_an_rpc_error_with_its_code() {
        let error = settled(
            serde_json::json!({"jsonrpc":"2.0","id":1,"error":{"code":-32601,"message":"nope"}}),
        );
        assert_eq!(
            error,
            Err(McpError::Rpc {
                code: -32601,
                message: "nope".to_string()
            })
        );
        let ok = settled(serde_json::json!({"jsonrpc":"2.0","id":1,"result":{"tools":[]}}));
        assert_eq!(ok, Ok(serde_json::json!({"tools":[]})));
    }
}
