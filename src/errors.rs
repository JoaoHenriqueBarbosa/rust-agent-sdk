/// Base error type for all Claude SDK errors.
#[derive(Debug, thiserror::Error)]
pub enum ClaudeSDKError {
    #[error("{0}")]
    Sdk(String),

    #[error("{0}")]
    CliNotFound(String),

    #[error("{0}")]
    CliConnection(String),

    #[error("{}", format_process_error(.message, .exit_code, .stderr))]
    Process {
        message: String,
        exit_code: Option<i32>,
        stderr: Option<String>,
    },

    #[error("Failed to decode JSON: {}...", &.line[..std::cmp::min(.line.len(), 100)])]
    JsonDecode {
        line: String,
        #[source]
        source: serde_json::Error,
    },

    #[error("{message}")]
    MessageParse {
        message: String,
        data: Option<serde_json::Value>,
    },

    #[error("Model overloaded after {consecutive_529s} consecutive 529 errors — fallback available")]
    OverloadedFallback {
        consecutive_529s: u32,
    },
}

fn format_process_error(message: &str, exit_code: &Option<i32>, stderr: &Option<String>) -> String {
    let mut msg = message.to_string();
    if let Some(code) = exit_code {
        msg = format!("{msg} (exit code: {code})");
    }
    if let Some(err) = stderr {
        msg = format!("{msg}\nError output: {err}");
    }
    msg
}

impl ClaudeSDKError {
    pub fn sdk(message: impl Into<String>) -> Self {
        Self::Sdk(message.into())
    }

    pub fn cli_not_found(message: impl Into<String>) -> Self {
        Self::CliNotFound(message.into())
    }

    pub fn cli_connection(message: impl Into<String>) -> Self {
        Self::CliConnection(message.into())
    }

    pub fn process(
        message: impl Into<String>,
        exit_code: Option<i32>,
        stderr: Option<String>,
    ) -> Self {
        Self::Process {
            message: message.into(),
            exit_code,
            stderr,
        }
    }

    pub fn json_decode(line: impl Into<String>, source: serde_json::Error) -> Self {
        Self::JsonDecode {
            line: line.into(),
            source,
        }
    }

    pub fn message_parse(
        message: impl Into<String>,
        data: Option<serde_json::Value>,
    ) -> Self {
        Self::MessageParse {
            message: message.into(),
            data,
        }
    }

    pub fn overloaded_fallback(consecutive_529s: u32) -> Self {
        Self::OverloadedFallback { consecutive_529s }
    }
}

/// Convenience alias
pub type Result<T> = std::result::Result<T, ClaudeSDKError>;
