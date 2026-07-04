use std::collections::HashMap;
use std::future::Future;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::Arc;

use serde::{Deserialize, Serialize};

use crate::errors::ClaudeSDKError;

// ---------------------------------------------------------------------------
// Permission modes
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PermissionMode {
    #[serde(rename = "default")]
    Default,
    #[serde(rename = "acceptEdits")]
    AcceptEdits,
    #[serde(rename = "plan")]
    Plan,
    #[serde(rename = "bypassPermissions")]
    BypassPermissions,
    #[serde(rename = "dontAsk")]
    DontAsk,
    #[serde(rename = "auto")]
    Auto,
}

// ---------------------------------------------------------------------------
// SDK Beta features
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SdkBeta {
    #[serde(rename = "context-1m-2025-08-07")]
    Context1M,
}

// ---------------------------------------------------------------------------
// Setting sources
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SettingSource {
    #[serde(rename = "user")]
    User,
    #[serde(rename = "project")]
    Project,
    #[serde(rename = "local")]
    Local,
}

// ---------------------------------------------------------------------------
// System prompt types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SystemPrompt {
    #[serde(rename = "preset")]
    Preset {
        preset: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        append: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        exclude_dynamic_sections: Option<bool>,
    },
    #[serde(rename = "file")]
    File { path: String },
}

/// System prompt can be a plain string or a structured config.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SystemPromptConfig {
    String(String),
    Structured(SystemPrompt),
}

// ---------------------------------------------------------------------------
// Task budget
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct TaskBudget {
    pub total: i64,
}

// ---------------------------------------------------------------------------
// Tools preset
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ToolsPreset {
    #[serde(rename = "type")]
    pub type_: String,
    pub preset: String,
}

/// Tools can be a list of tool names, a preset, or None.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ToolsConfig {
    List(Vec<String>),
    Preset(ToolsPreset),
}

// ---------------------------------------------------------------------------
// Agent definition
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AgentDefinition {
    pub description: String,
    pub prompt: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tools: Option<Vec<String>>,
    #[serde(rename = "disallowedTools", skip_serializing_if = "Option::is_none")]
    pub disallowed_tools: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skills: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub memory: Option<String>,
    #[serde(rename = "mcpServers", skip_serializing_if = "Option::is_none")]
    pub mcp_servers: Option<Vec<serde_json::Value>>,
    #[serde(rename = "initialPrompt", skip_serializing_if = "Option::is_none")]
    pub initial_prompt: Option<String>,
    #[serde(rename = "maxTurns", skip_serializing_if = "Option::is_none")]
    pub max_turns: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub effort: Option<serde_json::Value>,
    #[serde(rename = "permissionMode", skip_serializing_if = "Option::is_none")]
    pub permission_mode: Option<PermissionMode>,
}

impl AgentDefinition {
    pub fn new(description: impl Into<String>, prompt: impl Into<String>) -> Self {
        Self {
            description: description.into(),
            prompt: prompt.into(),
            tools: None,
            disallowed_tools: None,
            model: None,
            skills: None,
            memory: None,
            mcp_servers: None,
            initial_prompt: None,
            max_turns: None,
            background: None,
            effort: None,
            permission_mode: None,
        }
    }
}

