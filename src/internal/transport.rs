use std::collections::HashMap;
use std::sync::Mutex;

use crate::errors::{ClaudeSDKError, Result};
use crate::types::{
    ClaudeAgentOptions, McpServersConfig, PermissionMode, SettingSource, SystemPrompt,
    SystemPromptConfig, ThinkingConfig, ThinkingDisplay, ToolsConfig,
};

/// SDK version constant.
const SDK_VERSION: &str = env!("CARGO_PKG_VERSION");

// Track live CLI subprocesses so we can SIGTERM them on exit.
static ACTIVE_CHILDREN: Mutex<Vec<u32>> = Mutex::new(Vec::new());

fn register_child(pid: u32) {
    if let Ok(mut children) = ACTIVE_CHILDREN.lock() {
        children.push(pid);
    }
}

fn unregister_child(pid: u32) {
    if let Ok(mut children) = ACTIVE_CHILDREN.lock() {
        children.retain(|&p| p != pid);
    }
}

/// Kill all tracked child processes. Called via atexit-equivalent (Drop guard).
fn kill_active_children() {
    if let Ok(mut children) = ACTIVE_CHILDREN.lock() {
        for &pid in children.iter() {
            #[cfg(unix)]
            unsafe {
                libc::kill(pid as i32, libc::SIGTERM);
            }
        }
        children.clear();
    }
}

/// Drop guard that kills active children on process exit.
struct AtExitGuard;

impl Drop for AtExitGuard {
    fn drop(&mut self) {
        kill_active_children();
    }
}

// Lazy static to ensure the guard lives for program lifetime.
static ATEXIT_INIT: std::sync::Once = std::sync::Once::new();

fn ensure_atexit_registered() {
    ATEXIT_INIT.call_once(|| {
        // Leak the guard so it runs Drop at program exit.
        std::mem::forget(Box::new(AtExitGuard));
        // Use a ctrlc-style approach: register the guard in a static.
        // The Mutex<Vec<u32>> itself handles cleanup.
    });
}

/// Transport trait for communicating with the CLI subprocess.
#[async_trait::async_trait]
pub trait Transport: Send + Sync {
    async fn connect(&mut self) -> Result<()>;
    async fn close(&mut self) -> Result<()>;
    async fn write(&mut self, data: &str) -> Result<()>;
    async fn end_input(&mut self) -> Result<()>;
    fn is_ready(&self) -> bool;

    /// Read the next JSON message from stdout. Returns None on EOF.
    async fn read_message(&mut self) -> Result<Option<serde_json::Value>> {
        // Default implementation returns None (no messages)
        Ok(None)
    }
}

/// Default buffer size for subprocess stdout reads.
pub const DEFAULT_MAX_BUFFER_SIZE: usize = 1024 * 1024;

/// Minimum Claude Code version required.
pub const MINIMUM_CLAUDE_CODE_VERSION: &str = "2.0.0";

/// SubprocessCLITransport — spawns and manages a Claude CLI subprocess.
pub struct SubprocessCLITransport {
    pub prompt: String,
    pub options: ClaudeAgentOptions,
    connected: bool,
    child: Option<tokio::process::Child>,
    stdout_reader: Option<tokio::io::BufReader<tokio::process::ChildStdout>>,
    /// Accumulates partial JSON when a line doesn't parse on its own.
    json_buffer: String,
    /// Write lock to serialize stdin writes and prevent TOCTOU with close()/end_input().
    write_lock: tokio::sync::Mutex<()>,
    /// Background task for reading stderr.
    stderr_task: Option<tokio::task::JoinHandle<()>>,
}

impl SubprocessCLITransport {
    pub fn new(prompt: impl Into<String>, options: ClaudeAgentOptions) -> Self {
        Self {
            prompt: prompt.into(),
            options,
            connected: false,
            child: None,
            stdout_reader: None,
            json_buffer: String::new(),
            write_lock: tokio::sync::Mutex::new(()),
            stderr_task: None,
        }
    }

