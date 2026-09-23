//! Tools de tarefa sobre o `TaskStore` da sessão: TodoV2
//! (TaskCreate/TaskGet/TaskList/TaskUpdate, fora do conjunto default do CLI
//! em modo não interativo) e as tools de background TaskOutput e TaskStop.
//!
//! Referências JS: `tools/TaskOutputTool/TaskOutputTool/*.js` (schema com
//! `block`/`timeout` e seus defaults, `validateInput`, a espera pela
//! conclusão, `getTaskOutputData` e o resultado em tags),
//! `utils/task/outputFormatting.js` (o corte do output),
//! `tools/TaskStopTool/TaskStopTool.js` e `tasks/stopTask.js` (validação,
//! morte do processo e o resultado em JSON). As quatro do TodoV2 usam o
//! `checkPermissions` default do `buildTool` (`Tool.js`), que permite.

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::framework::{js_len, js_slice, Tool, ToolContext, ToolResult};
use crate::tools::permission::{PermissionResult, PermissionRules};
use crate::tools::task_store::{BackgroundSnapshot, TaskStore};
use std::sync::Arc;

fn store_of(context: &ToolContext) -> Option<Arc<TaskStore>> {
    context.task_store.clone()
}

fn no_store() -> ToolResult {
    ToolResult::error("No task store is available in this session")
}

fn json_result(value: Value) -> ToolResult {
    ToolResult::text(serde_json::to_string_pretty(&value).unwrap_or_default())
}

pub struct TaskCreateTool;

#[async_trait]
impl Tool for TaskCreateTool {
    fn name(&self) -> &str {
        "TaskCreate"
    }
    fn description(&self) -> &str {
        "Create a new task in the session task list"
    }
    fn is_read_only(&self) -> bool {
        true
    }
    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "subject": { "type": "string", "description": "Short imperative title" },
                "description": { "type": "string", "description": "Detailed description" },
                "activeForm": { "type": "string", "description": "Present-continuous label shown while in progress" }
            },
            "required": ["subject", "description"],
            // `strictObject` no JS (`tools/TaskCreateTool/TaskCreateTool.js`):
            // chave desconhecida recusa a chamada.
            "additionalProperties": false
        })
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else {
            return no_store();
        };
        let subject = input
            .get("subject")
            .and_then(|v| v.as_str())
            .unwrap_or_default();
        let description = input
            .get("description")
            .and_then(|v| v.as_str())
            .map(str::to_string);
        let active_form = input
            .get("activeForm")
            .and_then(|v| v.as_str())
            .map(str::to_string);
        let record = store.create_task(subject.to_string(), description, active_form);
        json_result(json!({"task": record}))
    }
}

pub struct TaskGetTool;

#[async_trait]
impl Tool for TaskGetTool {
    fn name(&self) -> &str {
        "TaskGet"
    }
    fn description(&self) -> &str {
        "Retrieve a task by ID"
    }
    fn is_read_only(&self) -> bool {
        true
    }
    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }
    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": { "taskId": { "type": "string" } },
            "required": ["taskId"],
            // `strictObject` no JS (`tools/TaskGetTool/TaskGetTool.js`).
            "additionalProperties": false
        })
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else {
            return no_store();
        };
        let id = input
            .get("taskId")
            .and_then(|v| v.as_str())
            .unwrap_or_default();
        match store.get_task(id) {
            Some(task) => json_result(json!({"task": task})),
            None => ToolResult::error(format!("Task not found: {id}")),
        }
    }
}

pub struct TaskListTool;

#[async_trait]
impl Tool for TaskListTool {
    fn name(&self) -> &str {
        "TaskList"
    }
    fn description(&self) -> &str {
        "List all tasks in the session task list"
    }
    fn is_read_only(&self) -> bool {
        true
    }
    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }
    fn input_schema(&self) -> Value {
        // `strictObject({})` no JS (`tools/TaskListTool/TaskListTool.js`):
        // qualquer chave recusa a chamada.
        json!({"type": "object", "properties": {}, "additionalProperties": false})
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, _input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else {
            return no_store();
        };
        json_result(json!({"tasks": store.list_tasks()}))
    }
}

pub struct TaskUpdateTool;

