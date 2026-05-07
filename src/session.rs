// Session persistence — JSONL file storage for conversation continuity.
// Uses the same format and paths as the TS claude-code so sessions are
// interchangeable between the CLI and this SDK.
//
// Path: ~/.claude/projects/{project_key}/{session_id}.jsonl
// Each line is a JSON entry with type, uuid, parentUuid, sessionId, etc.

use std::path::PathBuf;

use tokio::io::AsyncWriteExt;

use crate::api::types::{ApiMessage, ContentBlock, Role};
use crate::errors::{ClaudeSDKError, Result};
use crate::internal::sessions::{get_projects_dir, project_key_for_directory};

/// Manages session persistence to JSONL files, compatible with the
/// Claude Code CLI transcript format.
#[derive(Debug, Clone)]
pub struct SessionStorage {
    project_dir: PathBuf,
}

impl SessionStorage {
    /// Create session storage for a given working directory.
    /// Uses the same path scheme as the CLI: ~/.claude/projects/{project_key}/
    pub async fn for_cwd(cwd: &str) -> Result<Self> {
        let project_key = project_key_for_directory(Some(cwd))?;
        let projects_dir = get_projects_dir(None);
        let project_dir = projects_dir.join(&project_key);
        tokio::fs::create_dir_all(&project_dir).await.map_err(|e| {
            ClaudeSDKError::sdk(format!(
                "Failed to create session directory {}: {e}",
                project_dir.display()
            ))
        })?;
        Ok(Self { project_dir })
    }

    fn session_path(&self, session_id: &str) -> PathBuf {
        self.project_dir.join(format!("{session_id}.jsonl"))
    }

    /// Load messages from a session JSONL file and convert to ApiMessages
    /// for use as initial_messages in the agentic loop.
    pub async fn load(&self, session_id: &str) -> Result<Vec<ApiMessage>> {
        let path = self.session_path(session_id);
        if !path.exists() {
            return Ok(Vec::new());
        }

        let content = tokio::fs::read_to_string(&path).await.map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to read session {session_id}: {e}"))
        })?;

        let mut messages = Vec::new();
        for line in content.lines() {
            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }
            let entry: serde_json::Value = match serde_json::from_str(trimmed) {
                Ok(v) => v,
                Err(_) => continue,
            };

            // Convert transcript entries to ApiMessages
            let entry_type = entry.get("type").and_then(|t| t.as_str()).unwrap_or("");
            match entry_type {
                "user" => {
                    if let Some(msg) = entry.get("message") {
                        if let Some(content) = msg.get("content") {
                            let api_content = json_content_to_blocks(content);
                            if !api_content.is_empty() {
                                messages.push(ApiMessage::user(api_content));
                            }
                        }
                    }
                }
                "assistant" => {
                    if let Some(msg) = entry.get("message") {
                        if let Some(content) = msg.get("content") {
                            let api_content = json_content_to_blocks(content);
                            if !api_content.is_empty() {
                                messages.push(ApiMessage::assistant(api_content));
                            }
                        }
                    }
                }
                _ => continue,
            }
        }

        Ok(messages)
    }

    /// Append an assistant message to the session JSONL file in the
    /// Claude Code transcript format.
    /// Returns the uuid of the written entry so the caller can chain parentUuid.
    pub async fn append_assistant(
        &self,
        session_id: &str,
        content: &[ContentBlock],
        model: &str,
        stop_reason: Option<&str>,
        parent_uuid: Option<&str>,
        cwd: &str,
    ) -> Result<String> {
        let uuid = uuid::Uuid::new_v4().to_string();
        let timestamp = chrono::Utc::now().to_rfc3339();
        let entry = serde_json::json!({
            "type": "assistant",
            "uuid": uuid,
            "parentUuid": parent_uuid,
            "sessionId": session_id,
            "timestamp": timestamp,
            "cwd": cwd,
            "version": "0.1.0",
            "entrypoint": "sdk",
            "userType": "external",
            "message": {
                "id": uuid::Uuid::new_v4().to_string(),
                "role": "assistant",
                "model": model,
                "content": content,
                "stop_reason": stop_reason,
                "type": "message",
            }
        });
        self.append_entry(session_id, &entry).await?;
        Ok(uuid)
    }

    /// Append a user message to the session JSONL file.
    /// Returns the uuid of the written entry so the caller can chain parentUuid.
    pub async fn append_user(
        &self,
        session_id: &str,
        content: &[ContentBlock],
        parent_uuid: Option<&str>,
        cwd: &str,
    ) -> Result<String> {
        let uuid = uuid::Uuid::new_v4().to_string();
        let timestamp = chrono::Utc::now().to_rfc3339();
        let entry = serde_json::json!({
            "type": "user",
            "uuid": uuid,
            "parentUuid": parent_uuid,
            "sessionId": session_id,
            "timestamp": timestamp,
            "cwd": cwd,
            "version": "0.1.0",
            "entrypoint": "sdk",
            "userType": "external",
            "message": {
                "role": "user",
                "content": content,
            }
        });
        self.append_entry(session_id, &entry).await?;
        Ok(uuid)
    }

    /// Append a raw JSON entry to the session file.
    async fn append_entry(&self, session_id: &str, entry: &serde_json::Value) -> Result<()> {
        let path = self.session_path(session_id);
        let json = serde_json::to_string(entry).map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to serialize entry: {e}"))
        })?;

        let mut file = tokio::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&path)
            .await
            .map_err(|e| {
                ClaudeSDKError::sdk(format!("Failed to open session file: {e}"))
            })?;

        file.write_all(json.as_bytes()).await.map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to write to session file: {e}"))
        })?;
        file.write_all(b"\n").await.map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to write newline: {e}"))
        })?;

        Ok(())
    }

    /// Check if a session exists.
    pub fn exists(&self, session_id: &str) -> bool {
        self.session_path(session_id).exists()
    }
}