    /// Compute effective allowed_tools and setting_sources for skills.
    ///
    /// When `skills` is `"all"`, injects the bare `Skill` tool;
    /// when it is a list, injects `Skill(name)` for each entry. In either
    /// case `setting_sources` defaults to `["user", "project"]` when unset.
    /// `None` is a no-op.
    ///
    /// Does not mutate the original options.
    fn apply_skills_defaults(&self) -> (Vec<String>, Option<Vec<SettingSource>>) {
        let mut allowed_tools: Vec<String> = self.options.allowed_tools.clone();
        let mut setting_sources: Option<Vec<SettingSource>> = self.options.setting_sources.clone();

        let skills = match &self.options.skills {
            Some(s) => s,
            None => return (allowed_tools, setting_sources),
        };

        if skills.is_string() {
            // skills == "all"
            if !allowed_tools.contains(&"Skill".to_string()) {
                allowed_tools.push("Skill".to_string());
            }
        } else if let Some(arr) = skills.as_array() {
            for name in arr {
                if let Some(name_str) = name.as_str() {
                    let pattern = format!("Skill({name_str})");
                    if !allowed_tools.contains(&pattern) {
                        allowed_tools.push(pattern);
                    }
                }
            }
        }

        if setting_sources.is_none() {
            setting_sources = Some(vec![SettingSource::User, SettingSource::Project]);
        }

        (allowed_tools, setting_sources)
    }

