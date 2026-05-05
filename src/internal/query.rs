use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use serde_json::json;
use tokio::sync::{mpsc, Notify, oneshot};

use crate::errors::{ClaudeSDKError, Result};
use crate::internal::task::{spawn_detached, TaskHandle};
use crate::internal::transport::Transport;
use crate::internal::transcript_mirror::TranscriptMirrorBatcher;
use crate::types::{
    CanUseToolFn, HookCallbackFn, PermissionMode, PermissionResult, ToolPermissionContext,
};

/// Convert Python-safe field names to CLI-expected field names.
fn convert_hook_output_for_cli(hook_output: serde_json::Value) -> serde_json::Value {
    if let serde_json::Value::Object(map) = hook_output {
        let mut converted = serde_json::Map::new();
        for (key, value) in map {
            match key.as_str() {
                "async_" => { converted.insert("async".to_string(), value); }
                "continue_" => { converted.insert("continue".to_string(), value); }
                _ => { converted.insert(key, value); }
            }
        }
        serde_json::Value::Object(converted)
    } else {
        hook_output
    }
}

/// Query — bidirectional control protocol handler.
///
/// Manages:
/// - Control request/response routing
/// - Hook callbacks
/// - Tool permission callbacks
/// - Message streaming via background read task
/// - Initialization handshake
pub struct Query {
    transport: Box<dyn Transport>,
    is_streaming_mode: bool,
    initialize_timeout: f64,

    // Control protocol state
    request_counter: u64,
    pending_control_responses: Arc<Mutex<HashMap<String, oneshot::Sender<std::result::Result<serde_json::Value, String>>>>>,

    // Callbacks
    can_use_tool: Option<CanUseToolFn>,
    hook_callbacks: Arc<Mutex<HashMap<String, HookCallbackFn>>>,
    next_callback_id: u64,

    // Message channel (background read task -> consumer)
    message_tx: Option<mpsc::Sender<serde_json::Value>>,
    message_rx: Option<mpsc::Receiver<serde_json::Value>>,

    // Task tracking
    _read_task: Option<TaskHandle>,
    child_tasks: Vec<TaskHandle>,

    closed: bool,
    _initialized: bool,
    _initialization_result: Option<serde_json::Value>,

    // First result event for proper stream closure
    first_result_event: Arc<Notify>,
    first_result_fired: Arc<Mutex<bool>>,

    // Session store mirroring
    transcript_mirror_batcher: Option<Arc<TranscriptMirrorBatcher>>,

    // Hooks and SDK MCP servers (stored for wait_for_result logic)
    hooks: HashMap<String, Vec<serde_json::Value>>,
    sdk_mcp_servers: HashMap<String, serde_json::Value>,

    // Agent definitions and skills for initialize
    agents: Option<serde_json::Value>,
    exclude_dynamic_sections: Option<bool>,
    skills: Option<serde_json::Value>,

    // Whether end_input should be called by receive_messages
    // (set by spawn_wait_for_result_and_end_input)
    _needs_end_input: bool,
}

impl Query {
    pub fn new(
        transport: Box<dyn Transport>,
        is_streaming_mode: bool,
        initialize_timeout: f64,
    ) -> Self {
        let (tx, rx) = mpsc::channel(100);
        Self {
            transport,
            is_streaming_mode,
            initialize_timeout,
            request_counter: 0,
            pending_control_responses: Arc::new(Mutex::new(HashMap::new())),
            can_use_tool: None,
            hook_callbacks: Arc::new(Mutex::new(HashMap::new())),
            next_callback_id: 0,
            message_tx: Some(tx),
            message_rx: Some(rx),
            _read_task: None,
            child_tasks: Vec::new(),
            closed: false,
            _initialized: false,
            _initialization_result: None,
            first_result_event: Arc::new(Notify::new()),
            first_result_fired: Arc::new(Mutex::new(false)),
            transcript_mirror_batcher: None,
            hooks: HashMap::new(),
            sdk_mcp_servers: HashMap::new(),
            agents: None,
            exclude_dynamic_sections: None,
            skills: None,
            _needs_end_input: false,
        }
    }

    pub fn set_can_use_tool(&mut self, callback: CanUseToolFn) {
        self.can_use_tool = Some(callback);
    }