#[async_trait]
impl Tool for TaskUpdateTool {
    fn name(&self) -> &str {
        "TaskUpdate"
    }
    fn description(&self) -> &str {
        "Update a task (subject, description, status, owner)"
    }
    fn is_read_only(&self) -> bool {
        true
    }
    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "taskId": { "type": "string" },
                "subject": { "type": "string" },
                "description": { "type": "string" },
                "status": { "type": "string", "enum": ["pending", "in_progress", "completed", "cancelled"] },
                "activeForm": { "type": "string" },
                "owner": { "type": "string" }
            },
            "required": ["taskId"],
            // `strictObject` no JS (`tools/TaskUpdateTool/TaskUpdateTool.js`).
            "additionalProperties": false
        })
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else {
            return no_store();
        };
        let id = input
            .get("taskId")
            .and_then(|v| v.as_str())
            .unwrap_or_default();
        let get = |k: &str| input.get(k).and_then(|v| v.as_str()).map(str::to_string);
        match store.update_task(
            id,
            get("subject"),
            get("description"),
            get("status"),
            get("activeForm"),
            get("owner"),
        ) {
            Some(task) => json_result(json!({"task": task})),
            None => ToolResult::error(format!("Task not found: {id}")),
        }
    }
}

// ---------------------------------------------------------------------------
// TaskStop
// ---------------------------------------------------------------------------

const TASK_STOP_PROMPT: &str = "\n- Stops a running background task by its ID\n- Takes a task_id parameter identifying the task to stop\n- Returns a success or failure status\n- Use this tool when you need to terminate a long-running task\n";

pub struct TaskStopTool;

fn stop_target(input: &Value) -> Option<String> {
    input
        .get("task_id")
        .and_then(Value::as_str)
        .or_else(|| input.get("shell_id").and_then(Value::as_str))
        .map(str::to_string)
        .filter(|id| !id.is_empty())
}

#[async_trait]
impl Tool for TaskStopTool {
    fn name(&self) -> &str {
        "TaskStop"
    }

    fn description(&self) -> &str {
        TASK_STOP_PROMPT
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "task_id": {
                    "description": "The ID of the background task to stop",
                    "type": "string"
                },
                "shell_id": {
                    "description": "Deprecated: use task_id instead",
                    "type": "string"
                }
            },
            "additionalProperties": false
        })
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        let Some(id) = stop_target(input) else {
            return Err("Missing required parameter: task_id".to_string());
        };
        let snapshot = match &context.task_store {
            Some(store) => store.background_snapshot(&id).await,
            None => None,
        };
        let Some(snapshot) = snapshot else {
            return Err(format!("No task found with ID: {id}"));
        };
        if snapshot.status != "running" {
            return Err(format!(
                "Task {id} is not running (status: {})",
                snapshot.status
            ));
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(id) = stop_target(&input) else {
            return ToolResult::error("Missing required parameter: task_id");
        };
        let Some(store) = store_of(context) else {
            return ToolResult::error(format!("No task found with ID: {id}"));
        };
        let Some(before) = store.kill_background(&id).await else {
            return ToolResult::error(format!("No task found with ID: {id}"));
        };
        if before.status != "running" {
            return ToolResult::error(format!(
                "Task {id} is not running (status: {})",
                before.status
            ));
        }
        let mut data = Map::new();
        data.insert(
            "message".into(),
            json!(format!(
                "Successfully stopped task: {id} ({})",
                before.command
            )),
        );
        data.insert("task_id".into(), json!(id));
        data.insert("task_type".into(), json!(before.task_type));
        data.insert("command".into(), json!(before.command));
        let data = Value::Object(data);
        ToolResult::text(serde_json::to_string(&data).unwrap_or_default())
            .with_tool_use_result(data)
    }
}

// ---------------------------------------------------------------------------
// TaskOutput
// ---------------------------------------------------------------------------

const TASK_OUTPUT_PROMPT: &str = "DEPRECATED: Prefer using the Read tool on the task's output file path instead. Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes [[EM]] Read that file directly.\n\n- Retrieves output from a running or completed task (background shell, agent, or remote session)\n- Takes a task_id parameter identifying the task\n- Returns the task output along with status information\n- Use block=true (default) to wait for task completion\n- Use block=false for non-blocking check of current status\n- Task IDs can be found using the /tasks command\n- Works with all task types: background shells, async agents, and remote sessions";

/// `TASK_MAX_OUTPUT_DEFAULT` e `TASK_MAX_OUTPUT_UPPER_LIMIT`.
const TASK_MAX_OUTPUT_DEFAULT: usize = 32_000;
const TASK_MAX_OUTPUT_UPPER_LIMIT: usize = 160_000;

