use async_trait::async_trait;

use crate::tools::framework::{Tool, ToolContext, ToolResult};

macro_rules! stub_tool {
    ($name:ident, $tool_name:literal, $desc:literal, $schema:expr) => {
        pub struct $name;

        #[async_trait]
        impl Tool for $name {
            fn name(&self) -> &str { $tool_name }
            fn description(&self) -> &str { $desc }
            fn input_schema(&self) -> serde_json::Value { $schema }

            async fn execute(&self, _input: serde_json::Value, _context: &ToolContext) -> ToolResult {
                ToolResult::error(concat!($tool_name, " requires task management system (not yet wired)"))
            }
        }
    };
}

stub_tool!(TaskCreateTool, "TaskCreate", "Create a new task", serde_json::json!({
    "type": "object",
    "properties": {
        "subject": { "type": "string" },
        "description": { "type": "string" }
    },
    "required": ["subject", "description"]
}));

stub_tool!(TaskGetTool, "TaskGet", "Retrieve a task by ID", serde_json::json!({
    "type": "object",
    "properties": {
        "taskId": { "type": "string" }
    },
    "required": ["taskId"]
}));

stub_tool!(TaskListTool, "TaskList", "List all tasks", serde_json::json!({
    "type": "object",
    "properties": {}
}));

stub_tool!(TaskUpdateTool, "TaskUpdate", "Update a task", serde_json::json!({
    "type": "object",
    "properties": {
        "taskId": { "type": "string" },
        "status": { "type": "string" }
    },
    "required": ["taskId"]
}));

stub_tool!(TaskStopTool, "TaskStop", "Stop a running task", serde_json::json!({
    "type": "object",
    "properties": {
        "task_id": { "type": "string" }
    },
    "required": ["task_id"]
}));

stub_tool!(TaskOutputTool, "TaskOutput", "Get output from a task", serde_json::json!({
    "type": "object",
    "properties": {
        "task_id": { "type": "string" }
    },
    "required": ["task_id"]
}));
