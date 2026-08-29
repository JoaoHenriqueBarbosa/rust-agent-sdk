pub mod client;
pub mod errors;
pub mod internal;
pub mod query;
pub mod sdk_mcp;
pub mod types;

/// Optional session-store backends, each gated behind a Cargo feature.
#[cfg(any(feature = "postgres", feature = "redis-store"))]
pub mod stores;

// Re-exports for convenience
pub use client::ClaudeSDKClient;
pub use errors::ClaudeSDKError;
pub use internal::message_parser::parse_message;
pub use internal::session_import::import_session_to_store;
pub use internal::session_mutations::{
    delete_session, delete_session_via_store, fork_session, fork_session_via_store, rename_session,
    rename_session_via_store, tag_session, tag_session_via_store,
};
pub use internal::session_store::InMemorySessionStore;
pub use internal::session_summary::{fold_session_summary, summary_entry_to_sdk_info};
pub use internal::sessions::{
    get_projects_dir, get_session_info, get_session_info_from_store, get_session_messages,
    get_session_messages_from_store, get_subagent_messages, get_subagent_messages_from_store,
    list_sessions, list_sessions_from_store, list_subagents, list_subagents_from_store,
    project_key_for_directory,
};
pub use internal::task::{spawn_detached, TaskHandle};
pub use internal::transport::{SubprocessCLITransport, Transport};
pub use query::{query, query_collect};
pub use sdk_mcp::{
    PropertyKind, PropertySchema, SdkMcpRegistry, SdkMcpServer, SdkMcpServerBuilder, SdkTool,
    ToolContent, ToolError, ToolInputSchema, ToolOutput,
};
pub use types::*;

#[cfg(feature = "postgres")]
pub use stores::postgres::PostgresSessionStore;
#[cfg(feature = "redis-store")]
pub use stores::redis::RedisSessionStore;

// Transporte nativo da API Anthropic (sem subprocess do CLI) e suas peças.
pub mod agentic;
pub mod api;
pub mod compact;
pub mod mcp;
pub mod messages;
pub mod session;
pub mod tools;
pub mod native;
pub use native::NativeApiTransport;