/// Convert JSON content (string or array of blocks) to Vec<ContentBlock>.
fn json_content_to_blocks(content: &serde_json::Value) -> Vec<ContentBlock> {
    if let Some(text) = content.as_str() {
        return vec![ContentBlock::text(text)];
    }

    if let Some(arr) = content.as_array() {
        let mut blocks = Vec::new();
        for item in arr {
            let block_type = item.get("type").and_then(|t| t.as_str()).unwrap_or("");
            match block_type {
                "text" => {
                    if let Some(text) = item.get("text").and_then(|t| t.as_str()) {
                        blocks.push(ContentBlock::text(text));
                    }
                }
                "tool_use" => {
                    let id = item.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string();
                    let name = item.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
                    let input = item.get("input").cloned().unwrap_or(serde_json::json!({}));
                    blocks.push(ContentBlock::ToolUse { id, name, input });
                }
                "tool_result" => {
                    let tool_use_id = item.get("tool_use_id").and_then(|v| v.as_str()).unwrap_or("").to_string();
                    let is_error = item.get("is_error").and_then(|v| v.as_bool());
                    let result_content = item.get("content").and_then(|c| {
                        if let Some(text) = c.as_str() {
                            Some(vec![crate::api::types::ToolResultContent::text(text)])
                        } else if let Some(arr) = c.as_array() {
                            let items: Vec<_> = arr.iter().filter_map(|i| {
                                if i.get("type")?.as_str()? == "text" {
                                    Some(crate::api::types::ToolResultContent::text(
                                        i.get("text")?.as_str()?,
                                    ))
                                } else {
                                    None
                                }
                            }).collect();
                            if items.is_empty() { None } else { Some(items) }
                        } else {
                            None
                        }
                    });
                    blocks.push(ContentBlock::ToolResult {
                        tool_use_id,
                        content: result_content,
                        is_error: is_error.map(|e| e),
                        cache_control: None,
                    });
                }
                "thinking" => {
                    if let Some(thinking) = item.get("thinking").and_then(|t| t.as_str()) {
                        let signature = item.get("signature").and_then(|s| s.as_str()).map(String::from);
                        blocks.push(ContentBlock::Thinking {
                            thinking: thinking.to_string(),
                            signature,
                        });
                    }
                }
                _ => {}
            }
        }
        return blocks;
    }

    Vec::new()
}