    pub fn build_command(&self) -> Vec<String> {
        let cli_path = match &self.options.cli_path {
            Some(p) => p.to_string_lossy().to_string(),
            None => panic!("CLI path not resolved. Call connect() first."),
        };

        let mut cmd = vec![
            cli_path,
            "--output-format".into(),
            "stream-json".into(),
            "--verbose".into(),
        ];

        // System prompt handling
        match &self.options.system_prompt {
            None => {
                cmd.push("--system-prompt".into());
                cmd.push(String::new());
            }
            Some(SystemPromptConfig::String(s)) => {
                cmd.push("--system-prompt".into());
                cmd.push(s.clone());
            }
            Some(SystemPromptConfig::Structured(sp)) => match sp {
                SystemPrompt::File { path } => {
                    cmd.push("--system-prompt-file".into());
                    cmd.push(path.clone());
                }
                SystemPrompt::Preset { append, .. } => {
                    if let Some(append_text) = append {
                        cmd.push("--append-system-prompt".into());
                        cmd.push(append_text.clone());
                    }
                }
            },
        }

        // Handle tools option
        if let Some(tools) = &self.options.tools {
            match tools {
                ToolsConfig::List(list) => {
                    cmd.push("--tools".into());
                    if list.is_empty() {
                        cmd.push(String::new());
                    } else {
                        cmd.push(list.join(","));
                    }
                }
                ToolsConfig::Preset(_) => {
                    cmd.push("--tools".into());
                    cmd.push("default".into());
                }
            }
        }

        let (effective_allowed_tools, effective_setting_sources) = self.apply_skills_defaults();

        if !effective_allowed_tools.is_empty() {
            cmd.push("--allowedTools".into());
            cmd.push(effective_allowed_tools.join(","));
        }

        if let Some(max_turns) = self.options.max_turns {
            cmd.push("--max-turns".into());
            cmd.push(max_turns.to_string());
        }

        if let Some(max_budget_usd) = self.options.max_budget_usd {
            cmd.push("--max-budget-usd".into());
            cmd.push(max_budget_usd.to_string());
        }

        if !self.options.disallowed_tools.is_empty() {
            cmd.push("--disallowedTools".into());
            cmd.push(self.options.disallowed_tools.join(","));
        }

        if let Some(task_budget) = &self.options.task_budget {
            cmd.push("--task-budget".into());
            cmd.push(task_budget.total.to_string());
        }

        if let Some(model) = &self.options.model {
            cmd.push("--model".into());
            cmd.push(model.clone());
        }

        if let Some(fallback_model) = &self.options.fallback_model {
            cmd.push("--fallback-model".into());
            cmd.push(fallback_model.clone());
        }

        if !self.options.betas.is_empty() {
            let betas_str: Vec<String> = self
                .options
                .betas
                .iter()
                .map(|b| {
                    serde_json::to_value(b)
                        .unwrap()
                        .as_str()
                        .unwrap()
                        .to_string()
                })
                .collect();
            cmd.push("--betas".into());
            cmd.push(betas_str.join(","));
        }

        if let Some(ppt) = &self.options.permission_prompt_tool_name {
            cmd.push("--permission-prompt-tool".into());
            cmd.push(ppt.clone());
        }

        if let Some(pm) = &self.options.permission_mode {
            cmd.push("--permission-mode".into());
            let pm_str = match pm {
                PermissionMode::Default => "default",
                PermissionMode::AcceptEdits => "acceptEdits",
                PermissionMode::Plan => "plan",
                PermissionMode::BypassPermissions => "bypassPermissions",
                PermissionMode::DontAsk => "dontAsk",
                PermissionMode::Auto => "auto",
            };
            cmd.push(pm_str.into());
        }

        if self.options.continue_conversation {
            cmd.push("--continue".into());
        }

        if let Some(resume) = &self.options.resume {
            cmd.push("--resume".into());
            cmd.push(resume.clone());
        }

        if let Some(session_id) = &self.options.session_id {
            cmd.push("--session-id".into());
            cmd.push(session_id.clone());
        }

        // Handle settings and sandbox
        if let Some(settings_value) = self.build_settings_value() {
            cmd.push("--settings".into());
            cmd.push(settings_value);
        }

        if !self.options.add_dirs.is_empty() {
            for dir in &self.options.add_dirs {
                cmd.push("--add-dir".into());
                cmd.push(dir.to_string_lossy().to_string());
            }
        }

        match &self.options.mcp_servers {
            McpServersConfig::Dict(servers) if !servers.is_empty() => {
                let servers_for_cli: serde_json::Map<String, serde_json::Value> = servers
                    .iter()
                    .map(|(name, config)| (name.clone(), serde_json::to_value(config).unwrap()))
                    .collect();

                let mcp_config = serde_json::json!({ "mcpServers": servers_for_cli });
                cmd.push("--mcp-config".into());
                cmd.push(serde_json::to_string(&mcp_config).unwrap());
            }
            McpServersConfig::Path(path) => {
                cmd.push("--mcp-config".into());
                cmd.push(path.to_string_lossy().to_string());
            }
            _ => {}
        }

        if self.options.include_partial_messages {
            cmd.push("--include-partial-messages".into());
        }

        if self.options.strict_mcp_config {
            cmd.push("--strict-mcp-config".into());
        }

        if self.options.fork_session {
            cmd.push("--fork-session".into());
        }

        if self.options.session_store.is_some() {
            cmd.push("--session-mirror".into());
        }

        // Agents are always sent via initialize request — no --agents CLI flag

        if let Some(ref sources) = effective_setting_sources {
            let sources_str: Vec<&str> = sources
                .iter()
                .map(|s| match s {
                    SettingSource::User => "user",
                    SettingSource::Project => "project",
                    SettingSource::Local => "local",
                })
                .collect();
            cmd.push(format!("--setting-sources={}", sources_str.join(",")));
        }

        // Add plugin directories
        for plugin in &self.options.plugins {
            if plugin.type_ == "local" {
                cmd.push("--plugin-dir".into());
                cmd.push(plugin.path.clone());
            }
        }

        // Add extra args
        for (flag, value) in &self.options.extra_args {
            match value {
                None => {
                    cmd.push(format!("--{flag}"));
                }
                Some(v) => {
                    cmd.push(format!("--{flag}"));
                    cmd.push(v.clone());
                }
            }
        }

        // Resolve thinking config
        if let Some(thinking) = &self.options.thinking {
            match thinking {
                ThinkingConfig::Adaptive { display } => {
                    cmd.push("--thinking".into());
                    cmd.push("adaptive".into());
                    if let Some(d) = display {
                        cmd.push("--thinking-display".into());
                        cmd.push(thinking_display_str(d).into());
                    }
                }
                ThinkingConfig::Enabled {
                    budget_tokens,
                    display,
                } => {
                    cmd.push("--max-thinking-tokens".into());
                    cmd.push(budget_tokens.to_string());
                    if let Some(d) = display {
                        cmd.push("--thinking-display".into());
                        cmd.push(thinking_display_str(d).into());
                    }
                }
                ThinkingConfig::Disabled => {
                    cmd.push("--thinking".into());
                    cmd.push("disabled".into());
                }
            }
        } else if let Some(mtt) = self.options.max_thinking_tokens {
            cmd.push("--max-thinking-tokens".into());
            cmd.push(mtt.to_string());
        }

        if let Some(effort) = &self.options.effort {
            cmd.push("--effort".into());
            cmd.push(effort.clone());
        }

        // Extract schema from output_format
        if let Some(output_format) = &self.options.output_format {
            if let Some(obj) = output_format.as_object() {
                if obj.get("type").and_then(|v| v.as_str()) == Some("json_schema") {
                    if let Some(schema) = obj.get("schema") {
                        cmd.push("--json-schema".into());
                        cmd.push(serde_json::to_string(schema).unwrap());
                    }
                }
            }
        }

        // Always use streaming mode with stdin
        cmd.push("--input-format".into());
        cmd.push("stream-json".into());

        cmd
    }