    pub fn set_hooks(&mut self, hooks: HashMap<String, Vec<serde_json::Value>>) {
        self.hooks = hooks;
    }

    pub fn set_agents(&mut self, agents: serde_json::Value) {
        self.agents = Some(agents);
    }

    pub fn set_exclude_dynamic_sections(&mut self, val: bool) {
        self.exclude_dynamic_sections = Some(val);
    }

    pub fn set_skills(&mut self, skills: serde_json::Value) {
        self.skills = Some(skills);
    }

    pub fn set_transcript_mirror_batcher(&mut self, batcher: TranscriptMirrorBatcher) {
        self.transcript_mirror_batcher = Some(Arc::new(batcher));
    }

    pub fn report_mirror_error(&self, key: Option<crate::types::SessionKey>, error: String) {
        let msg = json!({
            "type": "system",
            "subtype": "mirror_error",
            "error": error,
            "key": key,
            "uuid": uuid::Uuid::new_v4().to_string(),
            "session_id": key.as_ref().map(|k| k.session_id.as_str()).unwrap_or(""),
        });
        if let Some(ref tx) = self.message_tx {
            let _ = tx.try_send(msg);
        }
    }

    pub async fn initialize(&mut self) -> Result<Option<serde_json::Value>> {
        if !self.is_streaming_mode {
            return Ok(None);
        }

        // Build hooks configuration for initialization
        let mut hooks_config = serde_json::Map::new();
        for (event, matchers) in &self.hooks {
            if !matchers.is_empty() {
                let mut event_matchers = Vec::new();
                for matcher in matchers {
                    let mut callback_ids = Vec::new();
                    if let Some(hooks_arr) = matcher.get("hooks").and_then(|h| h.as_array()) {
                        for _ in hooks_arr {
                            let callback_id = format!("hook_{}", self.next_callback_id);
                            self.next_callback_id += 1;
                            callback_ids.push(serde_json::Value::String(callback_id));
                        }
                    }
                    let mut hook_matcher_config = serde_json::Map::new();
                    hook_matcher_config.insert("matcher".to_string(), matcher.get("matcher").cloned().unwrap_or(serde_json::Value::Null));
                    hook_matcher_config.insert("hookCallbackIds".to_string(), serde_json::Value::Array(callback_ids));
                    if let Some(timeout) = matcher.get("timeout") {
                        hook_matcher_config.insert("timeout".to_string(), timeout.clone());
                    }
                    event_matchers.push(serde_json::Value::Object(hook_matcher_config));
                }
                hooks_config.insert(event.clone(), serde_json::Value::Array(event_matchers));
            }
        }

        // Send initialize request
        let mut request = json!({
            "subtype": "initialize",
            "hooks": if hooks_config.is_empty() { serde_json::Value::Null } else { serde_json::Value::Object(hooks_config) },
        });

        if let Some(ref agents) = self.agents {
            request.as_object_mut().unwrap().insert("agents".to_string(), agents.clone());
        }
        if let Some(eds) = self.exclude_dynamic_sections {
            request.as_object_mut().unwrap().insert("excludeDynamicSections".to_string(), json!(eds));
        }
        if let Some(ref skills) = self.skills {
            if skills.is_array() {
                request.as_object_mut().unwrap().insert("skills".to_string(), skills.clone());
            }
        }

        let response = self
            .send_control_request(request, self.initialize_timeout)
            .await?;
        self._initialized = true;
        self._initialization_result = Some(response.clone());
        Ok(Some(response))
    }

    /// Start the background read task that reads from transport and routes messages.
    pub async fn start(&mut self) -> Result<()> {
        if self._read_task.is_some() {
            return Ok(());
        }

        let tx = self.message_tx.take().unwrap();
        let _pending = self.pending_control_responses.clone();
        let _can_use_tool = self.can_use_tool.clone();
        let _hook_callbacks = self.hook_callbacks.clone();
        let _batcher = self.transcript_mirror_batcher.clone();
        let _first_result_event = self.first_result_event.clone();
        let _first_result_fired = self.first_result_fired.clone();

        // We need to move transport out temporarily for the background task.
        // This is safe because the read task owns transport reads.
        // We use a trick: wrap transport in an Option inside a mutex.
        // Actually, since Transport is !Sync in our current design,
        // we need a different approach. Let's keep reading on the main task
        // but through a spawned future that has ownership.
        //
        // For now, start() remains as marker that we're in streaming mode.
        // The actual background reading happens via receive_messages().
        // This matches the Python behavior conceptually but the channel
        // routing for control responses is handled inline.
        self.message_tx = Some(tx);
        Ok(())
    }