/// `getMaxTaskOutputLength`: `TASK_MAX_OUTPUT_LENGTH` limitado ao teto.
fn max_task_output_length() -> usize {
    std::env::var("TASK_MAX_OUTPUT_LENGTH")
        .ok()
        .and_then(|v| v.trim().parse::<usize>().ok())
        .filter(|v| *v > 0)
        .map(|v| v.min(TASK_MAX_OUTPUT_UPPER_LIMIT))
        .unwrap_or(TASK_MAX_OUTPUT_DEFAULT)
}

/// `formatTaskOutput`: guarda o FIM do output quando passa do limite.
pub fn format_task_output(output: &str, output_path: &str) -> String {
    let max = max_task_output_length();
    if js_len(output) <= max {
        return output.to_string();
    }
    let header = format!("[Truncated. Full output: {output_path}]\n\n");
    let available = max.saturating_sub(js_len(&header));
    let total = js_len(output);
    format!(
        "{header}{}",
        js_slice(output, total - available.min(total), total)
    )
}

pub struct TaskOutputTool;

async fn task_output_data(snapshot: &BackgroundSnapshot) -> Value {
    let output = tokio::fs::read_to_string(&snapshot.output_path)
        .await
        .unwrap_or_default();
    let mut task = Map::new();
    task.insert("task_id".into(), json!(snapshot.id));
    task.insert("task_type".into(), json!(snapshot.task_type));
    task.insert("status".into(), json!(snapshot.status));
    task.insert("description".into(), json!(snapshot.description));
    task.insert("output".into(), json!(output));
    task.insert(
        "exitCode".into(),
        snapshot.exit_code.map(Value::from).unwrap_or(Value::Null),
    );
    Value::Object(task)
}

/// O texto do resultado (`mapToolResultToToolResultBlockParam`).
pub fn task_output_result_text(data: &Value) -> String {
    let mut parts = vec![format!(
        "<retrieval_status>{}</retrieval_status>",
        data.get("retrieval_status")
            .and_then(Value::as_str)
            .unwrap_or_default()
    )];
    if let Some(task) = data.get("task").filter(|t| t.is_object()) {
        let field = |k: &str| task.get(k).and_then(Value::as_str).unwrap_or_default();
        let task_id = field("task_id");
        parts.push(format!("<task_id>{task_id}</task_id>"));
        parts.push(format!("<task_type>{}</task_type>", field("task_type")));
        parts.push(format!("<status>{}</status>", field("status")));
        if let Some(code) = task.get("exitCode").filter(|c| !c.is_null()) {
            parts.push(format!("<exit_code>{code}</exit_code>"));
        }
        let output = field("output");
        if !output.trim().is_empty() {
            let path = task
                .get("outputPath")
                .and_then(Value::as_str)
                .unwrap_or(task_id);
            let content = format_task_output(output, path);
            parts.push(format!("<output>\n{}\n</output>", content.trim_end()));
        }
        if let Some(error) = task.get("error").and_then(Value::as_str) {
            parts.push(format!("<error>{error}</error>"));
        }
    }
    parts.join("\n\n")
}

#[async_trait]
impl Tool for TaskOutputTool {
    fn name(&self) -> &str {
        "TaskOutput"
    }

    /// `normalizeToolInput` do TaskOutput: os nomes antigos (`agentId`,
    /// `bash_id`, `wait_up_to` em segundos) viram `task_id`, `block` e
    /// `timeout`, com os defaults `true` e `30000`.
    fn normalize_input(&self, input: Value, _context: &ToolContext) -> Value {
        let present = |key: &str| input.get(key).filter(|v| !v.is_null()).cloned();
        let task_id = present("task_id")
            .or_else(|| present("agentId"))
            .or_else(|| present("bash_id"))
            .unwrap_or_else(|| json!(""));
        let timeout = present("timeout")
            .or_else(|| {
                input
                    .get("wait_up_to")
                    .and_then(Value::as_f64)
                    .map(|secs| crate::tools::schema_validation::js_number_value(secs * 1000.0))
            })
            .unwrap_or_else(|| json!(30000));
        json!({
            "task_id": task_id,
            "block": present("block").unwrap_or(Value::Bool(true)),
            "timeout": timeout,
        })
    }