// ---------------------------------------------------------------------------
// Permission types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PermissionUpdateDestination {
    #[serde(rename = "userSettings")]
    UserSettings,
    #[serde(rename = "projectSettings")]
    ProjectSettings,
    #[serde(rename = "localSettings")]
    LocalSettings,
    #[serde(rename = "session")]
    Session,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PermissionBehavior {
    #[serde(rename = "allow")]
    Allow,
    #[serde(rename = "deny")]
    Deny,
    #[serde(rename = "ask")]
    Ask,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PermissionRuleValue {
    pub tool_name: String,
    pub rule_content: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PermissionUpdate {
    #[serde(rename = "type")]
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rules: Option<Vec<PermissionRuleValue>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub behavior: Option<PermissionBehavior>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mode: Option<PermissionMode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub directories: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub destination: Option<PermissionUpdateDestination>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToolPermissionContext {
    pub signal: Option<serde_json::Value>,
    #[serde(default)]
    pub suggestions: Vec<PermissionUpdate>,
    pub tool_use_id: Option<String>,
    pub agent_id: Option<String>,
}

impl Default for ToolPermissionContext {
    fn default() -> Self {
        Self {
            signal: None,
            suggestions: Vec::new(),
            tool_use_id: None,
            agent_id: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PermissionResultAllow {
    #[serde(default = "default_allow_behavior")]
    pub behavior: String,
    pub updated_input: Option<HashMap<String, serde_json::Value>>,
    pub updated_permissions: Option<Vec<PermissionUpdate>>,
}

fn default_allow_behavior() -> String {
    "allow".into()
}

impl Default for PermissionResultAllow {
    fn default() -> Self {
        Self {
            behavior: "allow".into(),
            updated_input: None,
            updated_permissions: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PermissionResultDeny {
    #[serde(default = "default_deny_behavior")]
    pub behavior: String,
    #[serde(default)]
    pub message: String,
    #[serde(default)]
    pub interrupt: bool,
}

fn default_deny_behavior() -> String {
    "deny".into()
}

impl Default for PermissionResultDeny {
    fn default() -> Self {
        Self {
            behavior: "deny".into(),
            message: String::new(),
            interrupt: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "behavior")]
pub enum PermissionResult {
    #[serde(rename = "allow")]
    Allow(PermissionResultAllow),
    #[serde(rename = "deny")]
    Deny(PermissionResultDeny),
}

// ---------------------------------------------------------------------------
// Hook types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum HookEvent {
    PreToolUse,
    PostToolUse,
    PostToolUseFailure,
    UserPromptSubmit,
    Stop,
    SubagentStop,
    PreCompact,
    Notification,
    SubagentStart,
    PermissionRequest,
}

// Hook input — serde-tagged by hook_event_name
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "hook_event_name")]
pub enum HookInput {
    PreToolUse {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        tool_name: String,
        tool_input: serde_json::Value,
        tool_use_id: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_type: Option<String>,
    },
    PostToolUse {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        tool_name: String,
        tool_input: serde_json::Value,
        tool_response: serde_json::Value,
        tool_use_id: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_type: Option<String>,
    },
    PostToolUseFailure {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        tool_name: String,
        tool_input: serde_json::Value,
        tool_use_id: String,
        error: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        is_interrupt: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_type: Option<String>,
    },
    UserPromptSubmit {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        prompt: String,
    },
    Stop {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        stop_hook_active: bool,
    },
    SubagentStop {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        stop_hook_active: bool,
        agent_id: String,
        agent_transcript_path: String,
        agent_type: String,
    },
    PreCompact {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        trigger: String,
        custom_instructions: Option<String>,
    },
    Notification {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        message: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        title: Option<String>,
        notification_type: String,
    },
    SubagentStart {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        agent_id: String,
        agent_type: String,
    },
    PermissionRequest {
        session_id: String,
        transcript_path: String,
        cwd: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_mode: Option<String>,
        tool_name: String,
        tool_input: serde_json::Value,
        #[serde(skip_serializing_if = "Option::is_none")]
        permission_suggestions: Option<Vec<serde_json::Value>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_type: Option<String>,
    },
}

// Hook-specific output types
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "hookEventName")]
pub enum HookSpecificOutput {
    PreToolUse {
        #[serde(rename = "permissionDecision", skip_serializing_if = "Option::is_none")]
        permission_decision: Option<String>,
        #[serde(
            rename = "permissionDecisionReason",
            skip_serializing_if = "Option::is_none"
        )]
        permission_decision_reason: Option<String>,
        #[serde(rename = "updatedInput", skip_serializing_if = "Option::is_none")]
        updated_input: Option<serde_json::Value>,
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    PostToolUse {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
        #[serde(
            rename = "updatedMCPToolOutput",
            skip_serializing_if = "Option::is_none"
        )]
        updated_mcp_tool_output: Option<serde_json::Value>,
    },
    PostToolUseFailure {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    UserPromptSubmit {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    SessionStart {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    Notification {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    SubagentStart {
        #[serde(rename = "additionalContext", skip_serializing_if = "Option::is_none")]
        additional_context: Option<String>,
    },
    PermissionRequest {
        decision: serde_json::Value,
    },
}

// Hook JSON output
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum HookJSONOutput {
    Async {
        #[serde(rename = "async")]
        async_: bool,
        #[serde(rename = "asyncTimeout", skip_serializing_if = "Option::is_none")]
        async_timeout: Option<i64>,
    },
    Sync {
        #[serde(rename = "continue", skip_serializing_if = "Option::is_none")]
        continue_: Option<bool>,
        #[serde(rename = "suppressOutput", skip_serializing_if = "Option::is_none")]
        suppress_output: Option<bool>,
        #[serde(rename = "stopReason", skip_serializing_if = "Option::is_none")]
        stop_reason: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        decision: Option<String>,
        #[serde(rename = "systemMessage", skip_serializing_if = "Option::is_none")]
        system_message: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        reason: Option<String>,
        #[serde(rename = "hookSpecificOutput", skip_serializing_if = "Option::is_none")]
        hook_specific_output: Option<HookSpecificOutput>,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct HookContext {
    pub signal: Option<serde_json::Value>,
}

/// Can-use-tool permission callback type.
pub type CanUseToolFn = Arc<
    dyn Fn(
            String,
            HashMap<String, serde_json::Value>,
            ToolPermissionContext,
        ) -> Pin<Box<dyn Future<Output = PermissionResult> + Send>>
        + Send
        + Sync,
>;

/// Stderr callback type.
pub type StderrCallbackFn = Arc<dyn Fn(String) + Send + Sync>;

/// Hook callback function type.
pub type HookCallbackFn = Arc<
    dyn Fn(
            HookInput,
            Option<String>,
            HookContext,
        ) -> futures::future::BoxFuture<'static, HookJSONOutput>
        + Send
        + Sync,
>;

/// Hook matcher configuration.
pub struct HookMatcher {
    pub matcher: Option<String>,
    pub hooks: Vec<HookCallbackFn>,
    pub timeout: Option<f64>,
}

impl std::fmt::Debug for HookMatcher {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("HookMatcher")
            .field("matcher", &self.matcher)
            .field("hooks", &format!("[{} hooks]", self.hooks.len()))
            .field("timeout", &self.timeout)
            .finish()
    }
}

// ---------------------------------------------------------------------------
// MCP Server config types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum McpServerConfig {
    #[serde(rename = "stdio")]
    Stdio {
        command: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        args: Option<Vec<String>>,
        #[serde(skip_serializing_if = "Option::is_none")]
        env: Option<HashMap<String, String>>,
    },
    #[serde(rename = "sse")]
    Sse {
        url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        headers: Option<HashMap<String, String>>,
    },
    #[serde(rename = "http")]
    Http {
        url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        headers: Option<HashMap<String, String>>,
    },
    #[serde(rename = "sdk")]
    Sdk { name: String },
    #[serde(rename = "claudeai-proxy")]
    ClaudeAIProxy { url: String, id: String },
}

/// MCP servers configuration — can be a dict of configs, or a path to a config file.
#[derive(Debug, Clone)]
pub enum McpServersConfig {
    Dict(HashMap<String, McpServerConfig>),
    Path(PathBuf),
}

// ---------------------------------------------------------------------------
// MCP Server status types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum McpServerConnectionStatus {
    #[serde(rename = "connected")]
    Connected,
    #[serde(rename = "failed")]
    Failed,
    #[serde(rename = "needs-auth")]
    NeedsAuth,
    #[serde(rename = "pending")]
    Pending,
    #[serde(rename = "disabled")]
    Disabled,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct McpToolAnnotations {
    #[serde(rename = "readOnly", skip_serializing_if = "Option::is_none")]
    pub read_only: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub destructive: Option<bool>,
    #[serde(rename = "openWorld", skip_serializing_if = "Option::is_none")]
    pub open_world: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct McpToolInfo {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub annotations: Option<McpToolAnnotations>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct McpServerInfo {
    pub name: String,
    pub version: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct McpServerStatus {
    pub name: String,
    pub status: McpServerConnectionStatus,
    #[serde(rename = "serverInfo", skip_serializing_if = "Option::is_none")]
    pub server_info: Option<McpServerInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub config: Option<McpServerConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tools: Option<Vec<McpToolInfo>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct McpStatusResponse {
    #[serde(rename = "mcpServers")]
    pub mcp_servers: Vec<McpServerStatus>,
}

// ---------------------------------------------------------------------------
// Context usage types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ContextUsageCategory {
    pub name: String,
    pub tokens: i64,
    pub color: String,
    #[serde(rename = "isDeferred", skip_serializing_if = "Option::is_none")]
    pub is_deferred: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextUsageResponse {
    pub categories: Vec<ContextUsageCategory>,
    pub total_tokens: i64,
    pub max_tokens: i64,
    pub raw_max_tokens: i64,
    pub percentage: f64,
    pub model: String,
    pub is_auto_compact_enabled: bool,
    pub memory_files: Vec<serde_json::Value>,
    pub mcp_tools: Vec<serde_json::Value>,
    pub agents: Vec<serde_json::Value>,
    pub grid_rows: Vec<Vec<serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auto_compact_threshold: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deferred_builtin_tools: Option<Vec<serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_tools: Option<Vec<serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_prompt_sections: Option<Vec<serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub slash_commands: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skills: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_breakdown: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api_usage: Option<serde_json::Value>,
}

// ---------------------------------------------------------------------------
// Plugin config
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SdkPluginConfig {
    #[serde(rename = "type")]
    pub type_: String,
    pub path: String,
}

// ---------------------------------------------------------------------------
// Sandbox settings
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SandboxNetworkConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allowed_domains: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub denied_domains: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_managed_domains_only: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_unix_sockets: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_all_unix_sockets: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_local_binding: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_mach_lookup: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub http_proxy_port: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub socks_proxy_port: Option<i32>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SandboxIgnoreViolations {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub network: Option<Vec<String>>,
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SandboxSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auto_allow_bash_if_sandboxed: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub excluded_commands: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_unsandboxed_commands: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub network: Option<SandboxNetworkConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ignore_violations: Option<SandboxIgnoreViolations>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enable_weaker_nested_sandbox: Option<bool>,
}

// ---------------------------------------------------------------------------
// Content block types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TextBlock {
    pub text: String,
}

impl TextBlock {
    pub fn new(text: impl Into<String>) -> Self {
        Self { text: text.into() }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ThinkingBlock {
    pub thinking: String,
    pub signature: String,
}

impl ThinkingBlock {
    pub fn new(thinking: impl Into<String>, signature: impl Into<String>) -> Self {
        Self {
            thinking: thinking.into(),
            signature: signature.into(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToolUseBlock {
    pub id: String,
    pub name: String,
    pub input: serde_json::Value,
}

impl ToolUseBlock {
    pub fn new(id: impl Into<String>, name: impl Into<String>, input: serde_json::Value) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            input,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ToolResultBlock {
    pub tool_use_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<ToolResultContent>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_error: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ToolResultContent {
    Text(String),
    Blocks(Vec<serde_json::Value>),
}

impl ToolResultBlock {
    pub fn new(tool_use_id: impl Into<String>) -> Self {
        Self {
            tool_use_id: tool_use_id.into(),
            content: None,
            is_error: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ServerToolUseBlock {
    pub id: String,
    pub name: String,
    pub input: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ServerToolResultBlock {
    pub tool_use_id: String,
    pub content: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ContentBlock {
    #[serde(rename = "text")]
    Text(TextBlock),
    #[serde(rename = "thinking")]
    Thinking(ThinkingBlock),
    #[serde(rename = "tool_use")]
    ToolUse(ToolUseBlock),
    #[serde(rename = "tool_result")]
    ToolResult(ToolResultBlock),
    #[serde(rename = "server_tool_use")]
    ServerToolUse(ServerToolUseBlock),
    // Server tool results have varying type names (e.g. "advisor_tool_result")
    #[serde(untagged)]
    ServerToolResult(ServerToolResultBlock),
}

// ---------------------------------------------------------------------------
// Message types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AssistantMessageError {
    #[serde(rename = "authentication_failed")]
    AuthenticationFailed,
    #[serde(rename = "billing_error")]
    BillingError,
    #[serde(rename = "rate_limit")]
    RateLimit,
    #[serde(rename = "invalid_request")]
    InvalidRequest,
    #[serde(rename = "server_error")]
    ServerError,
    #[serde(rename = "unknown")]
    Unknown,
}

/// Content of a UserMessage — can be a string or structured blocks.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MessageContent {
    Text(String),
    Blocks(Vec<ContentBlock>),
}

impl From<String> for MessageContent {
    fn from(s: String) -> Self {
        Self::Text(s)
    }
}

impl From<&str> for MessageContent {
    fn from(s: &str) -> Self {
        Self::Text(s.to_string())
    }
}

impl From<Vec<ContentBlock>> for MessageContent {
    fn from(blocks: Vec<ContentBlock>) -> Self {
        Self::Blocks(blocks)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct UserMessage {
    pub content: MessageContent,
    pub uuid: Option<String>,
    pub parent_tool_use_id: Option<String>,
    pub tool_use_result: Option<serde_json::Value>,
}

impl UserMessage {
    pub fn new(content: impl Into<MessageContent>) -> Self {
        Self {
            content: content.into(),
            uuid: None,
            parent_tool_use_id: None,
            tool_use_result: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct AssistantMessage {
    pub content: Vec<ContentBlock>,
    pub model: String,
    pub parent_tool_use_id: Option<String>,
    pub error: Option<String>,
    pub usage: Option<serde_json::Value>,
    pub message_id: Option<String>,
    pub stop_reason: Option<String>,
    pub session_id: Option<String>,
    pub uuid: Option<String>,
}

impl AssistantMessage {
    pub fn new(content: Vec<ContentBlock>, model: impl Into<String>) -> Self {
        Self {
            content,
            model: model.into(),
            parent_tool_use_id: None,
            error: None,
            usage: None,
            message_id: None,
            stop_reason: None,
            session_id: None,
            uuid: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct SystemMessage {
    pub subtype: String,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TaskUsage {
    pub total_tokens: i64,
    pub tool_uses: i64,
    pub duration_ms: i64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TaskNotificationStatus {
    #[serde(rename = "completed")]
    Completed,
    #[serde(rename = "failed")]
    Failed,
    #[serde(rename = "stopped")]
    Stopped,
}

#[derive(Debug, Clone, PartialEq)]
pub struct TaskStartedMessage {
    // SystemMessage base fields
    pub subtype: String,
    pub data: serde_json::Value,
    // Own fields
    pub task_id: String,
    pub description: String,
    pub uuid: String,
    pub session_id: String,
    pub tool_use_id: Option<String>,
    pub task_type: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct TaskProgressMessage {
    // SystemMessage base fields
    pub subtype: String,
    pub data: serde_json::Value,
    // Own fields
    pub task_id: String,
    pub description: String,
    pub usage: serde_json::Value,
    pub uuid: String,
    pub session_id: String,
    pub tool_use_id: Option<String>,
    pub last_tool_name: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct TaskNotificationMessage {
    // SystemMessage base fields
    pub subtype: String,
    pub data: serde_json::Value,
    // Own fields
    pub task_id: String,
    pub status: String,
    pub output_file: String,
    pub summary: String,
    pub uuid: String,
    pub session_id: String,
    pub tool_use_id: Option<String>,
    pub usage: Option<serde_json::Value>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct MirrorErrorMessage {
    // SystemMessage base fields
    pub subtype: String,
    pub data: serde_json::Value,
    // Own fields
    pub key: Option<SessionKey>,
    pub error: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ResultMessage {
    pub subtype: String,
    pub duration_ms: i64,
    pub duration_api_ms: i64,
    pub is_error: bool,
    pub num_turns: i64,
    pub session_id: String,
    pub stop_reason: Option<String>,
    pub total_cost_usd: Option<f64>,
    pub usage: Option<serde_json::Value>,
    pub result: Option<String>,
    pub structured_output: Option<serde_json::Value>,
    pub model_usage: Option<serde_json::Value>,
    pub permission_denials: Option<Vec<serde_json::Value>>,
    pub errors: Option<Vec<String>>,
    pub uuid: Option<String>,
}

impl ResultMessage {
    pub fn new(
        subtype: impl Into<String>,
        duration_ms: i64,
        duration_api_ms: i64,
        is_error: bool,
        num_turns: i64,
        session_id: impl Into<String>,
    ) -> Self {
        Self {
            subtype: subtype.into(),
            duration_ms,
            duration_api_ms,
            is_error,
            num_turns,
            session_id: session_id.into(),
            stop_reason: None,
            total_cost_usd: None,
            usage: None,
            result: None,
            structured_output: None,
            model_usage: None,
            permission_denials: None,
            errors: None,
            uuid: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct StreamEvent {
    pub uuid: String,
    pub session_id: String,
    pub event: serde_json::Value,
    pub parent_tool_use_id: Option<String>,
}

// ---------------------------------------------------------------------------
// Rate limit types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum RateLimitStatus {
    #[serde(rename = "allowed")]
    Allowed,
    #[serde(rename = "allowed_warning")]
    AllowedWarning,
    #[serde(rename = "rejected")]
    Rejected,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum RateLimitType {
    #[serde(rename = "five_hour")]
    FiveHour,
    #[serde(rename = "seven_day")]
    SevenDay,
    #[serde(rename = "seven_day_opus")]
    SevenDayOpus,
    #[serde(rename = "seven_day_sonnet")]
    SevenDaySonnet,
    #[serde(rename = "overage")]
    Overage,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RateLimitInfo {
    pub status: RateLimitStatus,
    pub resets_at: Option<i64>,
    pub rate_limit_type: Option<RateLimitType>,
    pub utilization: Option<f64>,
    pub overage_status: Option<RateLimitStatus>,
    pub overage_resets_at: Option<i64>,
    pub overage_disabled_reason: Option<String>,
    pub raw: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RateLimitEvent {
    pub rate_limit_info: RateLimitInfo,
    pub uuid: String,
    pub session_id: String,
}

// ---------------------------------------------------------------------------
// Message enum
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq)]
pub enum Message {
    User(UserMessage),
    Assistant(AssistantMessage),
    System(SystemMessage),
    TaskStarted(TaskStartedMessage),
    TaskProgress(TaskProgressMessage),
    TaskNotification(TaskNotificationMessage),
    MirrorError(MirrorErrorMessage),
    Result(ResultMessage),
    Stream(StreamEvent),
    RateLimit(RateLimitEvent),
}

impl Message {
    /// Returns true if this is a SystemMessage variant (including subclasses).
    pub fn is_system(&self) -> bool {
        matches!(
            self,
            Message::System(_)
                | Message::TaskStarted(_)
                | Message::TaskProgress(_)
                | Message::TaskNotification(_)
                | Message::MirrorError(_)
        )
    }
}

// ---------------------------------------------------------------------------
// Session Store Types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct SessionKey {
    pub project_key: String,
    pub session_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subpath: Option<String>,
}

impl SessionKey {
    pub fn new(project_key: impl Into<String>, session_id: impl Into<String>) -> Self {
        Self {
            project_key: project_key.into(),
            session_id: session_id.into(),
            subpath: None,
        }
    }
}

pub type SessionStoreEntry = serde_json::Value;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SessionStoreListEntry {
    pub session_id: String,
    pub mtime: i64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SessionSummaryEntry {
    pub session_id: String,
    pub mtime: i64,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct SessionListSubkeysKey {
    pub project_key: String,
    pub session_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SessionStoreFlushMode {
    #[serde(rename = "batched")]
    Batched,
    #[serde(rename = "eager")]
    Eager,
}

/// SessionStore trait — adapter for mirroring session transcripts.
#[async_trait::async_trait]
pub trait SessionStore: Send + Sync {
    async fn append(
        &self,
        key: &SessionKey,
        entries: &[SessionStoreEntry],
    ) -> std::result::Result<(), ClaudeSDKError>;

    async fn load(
        &self,
        key: &SessionKey,
    ) -> std::result::Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError>;

    async fn list_sessions(
        &self,
        _project_key: &str,
    ) -> std::result::Result<Vec<SessionStoreListEntry>, ClaudeSDKError> {
        Err(ClaudeSDKError::sdk("list_sessions not implemented"))
    }

    async fn list_session_summaries(
        &self,
        _project_key: &str,
    ) -> std::result::Result<Vec<SessionSummaryEntry>, ClaudeSDKError> {
        Err(ClaudeSDKError::sdk(
            "list_session_summaries not implemented",
        ))
    }

    async fn delete(&self, _key: &SessionKey) -> std::result::Result<(), ClaudeSDKError> {
        Err(ClaudeSDKError::sdk("delete not implemented"))
    }

    async fn list_subkeys(
        &self,
        _key: &SessionListSubkeysKey,
    ) -> std::result::Result<Vec<String>, ClaudeSDKError> {
        Err(ClaudeSDKError::sdk("list_subkeys not implemented"))
    }

    /// Whether this store implements `list_sessions` beyond the default.
    /// Override to return `true` in stores that provide a real implementation.
    fn has_list_sessions(&self) -> bool {
        false
    }

    /// Whether this store implements `delete` beyond the default.
    fn has_delete(&self) -> bool {
        false
    }

    /// Whether this store implements `list_subkeys` beyond the default.
    fn has_list_subkeys(&self) -> bool {
        false
    }

    /// Whether this store implements `list_session_summaries` beyond the default.
    fn has_list_session_summaries(&self) -> bool {
        false
    }
}

// ---------------------------------------------------------------------------
// Session listing types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct SDKSessionInfo {
    pub session_id: String,
    pub summary: String,
    pub last_modified: i64,
    pub file_size: Option<i64>,
    pub custom_title: Option<String>,
    pub first_prompt: Option<String>,
    pub git_branch: Option<String>,
    pub cwd: Option<String>,
    pub tag: Option<String>,
    pub created_at: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SessionMessageType {
    #[serde(rename = "user")]
    User,
    #[serde(rename = "assistant")]
    Assistant,
}

impl SessionMessageType {
    pub fn as_str(&self) -> &str {
        match self {
            Self::User => "user",
            Self::Assistant => "assistant",
        }
    }
}

impl std::fmt::Display for SessionMessageType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

impl PartialEq<str> for SessionMessageType {
    fn eq(&self, other: &str) -> bool {
        self.as_str() == other
    }
}

impl PartialEq<&str> for SessionMessageType {
    fn eq(&self, other: &&str) -> bool {
        self.as_str() == *other
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct SessionMessage {
    pub type_: SessionMessageType,
    pub uuid: String,
    pub session_id: String,
    pub message: serde_json::Value,
    pub parent_tool_use_id: Option<String>,
}

// ---------------------------------------------------------------------------
// Thinking config
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ThinkingDisplay {
    #[serde(rename = "summarized")]
    Summarized,
    #[serde(rename = "omitted")]
    Omitted,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ThinkingConfig {
    #[serde(rename = "adaptive")]
    Adaptive {
        #[serde(skip_serializing_if = "Option::is_none")]
        display: Option<ThinkingDisplay>,
    },
    #[serde(rename = "enabled")]
    Enabled {
        budget_tokens: i64,
        #[serde(skip_serializing_if = "Option::is_none")]
        display: Option<ThinkingDisplay>,
    },
    #[serde(rename = "disabled")]
    Disabled,
}

// ---------------------------------------------------------------------------
// Claude Agent Options
// ---------------------------------------------------------------------------

pub struct ClaudeAgentOptions {
    pub tools: Option<ToolsConfig>,
    pub allowed_tools: Vec<String>,
    pub system_prompt: Option<SystemPromptConfig>,
    pub mcp_servers: McpServersConfig,
    pub strict_mcp_config: bool,
    pub permission_mode: Option<PermissionMode>,
    pub continue_conversation: bool,
    pub resume: Option<String>,
    pub session_id: Option<String>,
    pub max_turns: Option<i64>,
    pub max_budget_usd: Option<f64>,
    pub disallowed_tools: Vec<String>,
    pub model: Option<String>,
    pub fallback_model: Option<String>,
    pub betas: Vec<SdkBeta>,
    pub permission_prompt_tool_name: Option<String>,
    pub cwd: Option<PathBuf>,
    pub cli_path: Option<PathBuf>,
    pub settings: Option<String>,
    pub add_dirs: Vec<PathBuf>,
    pub env: HashMap<String, String>,
    pub extra_args: HashMap<String, Option<String>>,
    pub max_buffer_size: Option<usize>,
    pub can_use_tool: Option<CanUseToolFn>,
    pub hooks: Option<HashMap<HookEvent, Vec<HookMatcher>>>,
    pub user: Option<String>,
    pub include_partial_messages: bool,
    pub fork_session: bool,
    pub agents: Option<HashMap<String, AgentDefinition>>,
    pub setting_sources: Option<Vec<SettingSource>>,
    pub skills: Option<serde_json::Value>,
    pub sandbox: Option<SandboxSettings>,
    pub plugins: Vec<SdkPluginConfig>,
    pub max_thinking_tokens: Option<i64>,
    pub thinking: Option<ThinkingConfig>,
    pub effort: Option<String>,
    pub output_format: Option<serde_json::Value>,
    pub enable_file_checkpointing: bool,
    pub session_store: Option<Box<dyn SessionStore>>,
    pub session_store_flush: SessionStoreFlushMode,
    pub load_timeout_ms: i64,
    pub task_budget: Option<TaskBudget>,
    pub stderr: Option<StderrCallbackFn>,
}

impl std::fmt::Debug for ClaudeAgentOptions {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ClaudeAgentOptions")
            .field("model", &self.model)
            .field("permission_mode", &self.permission_mode)
            .field("cwd", &self.cwd)
            .field("allowed_tools", &self.allowed_tools)
            .field("disallowed_tools", &self.disallowed_tools)
            .finish_non_exhaustive()
    }
}

impl Default for ClaudeAgentOptions {
    fn default() -> Self {
        Self {
            tools: None,
            allowed_tools: Vec::new(),
            system_prompt: None,
            mcp_servers: McpServersConfig::Dict(HashMap::new()),
            strict_mcp_config: false,
            permission_mode: None,
            continue_conversation: false,
            resume: None,
            session_id: None,
            max_turns: None,
            max_budget_usd: None,
            disallowed_tools: Vec::new(),
            model: None,
            fallback_model: None,
            betas: Vec::new(),
            permission_prompt_tool_name: None,
            cwd: None,
            cli_path: None,
            settings: None,
            add_dirs: Vec::new(),
            env: HashMap::new(),
            extra_args: HashMap::new(),
            max_buffer_size: None,
            can_use_tool: None,
            hooks: None,
            user: None,
            include_partial_messages: false,
            fork_session: false,
            agents: None,
            setting_sources: None,
            skills: None,
            sandbox: None,
            plugins: Vec::new(),
            max_thinking_tokens: None,
            thinking: None,
            effort: None,
            output_format: None,
            enable_file_checkpointing: false,
            session_store: None,
            session_store_flush: SessionStoreFlushMode::Batched,
            load_timeout_ms: 60_000,
            task_budget: None,
            stderr: None,
        }
    }
}

// ---------------------------------------------------------------------------
// SDK Control Protocol types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "subtype")]
pub enum SDKControlRequestBody {
    #[serde(rename = "interrupt")]
    Interrupt,
    #[serde(rename = "can_use_tool")]
    CanUseTool {
        tool_name: String,
        input: serde_json::Value,
        permission_suggestions: Option<Vec<serde_json::Value>>,
        blocked_path: Option<String>,
        tool_use_id: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        agent_id: Option<String>,
    },
    #[serde(rename = "initialize")]
    Initialize {
        hooks: Option<serde_json::Value>,
        #[serde(skip_serializing_if = "Option::is_none")]
        agents: Option<serde_json::Value>,
    },
    #[serde(rename = "set_permission_mode")]
    SetPermissionMode { mode: PermissionMode },
    #[serde(rename = "hook_callback")]
    HookCallback {
        callback_id: String,
        input: serde_json::Value,
        tool_use_id: Option<String>,
    },
    #[serde(rename = "mcp_message")]
    McpMessage {
        server_name: String,
        message: serde_json::Value,
    },
    #[serde(rename = "rewind_files")]
    RewindFiles { user_message_id: String },
    #[serde(rename = "mcp_reconnect")]
    McpReconnect {
        #[serde(rename = "serverName")]
        server_name: String,
    },
    #[serde(rename = "mcp_toggle")]
    McpToggle {
        #[serde(rename = "serverName")]
        server_name: String,
        enabled: bool,
    },
    #[serde(rename = "stop_task")]
    StopTask { task_id: String },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SDKControlRequest {
    #[serde(rename = "type")]
    pub type_: String,
    pub request_id: String,
    pub request: SDKControlRequestBody,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "subtype")]
pub enum ControlResponseBody {
    #[serde(rename = "success")]
    Success {
        request_id: String,
        response: Option<serde_json::Value>,
    },
    #[serde(rename = "error")]
    Error { request_id: String, error: String },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SDKControlResponse {
    #[serde(rename = "type")]
    pub type_: String,
    pub response: ControlResponseBody,
}

// ---------------------------------------------------------------------------
// Fork result
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ForkSessionResult {
    pub session_id: String,
}