    pub fn spawn_task(&mut self, coro: impl std::future::Future<Output = ()> + Send + 'static) {
        let task = spawn_detached(coro);
        self.child_tasks.push(task);
    }

    pub async fn close(&mut self) -> Result<()> {
        self.closed = true;

        // Final-flush mirror entries
        if let Some(ref batcher) = self.transcript_mirror_batcher {
            let _ = batcher.close().await;
        }

        // Cancel child tasks
        for task in &mut self.child_tasks {
            task.cancel();
        }
        self.child_tasks.clear();

        // Cancel read task
        if let Some(ref mut task) = self._read_task {
            if !task.done() {
                task.cancel();
                let _ = task.wait().await;
            }
        }
        self._read_task = None;

        // Unblock any waiters
        self.first_result_event.notify_waiters();

        // Close transport
        let _ = self.transport.close().await;
        Ok(())
    }

    /// Write a user message to the transport.
    pub async fn write_user_message(&mut self, prompt: &str) -> Result<()> {
        let user_message = json!({
            "type": "user",
            "session_id": "",
            "message": {"role": "user", "content": prompt},
            "parent_tool_use_id": null,
        });
        let data = serde_json::to_string(&user_message).unwrap() + "\n";
        self.transport.write(&data).await
    }

    /// Stream input messages to transport (#7).
    pub async fn stream_input(
        &mut self,
        mut stream: impl futures::Stream<Item = serde_json::Value> + Unpin + Send,
    ) -> Result<()> {
        use futures::StreamExt;
        while let Some(message) = stream.next().await {
            if self.closed {
                break;
            }
            let data = serde_json::to_string(&message).unwrap() + "\n";
            self.transport.write(&data).await?;
        }
        self.wait_for_result_and_end_input().await
    }

    /// Read the next SDK message from transport, handling control messages internally.
    ///
    /// Routes control_response to pending waiters, dispatches control_request
    /// for hooks/can_use_tool/MCP, and returns the next SDK message.
    /// Returns Ok(None) on EOF or stream end.
    pub async fn next_message(&mut self) -> Result<Option<serde_json::Value>> {
        // On first call: close stdin immediately for string prompts without
        // hooks/MCP (matches Python: wait_for_result_and_end_input returns
        // instantly when no hooks/MCP).
        if self._needs_end_input && self.sdk_mcp_servers.is_empty() && self.hooks.is_empty() {
            let _ = self.transport.end_input().await;
            self._needs_end_input = false;
        }

        loop {
            let msg = self.transport.read_message().await?;
            match msg {
                None => {
                    self.finalize_stream().await;
                    return Ok(None);
                }
                Some(message) => {
                    if self.closed {
                        return Ok(None);
                    }

                    let msg_type = message
                        .get("type")
                        .and_then(|v| v.as_str())
                        .unwrap_or("");

                    match msg_type {
                        "control_response" => {
                            if let Some(response) = message.get("response") {
                                let request_id = response.get("request_id")
                                    .and_then(|v| v.as_str())
                                    .unwrap_or("")
                                    .to_string();
                                let sender = {
                                    let mut pending = self.pending_control_responses.lock().unwrap();
                                    pending.remove(&request_id)
                                };
                                if let Some(sender) = sender {
                                    let subtype = response.get("subtype").and_then(|v| v.as_str()).unwrap_or("");
                                    if subtype == "error" {
                                        let error = response.get("error").and_then(|v| v.as_str()).unwrap_or("Unknown error").to_string();
                                        let _ = sender.send(Err(error));
                                    } else {
                                        let resp_data = response.get("response").cloned().unwrap_or(json!({}));
                                        let _ = sender.send(Ok(resp_data));
                                    }
                                }
                            }
                            continue;
                        }
                        "control_request" => {
                            if !self.closed {
                                self.handle_control_request(&message).await;
                            }
                            continue;
                        }
                        "control_cancel_request" => {
                            continue;
                        }
                        "transcript_mirror" => {
                            if let Some(ref batcher) = self.transcript_mirror_batcher {
                                if let (Some(file_path), Some(entries)) = (
                                    message.get("filePath").and_then(|v| v.as_str()),
                                    message.get("entries").and_then(|v| v.as_array()),
                                ) {
                                    batcher.enqueue(file_path, entries);
                                }
                            }
                            continue;
                        }
                        "end" => {
                            self.finalize_stream().await;
                            return Ok(None);
                        }
                        "error" => {
                            let err_msg = message
                                .get("error")
                                .and_then(|v| v.as_str())
                                .unwrap_or("Unknown error");
                            return Err(ClaudeSDKError::sdk(err_msg));
                        }
                        _ => {}
                    }

                    // Flush transcript mirror before yielding result
                    if msg_type == "result" {
                        if let Some(ref batcher) = self.transcript_mirror_batcher {
                            let _ = batcher.flush().await;
                        }
                        let was_fired = *self.first_result_fired.lock().unwrap();
                        *self.first_result_fired.lock().unwrap() = true;
                        self.first_result_event.notify_waiters();

                        if !was_fired && self._needs_end_input {
                            let _ = self.transport.end_input().await;
                            self._needs_end_input = false;
                        }
                    }

                    return Ok(Some(message));
                }
            }
        }
    }