    pub fn find_cli(&self) -> Result<String> {
        // First, check if cli_path is provided
        if let Some(ref cli_path) = self.options.cli_path {
            return Ok(cli_path.to_string_lossy().to_string());
        }

        // Check for bundled CLI
        if let Some(bundled) = self.find_bundled_cli() {
            return Ok(bundled);
        }

        // Fall back to system-wide search via PATH
        if let Some(cli) = find_in_path("claude") {
            return Ok(cli);
        }

        // Check known locations
        let home = home_dir().unwrap_or_default();
        let locations = [
            home.join(".npm-global/bin/claude"),
            std::path::PathBuf::from("/usr/local/bin/claude"),
            home.join(".local/bin/claude"),
            home.join("node_modules/.bin/claude"),
            home.join(".yarn/bin/claude"),
            home.join(".claude/local/claude"),
        ];

        for path in &locations {
            if path.is_file() {
                return Ok(path.to_string_lossy().to_string());
            }
        }

        Err(ClaudeSDKError::cli_not_found(
            "Claude Code not found. Install with:\n  \
             npm install -g @anthropic-ai/claude-code\n\n\
             If already installed locally, try:\n  \
             export PATH=\"$HOME/node_modules/.bin:$PATH\"\n\n\
             Or provide the path via ClaudeAgentOptions:\n  \
             ClaudeAgentOptions { cli_path: Some(\"/path/to/claude\".into()), .. }",
        ))
    }

    pub fn find_bundled_cli(&self) -> Option<String> {
        // Look for bundled CLI relative to the executable, matching Python's
        // Path(__file__).parent.parent.parent / "_bundled" / cli_name
        let cli_name = if cfg!(windows) {
            "claude.exe"
        } else {
            "claude"
        };

        if let Ok(exe) = std::env::current_exe() {
            // Try a few common relative layouts
            for ancestor in exe.ancestors().skip(1).take(5) {
                let candidate = ancestor.join("_bundled").join(cli_name);
                if candidate.is_file() {
                    return Some(candidate.to_string_lossy().to_string());
                }
            }
        }

        None
    }

    pub fn build_settings_value(&self) -> Option<String> {
        let has_settings = self.options.settings.is_some();
        let has_sandbox = self.options.sandbox.is_some();

        if !has_settings && !has_sandbox {
            return None;
        }

        // If only settings path and no sandbox, pass through as-is
        if has_settings && !has_sandbox {
            return self.options.settings.clone();
        }

        // If we have sandbox settings, we need to merge into a JSON object
        let mut settings_obj: serde_json::Map<String, serde_json::Value> = serde_json::Map::new();

        if let Some(ref settings_str) = self.options.settings {
            let trimmed = settings_str.trim();
            if trimmed.starts_with('{') && trimmed.ends_with('}') {
                // Try parsing as JSON
                if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(trimmed) {
                    if let Some(obj) = parsed.as_object() {
                        settings_obj = obj.clone();
                    }
                }
                // If parsing fails, treat as file path — read it
                // (omitted for now: file reading in build_settings_value is rare)
            } else {
                // It's a file path — try to read and parse
                if let Ok(contents) = std::fs::read_to_string(trimmed) {
                    if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(&contents) {
                        if let Some(obj) = parsed.as_object() {
                            settings_obj = obj.clone();
                        }
                    }
                }
            }
        }

        // Merge sandbox settings
        if let Some(ref sandbox) = self.options.sandbox {
            settings_obj.insert("sandbox".into(), serde_json::to_value(sandbox).unwrap());
        }

        Some(serde_json::to_string(&serde_json::Value::Object(settings_obj)).unwrap())
    }

    /// Check Claude Code version and warn if below minimum (#14).
    async fn check_claude_version(&self) {
        let cli_path = match &self.options.cli_path {
            Some(p) => p.to_string_lossy().to_string(),
            None => return,
        };
        let result = tokio::time::timeout(
            std::time::Duration::from_secs(2),
            tokio::process::Command::new(&cli_path)
                .arg("-v")
                .stdout(std::process::Stdio::piped())
                .stderr(std::process::Stdio::null())
                .output(),
        )
        .await;

        if let Ok(Ok(output)) = result {
            let version_str = String::from_utf8_lossy(&output.stdout);
            let version_str = version_str.trim();
            // Parse X.Y.Z
            let parts: Vec<&str> = version_str.split('.').collect();
            if parts.len() >= 3 {
                let version: Vec<u32> = parts
                    .iter()
                    .filter_map(|p| {
                        p.chars()
                            .take_while(|c| c.is_ascii_digit())
                            .collect::<String>()
                            .parse()
                            .ok()
                    })
                    .collect();
                let min_parts: Vec<u32> = MINIMUM_CLAUDE_CODE_VERSION
                    .split('.')
                    .filter_map(|p| p.parse().ok())
                    .collect();
                if version.len() >= 3 && min_parts.len() >= 3 && version < min_parts {
                    eprintln!(
                        "Warning: Claude Code version {} at {} is unsupported in the Agent SDK. \
                         Minimum required version is {}. Some features may not work correctly.",
                        version_str, cli_path, MINIMUM_CLAUDE_CODE_VERSION
                    );
                }
            }
        }
    }
}

