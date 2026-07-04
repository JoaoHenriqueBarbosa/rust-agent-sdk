use crate::errors::{ClaudeSDKError, Result};
use crate::types::ClaudeAgentOptions;

/// Pre-flight validation for session_store option combinations.
///
/// Called before subprocess spawn so misconfiguration fails fast instead of
/// surfacing as a confusing runtime error mid-session.
pub fn validate_session_store_options(options: &ClaudeAgentOptions) -> Result<()> {
    if options.session_store.is_none() {
        return Ok(());
    }

    if options.enable_file_checkpointing {
        return Err(ClaudeSDKError::sdk(
            "session_store cannot be combined with enable_file_checkpointing \
             (checkpoints are local-disk only and would diverge from the \
             mirrored transcript)",
        ));
    }

    // continue_conversation + session_store requires list_sessions().
    // When resume is explicitly set, list_sessions() is never called
    // (resume wins over continue), so a minimal store is fine.
    if options.continue_conversation && options.resume.is_none() {
        if let Some(ref store) = options.session_store {
            if !store.has_list_sessions() {
                return Err(ClaudeSDKError::sdk(
                    "continue_conversation with session_store requires the store to \
                     implement list_sessions()",
                ));
            }
        }
    }

    Ok(())
}