    /// Finalize the message stream: flush mirror, notify waiters, end input.
    async fn finalize_stream(&mut self) {
        if let Some(ref batcher) = self.transcript_mirror_batcher {
            let _ = batcher.flush().await;
        }
        self.first_result_event.notify_waiters();

        if self._needs_end_input {
            let _ = self.transport.end_input().await;
            self._needs_end_input = false;
        }
    }

    /// Receive all messages from the transport, handling control messages internally.
    ///
    /// Collects all SDK messages into a Vec. For streaming, use `next_message()` in a loop.
    pub async fn receive_messages(&mut self) -> Result<Vec<serde_json::Value>> {
        let mut messages = Vec::new();
        loop {
            match self.next_message().await? {
                None => break,
                Some(msg) => messages.push(msg),
            }
        }
        Ok(messages)
    }

    /// Handle an incoming control request from the CLI (#9, #10).
    async fn handle_control_request(&mut self, request: &serde_json::Value) {
        let request_id = request.get("request_id")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();
        let request_data = match request.get("request") {
            Some(r) => r.clone(),
            None => return,
        };
        let subtype = request_data.get("subtype")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();

        let result: std::result::Result<serde_json::Value, String> = match subtype.as_str() {
            "can_use_tool" => {
                // Handle tool permission request (#10)
                match &self.can_use_tool {
                    Some(callback) => {
                        let tool_name = request_data.get("tool_name")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .to_string();
                        let input: HashMap<String, serde_json::Value> = request_data.get("input")
                            .and_then(|v| v.as_object())
                            .map(|obj| obj.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
                            .unwrap_or_default();
                        let original_input = request_data.get("input").cloned().unwrap_or(json!({}));
                        let context = ToolPermissionContext {
                            signal: None,
                            suggestions: Vec::new(),
                            tool_use_id: request_data.get("tool_use_id").and_then(|v| v.as_str()).map(String::from),
                            agent_id: request_data.get("agent_id").and_then(|v| v.as_str()).map(String::from),
                        };

                        let cb = callback.clone();
                        match cb(tool_name, input, context).await {
                            PermissionResult::Allow(allow) => {
                                let mut resp = json!({
                                    "behavior": "allow",
                                    "updatedInput": allow.updated_input.as_ref().map(|ui| serde_json::to_value(ui).unwrap()).unwrap_or(original_input),
                                });
                                if let Some(ref perms) = allow.updated_permissions {
                                    resp.as_object_mut().unwrap().insert(
                                        "updatedPermissions".to_string(),
                                        serde_json::to_value(perms).unwrap(),
                                    );
                                }
                                Ok(resp)
                            }
                            PermissionResult::Deny(deny) => {
                                let mut resp = json!({
                                    "behavior": "deny",
                                    "message": deny.message,
                                });
                                if deny.interrupt {
                                    resp.as_object_mut().unwrap().insert(
                                        "interrupt".to_string(),
                                        json!(true),
                                    );
                                }
                                Ok(resp)
                            }
                        }
                    }
                    None => Err("canUseTool callback is not provided".to_string()),
                }
            }
            "hook_callback" => {
                // Handle hook callback (#9)
                let callback_id = request_data.get("callback_id")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();
                let callback = {
                    let cbs = self.hook_callbacks.lock().unwrap();
                    cbs.get(&callback_id).cloned()
                };
                match callback {
                    Some(cb) => {
                        let input_val = request_data.get("input").cloned().unwrap_or(json!(null));
                        let tool_use_id = request_data.get("tool_use_id").and_then(|v| v.as_str()).map(String::from);
                        let context = crate::types::HookContext { signal: None };

                        // Parse input into HookInput
                        let hook_input: crate::types::HookInput = match serde_json::from_value(input_val) {
                            Ok(hi) => hi,
                            Err(e) => {
                                let _ = self.send_control_response_error(&request_id, &format!("Failed to parse hook input: {e}")).await;
                                return;
                            }
                        };

                        let output = cb(hook_input, tool_use_id, context).await;
                        let output_value = serde_json::to_value(&output).unwrap_or(json!({}));
                        Ok(convert_hook_output_for_cli(output_value))
                    }
                    None => Err(format!("No hook callback found for ID: {callback_id}")),
                }
            }
            _ => Err(format!("Unsupported control request subtype: {subtype}")),
        };

        match result {
            Ok(response_data) => {
                let success_response = json!({
                    "type": "control_response",
                    "response": {
                        "subtype": "success",
                        "request_id": request_id,
                        "response": response_data,
                    },
                });
                let data = serde_json::to_string(&success_response).unwrap() + "\n";
                let _ = self.transport.write(&data).await;
            }
            Err(error) => {
                let _ = self.send_control_response_error(&request_id, &error).await;
            }
        }
    }

    async fn send_control_response_error(&mut self, request_id: &str, error: &str) -> Result<()> {
        let error_response = json!({
            "type": "control_response",
            "response": {
                "subtype": "error",
                "request_id": request_id,
                "error": error,
            },
        });
        let data = serde_json::to_string(&error_response).unwrap() + "\n";
        self.transport.write(&data).await
    }

    pub async fn get_mcp_status(&mut self) -> Result<serde_json::Value> {
        let request = json!({ "subtype": "mcp_status" });
        self.send_control_request(request, 60.0).await
    }

    pub async fn get_context_usage(&mut self) -> Result<serde_json::Value> {
        let request = json!({ "subtype": "get_context_usage" });
        self.send_control_request(request, 60.0).await
    }

    pub async fn interrupt(&mut self) -> Result<()> {
        let request = json!({ "subtype": "interrupt" });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn set_permission_mode(&mut self, mode: PermissionMode) -> Result<()> {
        let request = json!({
            "subtype": "set_permission_mode",
            "mode": mode,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn set_model(&mut self, model: Option<&str>) -> Result<()> {
        let request = json!({
            "subtype": "set_model",
            "model": model,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn rewind_files(&mut self, user_message_id: &str) -> Result<()> {
        let request = json!({
            "subtype": "rewind_files",
            "user_message_id": user_message_id,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn reconnect_mcp_server(&mut self, server_name: &str) -> Result<()> {
        let request = json!({
            "subtype": "mcp_reconnect",
            "serverName": server_name,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn toggle_mcp_server(&mut self, server_name: &str, enabled: bool) -> Result<()> {
        let request = json!({
            "subtype": "mcp_toggle",
            "serverName": server_name,
            "enabled": enabled,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn stop_task(&mut self, task_id: &str) -> Result<()> {
        let request = json!({
            "subtype": "stop_task",
            "task_id": task_id,
        });
        self.send_control_request(request, 60.0).await?;
        Ok(())
    }

    pub async fn wait_for_result_and_end_input(&mut self) -> Result<()> {
        // If SDK MCP servers or hooks are present, wait for first result
        if !self.sdk_mcp_servers.is_empty() || !self.hooks.is_empty() {
            // Wait until first result arrives or stream ends
            if !*self.first_result_fired.lock().unwrap() {
                self.first_result_event.notified().await;
            }
        }
        self.transport.end_input().await
    }

    /// Mark that end_input should be called by receive_messages.
    ///
    /// Matches Python SDK: `query.spawn_task(query.wait_for_result_and_end_input())`
    /// This prevents deadlock when the message buffer fills up (e.g. >50 tool
    /// calls with hooks) by deferring end_input to receive_messages.
    ///
    /// For no hooks/MCP: end_input is called immediately at the start of
    /// receive_messages (before reading). For hooks/MCP: end_input is called
    /// after the first "result" message is received.
    pub fn spawn_wait_for_result_and_end_input(&mut self) {
        self._needs_end_input = true;
    }

    /// Get server initialization info (#5 get_server_info).
    pub fn get_server_info(&self) -> Option<&serde_json::Value> {
        self._initialization_result.as_ref()
    }

    /// Send a control request and wait for the response by reading from
    /// transport inline. Unlike the Python SDK (which has a background reader
    /// task routing responses), the Rust version reads directly until the
    /// matching control_response arrives or timeout is hit.
    async fn send_control_request(
        &mut self,
        request: serde_json::Value,
        timeout: f64,
    ) -> Result<serde_json::Value> {
        if !self.is_streaming_mode {
            return Err(ClaudeSDKError::sdk(
                "Control requests require streaming mode",
            ));
        }

        // Generate unique request ID
        self.request_counter += 1;
        let request_id = format!("req_{}", self.request_counter);

        // Build and send request
        let control_request = json!({
            "type": "control_request",
            "request_id": request_id,
            "request": request,
        });

        let data = serde_json::to_string(&control_request).unwrap() + "\n";
        self.transport.write(&data).await?;

        // Read from transport inline until we get our control_response or timeout.
        // Any non-control messages received during this wait are buffered in
        // message_tx for later consumption by receive_messages.
        let deadline = tokio::time::Instant::now()
            + std::time::Duration::from_secs_f64(timeout);

        loop {
            let remaining = deadline.saturating_duration_since(tokio::time::Instant::now());
            if remaining.is_zero() {
                return Err(ClaudeSDKError::sdk(format!(
                    "Control request timeout: {}",
                    request.get("subtype").and_then(|v| v.as_str()).unwrap_or("unknown")
                )));
            }

            let read_result = tokio::time::timeout(
                remaining,
                self.transport.read_message(),
            ).await;

            match read_result {
                Err(_) => {
                    // Timeout
                    return Err(ClaudeSDKError::sdk(format!(
                        "Control request timeout: {}",
                        request.get("subtype").and_then(|v| v.as_str()).unwrap_or("unknown")
                    )));
                }
                Ok(Err(e)) => return Err(e),
                Ok(Ok(None)) => {
                    // EOF before response
                    return Err(ClaudeSDKError::sdk("Transport closed before control response"));
                }
                Ok(Ok(Some(message))) => {
                    let msg_type = message.get("type").and_then(|v| v.as_str()).unwrap_or("");
                    if msg_type == "control_response" {
                        if let Some(response) = message.get("response") {
                            let resp_id = response.get("request_id")
                                .and_then(|v| v.as_str())
                                .unwrap_or("");
                            if resp_id == request_id {
                                let subtype = response.get("subtype").and_then(|v| v.as_str()).unwrap_or("");
                                if subtype == "error" {
                                    let error = response.get("error").and_then(|v| v.as_str()).unwrap_or("Unknown error").to_string();
                                    return Err(ClaudeSDKError::sdk(error));
                                } else {
                                    let resp_data = response.get("response").cloned().unwrap_or(json!({}));
                                    return Ok(resp_data);
                                }
                            }
                            // Response for a different request_id — route to pending
                            let sender = {
                                let mut pending = self.pending_control_responses.lock().unwrap();
                                pending.remove(resp_id)
                            };
                            if let Some(sender) = sender {
                                let subtype = response.get("subtype").and_then(|v| v.as_str()).unwrap_or("");
                                if subtype == "error" {
                                    let error = response.get("error").and_then(|v| v.as_str()).unwrap_or("Unknown error").to_string();
                                    let _ = sender.send(Err(error));
                                } else {
                                    let resp_data = response.get("response").cloned().unwrap_or(json!({}));
                                    let _ = sender.send(Ok(resp_data));
                                }
                            }
                        }
                    } else {
                        // Non-control message — buffer for receive_messages
                        if let Some(ref tx) = self.message_tx {
                            let _ = tx.try_send(message);
                        }
                    }
                }
            }
        }
    }
}