fn thinking_display_str(d: &ThinkingDisplay) -> &'static str {
    match d {
        ThinkingDisplay::Summarized => "summarized",
        ThinkingDisplay::Omitted => "omitted",
    }
}

fn home_dir() -> Option<std::path::PathBuf> {
    std::env::var_os("HOME")
        .or_else(|| std::env::var_os("USERPROFILE"))
        .map(std::path::PathBuf::from)
}

fn find_in_path(name: &str) -> Option<String> {
    let path_var = std::env::var_os("PATH")?;
    for dir in std::env::split_paths(&path_var) {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return Some(candidate.to_string_lossy().to_string());
        }
    }
    None
}

#[async_trait::async_trait]
impl Transport for SubprocessCLITransport {
    async fn connect(&mut self) -> Result<()> {
        // Resolve CLI path
        let cli_path = self.find_cli()?;
        self.options.cli_path = Some(std::path::PathBuf::from(&cli_path));

        // Version check (#14) — warn if below minimum
        if std::env::var("CLAUDE_AGENT_SDK_SKIP_VERSION_CHECK").is_err() {
            self.check_claude_version().await;
        }

        // Ensure atexit cleanup is registered (#15)
        ensure_atexit_registered();

        // Build command and spawn subprocess
        let cmd_args = self.build_command();
        if cmd_args.is_empty() {
            return Err(ClaudeSDKError::cli_not_found("Empty command"));
        }

        let program = &cmd_args[0];
        let args = &cmd_args[1..];

        let mut command = tokio::process::Command::new(program);
        command
            .args(args)
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped());

        // Pipe stderr only when the caller registered a callback (#13)
        if self.options.stderr.is_some() {
            command.stderr(std::process::Stdio::piped());
        } else {
            command.stderr(std::process::Stdio::null());
        }

        // Set working directory if specified
        if let Some(ref cwd) = self.options.cwd {
            command.current_dir(cwd);
        }

        // Build environment: strip CLAUDECODE (#17), set SDK env vars (#18)
        // Filter out CLAUDECODE so SDK-spawned subprocesses don't think
        // they're running inside a Claude Code parent.
        let inherited_env: HashMap<String, String> = std::env::vars()
            .filter(|(k, _)| k != "CLAUDECODE")
            .collect();
        // SDK-managed env vars
        command.env_clear();
        for (key, value) in &inherited_env {
            command.env(key, value);
        }
        command.env("CLAUDE_CODE_ENTRYPOINT", "sdk-rs");
        command.env("CLAUDE_AGENT_SDK_VERSION", SDK_VERSION);

        // User-provided env vars (can override)
        for (key, value) in &self.options.env {
            command.env(key, value);
        }

        // Enable file checkpointing env passthrough (#19)
        if self.options.enable_file_checkpointing {
            command.env("CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING", "true");
        }

        // Set PWD for working directory
        if let Some(ref cwd) = self.options.cwd {
            command.env("PWD", cwd);
        }

        // User option passthrough (#20) — set via uid on unix
        #[cfg(unix)]
        if let Some(ref user) = self.options.user {
            if let Ok(uid) = user.parse::<u32>() {
                use std::os::unix::process::CommandExt;
                command.uid(uid);
            }
        }

        let mut child = command.spawn().map_err(|e| {
            ClaudeSDKError::cli_connection(format!("Failed to spawn CLI process: {}", e))
        })?;

        // Track child for atexit cleanup (#15)
        if let Some(pid) = child.id() {
            register_child(pid);
        }

