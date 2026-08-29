//! Tools de tarefa (TodoV2 + background) sobre o `TaskStore` da sessão.

use async_trait::async_trait;

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::task_store::TaskStore;
use std::sync::Arc;

fn store_of(context: &ToolContext) -> Option<Arc<TaskStore>> {
    context.task_store.clone()
}

fn no_store() -> ToolResult {
    ToolResult::error("No task store is available in this session")
}

fn json_result(value: serde_json::Value) -> ToolResult {
    ToolResult::text(serde_json::to_string_pretty(&value).unwrap_or_default())
}

pub struct TaskCreateTool;

#[async_trait]
impl Tool for TaskCreateTool {
    fn name(&self) -> &str { "TaskCreate" }
    fn description(&self) -> &str { "Create a new task in the session task list" }
    fn is_read_only(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "subject": { "type": "string", "description": "Short imperative title" },
                "description": { "type": "string", "description": "Detailed description" },
                "activeForm": { "type": "string", "description": "Present-continuous label shown while in progress" }
            },
            "required": ["subject", "description"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        let subject = input.get("subject").and_then(|v| v.as_str()).unwrap_or_default();
        let description = input.get("description").and_then(|v| v.as_str()).map(str::to_string);
        let active_form = input.get("activeForm").and_then(|v| v.as_str()).map(str::to_string);
        let record = store.create_task(subject.to_string(), description, active_form);
        json_result(serde_json::json!({"task": record}))
    }
}

pub struct TaskGetTool;

#[async_trait]
impl Tool for TaskGetTool {
    fn name(&self) -> &str { "TaskGet" }
    fn description(&self) -> &str { "Retrieve a task by ID" }
    fn is_read_only(&self) -> bool { true }
    fn is_concurrency_safe(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": { "taskId": { "type": "string" } },
            "required": ["taskId"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        let id = input.get("taskId").and_then(|v| v.as_str()).unwrap_or_default();
        match store.get_task(id) {
            Some(task) => json_result(serde_json::json!({"task": task})),
            None => ToolResult::error(format!("Task not found: {id}")),
        }
    }
}

pub struct TaskListTool;

#[async_trait]
impl Tool for TaskListTool {
    fn name(&self) -> &str { "TaskList" }
    fn description(&self) -> &str { "List all tasks in the session task list" }
    fn is_read_only(&self) -> bool { true }
    fn is_concurrency_safe(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({"type": "object", "properties": {}})
    }

    async fn execute(&self, _input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        json_result(serde_json::json!({"tasks": store.list_tasks()}))
    }
}

pub struct TaskUpdateTool;

#[async_trait]
impl Tool for TaskUpdateTool {
    fn name(&self) -> &str { "TaskUpdate" }
    fn description(&self) -> &str { "Update a task (subject, description, status, owner)" }
    fn is_read_only(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": {
                "taskId": { "type": "string" },
                "subject": { "type": "string" },
                "description": { "type": "string" },
                "status": { "type": "string", "enum": ["pending", "in_progress", "completed", "cancelled"] },
                "activeForm": { "type": "string" },
                "owner": { "type": "string" }
            },
            "required": ["taskId"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        let id = input.get("taskId").and_then(|v| v.as_str()).unwrap_or_default();
        let get = |k: &str| input.get(k).and_then(|v| v.as_str()).map(str::to_string);
        match store.update_task(id, get("subject"), get("description"), get("status"), get("activeForm"), get("owner")) {
            Some(task) => json_result(serde_json::json!({"task": task})),
            None => ToolResult::error(format!("Task not found: {id}")),
        }
    }
}

pub struct TaskStopTool;

#[async_trait]
impl Tool for TaskStopTool {
    fn name(&self) -> &str { "TaskStop" }
    fn description(&self) -> &str { "Stop a running background task by its ID" }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": { "task_id": { "type": "string" } },
            "required": ["task_id"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        let id = input.get("task_id").and_then(|v| v.as_str()).unwrap_or_default();
        if store.stop_background(id).await {
            ToolResult::text(format!("Task {id} stopped"))
        } else {
            ToolResult::error(format!("No background task with id {id}"))
        }
    }
}

pub struct TaskOutputTool;

#[async_trait]
impl Tool for TaskOutputTool {
    fn name(&self) -> &str { "TaskOutput" }
    fn description(&self) -> &str { "Get current output and status from a background task" }
    fn is_read_only(&self) -> bool { true }
    fn is_concurrency_safe(&self) -> bool { true }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": { "task_id": { "type": "string" } },
            "required": ["task_id"]
        })
    }

    async fn execute(&self, input: serde_json::Value, context: &ToolContext) -> ToolResult {
        let Some(store) = store_of(context) else { return no_store() };
        let id = input.get("task_id").and_then(|v| v.as_str()).unwrap_or_default();
        match store.background_status(id).await {
            Some((finished, exit_code, output_path)) => {
                let output = tokio::fs::read_to_string(&output_path)
                    .await
                    .unwrap_or_default();
                let status = if finished { "completed" } else { "running" };
                ToolResult::text(format!(
                    "status: {status}{}\noutput file: {}\n\n{output}",
                    exit_code
                        .map(|c| format!(" (exit code {c})"))
                        .unwrap_or_default(),
                    output_path.display(),
                ))
            }
            None => ToolResult::error(format!("No background task with id {id}")),
        }
    }
}