    fn description(&self) -> &str {
        static TEXT: std::sync::OnceLock<String> = std::sync::OnceLock::new();
        TEXT.get_or_init(|| crate::tools::agent::with_js_dashes(TASK_OUTPUT_PROMPT))
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "task_id": {
                    "description": "The task ID to get output from",
                    "type": "string"
                },
                "block": {
                    "description": "Whether to wait for completion",
                    "default": true,
                    "type": "boolean"
                },
                "timeout": {
                    "description": "Max wait time in ms",
                    "default": 30000,
                    "type": "number",
                    "minimum": 0,
                    "maximum": 600000
                }
            },
            "required": ["task_id", "block", "timeout"],
            "additionalProperties": false
        })
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    /// `block` passa pelo `semanticBoolean`; `block` e `timeout` ganham os
    /// defaults do zod (`true` e `30000`) quando faltam.
    fn preprocess_input(&self, input: Value) -> Value {
        let Value::Object(mut map) = input else {
            return input;
        };
        match map.get("block") {
            Some(v) => {
                let coerced = crate::tools::schema_validation::semantic_boolean(v);
                map.insert("block".into(), coerced);
            }
            None => {
                map.insert("block".into(), Value::Bool(true));
            }
        }
        if !map.contains_key("timeout") {
            map.insert("timeout".into(), json!(30000));
        }
        Value::Object(map)
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        let id = input
            .get("task_id")
            .and_then(Value::as_str)
            .unwrap_or_default();
        if id.is_empty() {
            return Err("Task ID is required".to_string());
        }
        let exists = match &context.task_store {
            Some(store) => store.background_snapshot(id).await.is_some(),
            None => false,
        };
        if !exists {
            return Err(format!("No task found with ID: {id}"));
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let id = input
            .get("task_id")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string();
        let block = input.get("block").and_then(Value::as_bool).unwrap_or(true);
        let timeout_ms = input
            .get("timeout")
            .and_then(Value::as_f64)
            .unwrap_or(30000.0)
            .max(0.0) as u64;
        let Some(store) = store_of(context) else {
            return ToolResult::error(format!("No task found with ID: {id}"));
        };
        let Some(mut snapshot) = store.background_snapshot(&id).await else {
            return ToolResult::error(format!("No task found with ID: {id}"));
        };
        let finished = |s: &BackgroundSnapshot| s.status != "running" && s.status != "pending";
        let retrieval_status = if !block {
            if finished(&snapshot) {
                "success"
            } else {
                "not_ready"
            }
        } else {
            let deadline = std::time::Instant::now() + std::time::Duration::from_millis(timeout_ms);
            loop {
                if finished(&snapshot) {
                    break;
                }
                if context.is_aborted() {
                    return ToolResult::error(
                        crate::tools::framework::INTERRUPT_MESSAGE_FOR_TOOL_USE,
                    );
                }
                if std::time::Instant::now() >= deadline {
                    break;
                }
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
                match store.background_snapshot(&id).await {
                    Some(s) => snapshot = s,
                    None => {
                        let data = json!({"retrieval_status": "timeout", "task": Value::Null});
                        return ToolResult::text(task_output_result_text(&data))
                            .with_tool_use_result(data);
                    }
                }
            }
            if finished(&snapshot) {
                "success"
            } else {
                "timeout"
            }
        };
        let task = task_output_data(&snapshot).await;
        let data = json!({"retrieval_status": retrieval_status, "task": task});
        let mut for_text = data.clone();
        if let Some(t) = for_text.get_mut("task").and_then(Value::as_object_mut) {
            t.insert(
                "outputPath".into(),
                json!(snapshot.output_path.display().to_string()),
            );
        }
        ToolResult::text(task_output_result_text(&for_text)).with_tool_use_result(data)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn result_text_uses_the_js_tags() {
        let data = json!({
            "retrieval_status": "success",
            "task": {"task_id": "b1", "task_type": "local_bash", "status": "completed",
                     "description": "d", "output": "oi\n", "exitCode": 0}
        });
        assert_eq!(
            task_output_result_text(&data),
            "<retrieval_status>success</retrieval_status>\n\n<task_id>b1</task_id>\n\n<task_type>local_bash</task_type>\n\n<status>completed</status>\n\n<exit_code>0</exit_code>\n\n<output>\noi\n</output>"
        );
    }

    #[test]
    fn long_output_keeps_the_tail_with_the_header() {
        let output = "x".repeat(40_000);
        let text = format_task_output(&output, "/tmp/out.txt");
        assert!(text.starts_with("[Truncated. Full output: /tmp/out.txt]\n\n"));
        assert_eq!(js_len(&text), 32_000);
    }
}