        // Start stderr handler (#13)
        if let Some(stderr) = child.stderr.take() {
            let stderr_callback = self.options.stderr.clone();
            self.stderr_task = Some(tokio::spawn(async move {
                use tokio::io::AsyncBufReadExt;
                let mut reader = tokio::io::BufReader::new(stderr);
                let mut line = String::new();
                loop {
                    line.clear();
                    match reader.read_line(&mut line).await {
                        Ok(0) => break,
                        Ok(_) => {
                            let trimmed = line.trim_end().to_string();
                            if !trimmed.is_empty() {
                                if let Some(ref cb) = stderr_callback {
                                    cb(trimmed);
                                }
                            }
                        }
                        Err(_) => break,
                    }
                }
            }));
        }

        // Take stdout for reading
        if let Some(stdout) = child.stdout.take() {
            self.stdout_reader = Some(tokio::io::BufReader::new(stdout));
        }

        self.child = Some(child);
        self.connected = true;
        Ok(())
    }

    async fn close(&mut self) -> Result<()> {
        // Cancel stderr reader
        if let Some(task) = self.stderr_task.take() {
            task.abort();
            let _ = task.await;
        }

        if let Some(ref mut child) = self.child {
            if let Some(pid) = child.id() {
                unregister_child(pid);
            }
            let _ = child.kill().await;
            let _ = child.wait().await;
        }
        self.child = None;
        self.connected = false;
        Ok(())
    }

    async fn write(&mut self, data: &str) -> Result<()> {
        use tokio::io::AsyncWriteExt;
        let _guard = self.write_lock.lock().await;
        if !self.connected {
            return Err(ClaudeSDKError::cli_connection(
                "Transport is not ready for writing",
            ));
        }
        if let Some(ref mut child) = self.child {
            if let Some(ref mut stdin) = child.stdin {
                stdin
                    .write_all(data.as_bytes())
                    .await
                    .map_err(|e| ClaudeSDKError::cli_connection(format!("Write failed: {}", e)))?;
                stdin
                    .flush()
                    .await
                    .map_err(|e| ClaudeSDKError::cli_connection(format!("Flush failed: {}", e)))?;
            }
        }
        Ok(())
    }

    async fn end_input(&mut self) -> Result<()> {
        let _guard = self.write_lock.lock().await;
        if let Some(ref mut child) = self.child {
            // Drop stdin to signal EOF
            child.stdin.take();
        }
        Ok(())
    }

    fn is_ready(&self) -> bool {
        self.connected
    }

    async fn read_message(&mut self) -> Result<Option<serde_json::Value>> {
        use tokio::io::AsyncBufReadExt;

        let max_buffer_size = self
            .options
            .max_buffer_size
            .unwrap_or(DEFAULT_MAX_BUFFER_SIZE);

        let reader = match &mut self.stdout_reader {
            Some(r) => r,
            None => return Ok(None),
        };

        loop {
            let mut line = String::new();
            let bytes_read = reader.read_line(&mut line).await.map_err(|e| {
                ClaudeSDKError::cli_connection(format!("Failed to read from stdout: {}", e))
            })?;

            if bytes_read == 0 {
                // EOF — try to parse any remaining buffer
                if !self.json_buffer.is_empty() {
                    let buf = std::mem::take(&mut self.json_buffer);
                    match serde_json::from_str::<serde_json::Value>(&buf) {
                        Ok(val) => return Ok(Some(val)),
                        Err(_) => return Ok(None),
                    }
                }
                return Ok(None);
            }

            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }

            // If buffer is empty, try to parse the line directly
            if self.json_buffer.is_empty() {
                // Skip non-JSON lines (e.g. [SandboxDebug] lines)
                if !trimmed.starts_with('{') && !trimmed.starts_with('[') {
                    continue;
                }

                match serde_json::from_str::<serde_json::Value>(trimmed) {
                    Ok(val) => return Ok(Some(val)),
                    Err(_) => {
                        // Incomplete JSON — start buffering
                        self.json_buffer.push_str(trimmed);
                    }
                }
            } else {
                // Append to buffer
                self.json_buffer.push_str(trimmed);

                // Check buffer size
                if self.json_buffer.len() > max_buffer_size {
                    let _buf = std::mem::take(&mut self.json_buffer);
                    return Err(ClaudeSDKError::sdk(format!(
                        "JSON buffer exceeded maximum buffer size of {} bytes",
                        max_buffer_size
                    )));
                }

                // Try to parse the accumulated buffer
                match serde_json::from_str::<serde_json::Value>(&self.json_buffer) {
                    Ok(val) => {
                        self.json_buffer.clear();
                        return Ok(Some(val));
                    }
                    Err(_) => {
                        // Still incomplete — keep buffering
                    }
                }
            }
        }
    }
}
