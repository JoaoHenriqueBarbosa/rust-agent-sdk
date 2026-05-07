pub mod errors;
pub mod types;
pub mod internal;
pub mod query;
pub mod client;

// New modules — native API transport (no CLI subprocess needed)
pub mod api;
pub mod tools;
pub mod compact;
pub mod messages;
pub mod agentic;

// Re-exports for convenience
pub use errors::ClaudeSDKError;
pub use types::*;
pub use client::ClaudeSDKClient;
pub use query::{query, query_collect};
pub use internal::message_parser::parse_message;
pub use internal::session_store::InMemorySessionStore;
pub use internal::sessions::{
    list_sessions, get_session_info, get_session_messages,
    list_subagents, get_subagent_messages,
    list_sessions_from_store, get_session_info_from_store,
    get_session_messages_from_store, list_subagents_from_store,
    get_subagent_messages_from_store, project_key_for_directory,
};
pub use internal::session_mutations::{
    rename_session, tag_session, delete_session, fork_session,
    rename_session_via_store, tag_session_via_store,
    delete_session_via_store, fork_session_via_store,
};
pub use internal::session_summary::{fold_session_summary, summary_entry_to_sdk_info};
pub use internal::session_import::import_session_to_store;
pub use internal::transport::{Transport, SubprocessCLITransport};
pub use internal::task::{spawn_detached, TaskHandle};
