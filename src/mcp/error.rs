//! Erros do cliente MCP, com estrutura suficiente para o cliente DECIDIR em
//! vez de só relatar: sessão expirada se reconecta e repete uma vez, 401 vira
//! pedido de reautorização, o resto sobe.
//!
//! A classificação copia `isMcpSessionExpiredError` e o trecho de
//! `callMCPTool` do CLI: 404 cujo corpo traz `"code":-32001`, ou
//! `-32000 Connection closed` num transporte HTTP.

use std::fmt;
use std::time::Duration;

use crate::errors::ClaudeSDKError;

/// Código JSON-RPC que o servidor usa para "sessão não encontrada".
pub const SESSION_NOT_FOUND: i64 = -32001;

/// Código JSON-RPC de conexão fechada.
pub const CONNECTION_CLOSED: i64 = -32000;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum McpError {
    /// O servidor respondeu com status HTTP fora de 2xx; `body` é o texto
    /// que ele mandou, que é onde o `-32001` de sessão expirada aparece.
    Http { status: u16, body: String },
    /// O servidor respondeu um erro JSON-RPC.
    Rpc { code: i64, message: String },
    /// A operação passou do prazo.
    Timeout { what: String, after: Duration },
    /// A conexão fechou antes da resposta chegar.
    Closed(String),
    /// Falha de transporte: rede, parse, protocolo.
    Transport(String),
    /// A ferramenta executou e devolveu `isError: true` com este texto.
    ToolFailed(String),
}

impl McpError {
    /// Sessão expirada no servidor: o remédio é reconectar e repetir.
    pub fn is_session_expired(&self) -> bool {
        match self {
            Self::Http { status: 404, body } => {
                body.contains("\"code\":-32001") || body.contains("\"code\": -32001")
            }
            Self::Rpc { code, message } => {
                *code == CONNECTION_CLOSED && message.contains("Connection closed")
            }
            Self::Closed(_) => true,
            _ => false,
        }
    }

    /// 401: o token expirou ou nunca serviu.
    pub fn is_unauthorized(&self) -> bool {
        matches!(self, Self::Http { status: 401, .. })
    }

    pub(crate) fn transport(error: impl fmt::Display) -> Self {
        Self::Transport(error.to_string())
    }
}

impl fmt::Display for McpError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Http { status, body } => write!(f, "HTTP {status}: {body}"),
            Self::Rpc { code, message } => write!(f, "MCP error ({code}): {message}"),
            Self::Timeout { what, after } => {
                write!(f, "{what} timed out after {}s", after.as_secs())
            }
            Self::Closed(reason) => write!(f, "MCP connection closed: {reason}"),
            Self::Transport(reason) => write!(f, "MCP transport: {reason}"),
            Self::ToolFailed(reason) => write!(f, "{reason}"),
        }
    }
}

impl std::error::Error for McpError {}

impl From<McpError> for ClaudeSDKError {
    fn from(error: McpError) -> Self {
        ClaudeSDKError::sdk(error.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_404_with_the_session_code_is_an_expired_session() {
        let expired = McpError::Http {
            status: 404,
            body: r#"{"jsonrpc":"2.0","error":{"code":-32001,"message":"Session not found"}}"#
                .to_string(),
        };
        assert!(expired.is_session_expired());
        let spaced = McpError::Http {
            status: 404,
            body: r#"{"error": {"code": -32001}}"#.to_string(),
        };
        assert!(spaced.is_session_expired());
        let plain_404 = McpError::Http {
            status: 404,
            body: "not found".to_string(),
        };
        assert!(!plain_404.is_session_expired());
        let other_status = McpError::Http {
            status: 500,
            body: r#"{"code":-32001}"#.to_string(),
        };
        assert!(!other_status.is_session_expired());
    }

    #[test]
    fn a_closed_connection_is_recoverable_and_a_tool_failure_is_not() {
        assert!(McpError::Closed("eof".to_string()).is_session_expired());
        assert!(McpError::Rpc {
            code: CONNECTION_CLOSED,
            message: "Connection closed".to_string()
        }
        .is_session_expired());
        assert!(!McpError::ToolFailed("x".to_string()).is_session_expired());
        assert!(McpError::Http {
            status: 401,
            body: String::new()
        }
        .is_unauthorized());
    }
}
