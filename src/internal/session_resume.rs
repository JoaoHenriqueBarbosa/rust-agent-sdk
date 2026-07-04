use std::collections::HashMap;
use std::path::{Path, PathBuf};

use crate::errors::{ClaudeSDKError, Result};
use crate::internal::sessions::{get_projects_dir, project_key_for_directory, validate_uuid};
use crate::internal::transcript_mirror::{OnErrorCallback, TranscriptMirrorBatcher};
use crate::types::{ClaudeAgentOptions, SessionKey, SessionStore, SessionStoreFlushMode};

/// Result of materializing a resume session.
#[derive(Debug)]
pub struct MaterializedResume {
    pub config_dir: PathBuf,
    pub resume_session_id: String,
}

impl MaterializedResume {
    pub async fn cleanup(&self) -> Result<()> {
        rmtree_with_retry(&self.config_dir).await;
        Ok(())
    }
}

/// Apply materialized resume options to ClaudeAgentOptions.
///
/// Sets CLAUDE_CONFIG_DIR in env, resume to the materialized session id,
/// and clears continue_conversation.
pub fn apply_materialized_options(
    mut options: ClaudeAgentOptions,
    materialized: &MaterializedResume,
) -> ClaudeAgentOptions {
    options.env.insert(
        "CLAUDE_CONFIG_DIR".to_string(),
        materialized.config_dir.to_string_lossy().to_string(),
    );
    options.resume = Some(materialized.resume_session_id.clone());
    options.continue_conversation = false;
    options
}

/// Build a TranscriptMirrorBatcher for mirroring to a SessionStore.
pub fn build_mirror_batcher(
    store: Box<dyn SessionStore>,
    materialized: Option<&MaterializedResume>,
    env: Option<&HashMap<String, String>>,
    on_error: OnErrorCallback,
    flush_mode: SessionStoreFlushMode,
) -> TranscriptMirrorBatcher {
    let projects_dir = if let Some(m) = materialized {
        m.config_dir.join("projects").to_string_lossy().to_string()
    } else {
        get_projects_dir(env).to_string_lossy().to_string()
    };

    let eager = flush_mode == SessionStoreFlushMode::Eager;

    if eager {
        TranscriptMirrorBatcher::with_thresholds(store, &projects_dir, on_error, 0, 0)
    } else {
        TranscriptMirrorBatcher::new(store, &projects_dir, on_error)
    }
}

/// Materialize a resume session from a SessionStore to a temporary config dir.
pub async fn materialize_resume_session(
    options: &ClaudeAgentOptions,
) -> Result<Option<MaterializedResume>> {
    let store = match &options.session_store {
        Some(s) => s,
        None => return Ok(None),
    };
    if options.resume.is_none() && !options.continue_conversation {
        return Ok(None);
    }

    let timeout_s = options.load_timeout_ms as f64 / 1000.0;
    let project_key =
        project_key_for_directory(options.cwd.as_ref().map(|p| p.to_str().unwrap_or("")))?;

    let resolved = if let Some(resume_id) = &options.resume {
        if validate_uuid(resume_id).is_none() {
            return Ok(None);
        }
        load_candidate(store.as_ref(), &project_key, resume_id, timeout_s).await?
    } else {
        resolve_continue_candidate(store.as_ref(), &project_key, timeout_s).await?
    };

    let (session_id, entries) = match resolved {
        Some(r) => r,
        None => return Ok(None),
    };

    let tmp_dir = tempfile::tempdir()
        .map_err(|e| ClaudeSDKError::sdk(format!("Failed to create temp dir: {e}")))?;
    let tmp_base = tmp_dir.path().to_path_buf();
    // Keep the temp dir alive (don't let TempDir drop clean it up)
    std::mem::forget(tmp_dir);

    let result = materialize_inner(
        store.as_ref(),
        &tmp_base,
        &project_key,
        &session_id,
        &entries,
        timeout_s,
        options,
    )
    .await;

    if let Err(e) = result {
        rmtree_with_retry(&tmp_base).await;
        return Err(e);
    }

    Ok(Some(MaterializedResume {
        config_dir: tmp_base,
        resume_session_id: session_id,
    }))
}

async fn materialize_inner(
    store: &dyn SessionStore,
    tmp_base: &Path,
    project_key: &str,
    session_id: &str,
    entries: &[serde_json::Value],
    timeout_s: f64,
    options: &ClaudeAgentOptions,
) -> Result<()> {
    let project_dir = tmp_base.join("projects").join(project_key);
    std::fs::create_dir_all(&project_dir)
        .map_err(|e| ClaudeSDKError::sdk(format!("mkdir failed: {e}")))?;

    write_jsonl(&project_dir.join(format!("{session_id}.jsonl")), entries)?;

    copy_auth_files(tmp_base, &options.env);

    // Materialize subagent transcripts (only if the store implements list_subkeys)
    if store.has_list_subkeys() {
        let key = crate::types::SessionListSubkeysKey {
            project_key: project_key.to_string(),
            session_id: session_id.to_string(),
        };
        let subkeys = with_timeout(
            store.list_subkeys(&key),
            timeout_s,
            &format!("SessionStore.list_subkeys() for session {session_id}"),
        )
        .await?;
        {
            let session_dir = project_dir.join(session_id);
            for subpath in subkeys {
                if !is_safe_subpath(&subpath, &session_dir) {
                    continue;
                }
                let sub_key = SessionKey {
                    project_key: project_key.to_string(),
                    session_id: session_id.to_string(),
                    subpath: Some(subpath.clone()),
                };
                let sub_entries = match with_timeout(
                    store.load(&sub_key),
                    timeout_s,
                    &format!("SessionStore.load() for session {session_id} subpath {subpath}"),
                )
                .await
                {
                    Ok(Some(e)) => e,
                    _ => continue,
                };
                if sub_entries.is_empty() {
                    continue;
                }

                let mut metadata = Vec::new();
                let mut transcript = Vec::new();
                for e in &sub_entries {
                    if e.get("type").and_then(|v| v.as_str()) == Some("agent_metadata") {
                        metadata.push(e.clone());
                    } else {
                        transcript.push(e.clone());
                    }
                }

                let sub_target = session_dir.join(&subpath);
                let sub_file = sub_target.with_file_name(format!(
                    "{}.jsonl",
                    sub_target.file_name().unwrap_or_default().to_string_lossy()
                ));

                if !transcript.is_empty() {
                    write_jsonl(&sub_file, &transcript)?;
                }

                if !metadata.is_empty() {
                    let last = metadata.last().unwrap();
                    let meta_content: serde_json::Map<String, serde_json::Value> = last
                        .as_object()
                        .map(|obj| {
                            obj.iter()
                                .filter(|(k, _)| k.as_str() != "type")
                                .map(|(k, v)| (k.clone(), v.clone()))
                                .collect()
                        })
                        .unwrap_or_default();
                    let meta_file_name = format!(
                        "{}.meta.json",
                        sub_file.file_stem().unwrap_or_default().to_string_lossy()
                    );
                    let meta_file = sub_file.with_file_name(meta_file_name);
                    if let Some(parent) = meta_file.parent() {
                        let _ = std::fs::create_dir_all(parent);
                    }
                    let _ = std::fs::write(
                        &meta_file,
                        serde_json::to_string(&meta_content).unwrap_or_default(),
                    );
                }
            }
        }
    } // has_list_subkeys

    Ok(())
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async fn rmtree_with_retry(path: &Path) {
    if !path.exists() {
        return;
    }
    for _ in 0..4 {
        match std::fs::remove_dir_all(path) {
            Ok(()) => return,
            Err(_) => {
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
            }
        }
    }
    let _ = std::fs::remove_dir_all(path);
}

async fn load_candidate(
    store: &dyn SessionStore,
    project_key: &str,
    session_id: &str,
    timeout_s: f64,
) -> Result<Option<(String, Vec<serde_json::Value>)>> {
    let key = SessionKey::new(project_key, session_id);
    let entries = with_timeout(
        store.load(&key),
        timeout_s,
        &format!("SessionStore.load() for session {session_id}"),
    )
    .await?;
    match entries {
        Some(e) if !e.is_empty() => Ok(Some((session_id.to_string(), e))),
        _ => Ok(None),
    }
}

async fn resolve_continue_candidate(
    store: &dyn SessionStore,
    project_key: &str,
    timeout_s: f64,
) -> Result<Option<(String, Vec<serde_json::Value>)>> {
    let mut sessions = with_timeout(
        store.list_sessions(project_key),
        timeout_s,
        "SessionStore.list_sessions()",
    )
    .await?;
    if sessions.is_empty() {
        return Ok(None);
    }
    // Sort by mtime descending; tie-break by session_id ascending for
    // deterministic results when mtimes are equal (Rust HashMap iteration
    // order is arbitrary, unlike Python dict which preserves insertion order).
    sessions.sort_by(|a, b| {
        b.mtime
            .cmp(&a.mtime)
            .then_with(|| a.session_id.cmp(&b.session_id))
    });

    for cand in sessions {
        if validate_uuid(&cand.session_id).is_none() {
            continue;
        }
        let loaded = load_candidate(store, project_key, &cand.session_id, timeout_s).await?;
        if let Some((sid, entries)) = loaded {
            let first = &entries[0];
            if first.get("isSidechain").and_then(|v| v.as_bool()) == Some(true) {
                continue;
            }
            return Ok(Some((sid, entries)));
        }
    }
    Ok(None)
}

async fn with_timeout<T>(
    future: impl std::future::Future<Output = std::result::Result<T, ClaudeSDKError>>,
    timeout_s: f64,
    what: &str,
) -> Result<T> {
    match tokio::time::timeout(std::time::Duration::from_secs_f64(timeout_s), future).await {
        Ok(Ok(val)) => Ok(val),
        Ok(Err(e)) => Err(ClaudeSDKError::sdk(format!(
            "{what} failed during resume materialization: {e}"
        ))),
        Err(_) => Err(ClaudeSDKError::sdk(format!(
            "{what} timed out after {}ms during resume materialization",
            (timeout_s * 1000.0) as i64
        ))),
    }
}

fn write_jsonl(path: &Path, entries: &[serde_json::Value]) -> Result<()> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| ClaudeSDKError::sdk(format!("mkdir failed: {e}")))?;
    }
    use std::io::Write;
    let file = std::fs::File::create(path)
        .map_err(|e| ClaudeSDKError::sdk(format!("create file failed: {e}")))?;
    let mut writer = std::io::BufWriter::new(file);
    for e in entries {
        let line = serde_json::to_string(e).unwrap_or_default();
        writeln!(writer, "{}", line)
            .map_err(|e| ClaudeSDKError::sdk(format!("write failed: {e}")))?;
    }
    // Best-effort chmod 0o600
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o600));
    }
    Ok(())
}

fn copy_auth_files(tmp_base: &Path, env: &HashMap<String, String>) {
    let caller_config_dir = env
        .get("CLAUDE_CONFIG_DIR")
        .cloned()
        .or_else(|| std::env::var("CLAUDE_CONFIG_DIR").ok());

    let source_config_dir = match &caller_config_dir {
        Some(d) if !d.is_empty() => PathBuf::from(d),
        _ => {
            let home = std::env::var("HOME")
                .or_else(|_| std::env::var("USERPROFILE"))
                .unwrap_or_default();
            PathBuf::from(home).join(".claude")
        }
    };

    // Copy .credentials.json with refreshToken redacted
    let creds_path = source_config_dir.join(".credentials.json");
    let creds_json = std::fs::read_to_string(&creds_path).ok();
    write_redacted_credentials(creds_json.as_deref(), &tmp_base.join(".credentials.json"));

    // Copy .claude.json
    let claude_json_src = match &caller_config_dir {
        Some(d) if !d.is_empty() => PathBuf::from(d).join(".claude.json"),
        _ => {
            let home = std::env::var("HOME")
                .or_else(|_| std::env::var("USERPROFILE"))
                .unwrap_or_default();
            PathBuf::from(home).join(".claude.json")
        }
    };
    let _ = std::fs::copy(&claude_json_src, tmp_base.join(".claude.json"));
}

fn write_redacted_credentials(creds_json: Option<&str>, dst: &Path) {
    let creds = match creds_json {
        Some(c) => c,
        None => return,
    };
    let out = match serde_json::from_str::<serde_json::Value>(creds) {
        Ok(mut data) => {
            if let Some(oauth) = data
                .get_mut("claudeAiOauth")
                .and_then(|v| v.as_object_mut())
            {
                oauth.remove("refreshToken");
            }
            serde_json::to_string(&data).unwrap_or_else(|_| creds.to_string())
        }
        Err(_) => creds.to_string(),
    };
    let _ = std::fs::write(dst, &out);
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = std::fs::set_permissions(dst, std::fs::Permissions::from_mode(0o600));
    }
}

fn is_safe_subpath(subpath: &str, session_dir: &Path) -> bool {
    if subpath.is_empty() {
        return false;
    }
    if subpath.starts_with('/') || subpath.starts_with('\\') {
        return false;
    }
    // Reject drive-prefixed paths (C:foo)
    if subpath.len() >= 2
        && subpath.as_bytes()[1] == b':'
        && subpath.as_bytes()[0].is_ascii_alphabetic()
    {
        return false;
    }
    // Reject . and .. components
    for part in subpath.split(&['/', '\\']) {
        if part == "." || part == ".." {
            return false;
        }
    }
    if subpath.contains('\0') {
        return false;
    }
    // Verify resolved path stays under session_dir
    let target = session_dir.join(subpath);
    let sub_file_name = format!(
        "{}.jsonl",
        target.file_name().unwrap_or_default().to_string_lossy()
    );
    let sub_file = target.with_file_name(sub_file_name);
    match (
        sub_file
            .canonicalize()
            .or_else(|_| Ok::<_, std::io::Error>(sub_file.clone())),
        session_dir
            .canonicalize()
            .or_else(|_| Ok::<_, std::io::Error>(session_dir.to_path_buf())),
    ) {
        (Ok(resolved), Ok(base)) => resolved.starts_with(&base),
        _ => false,
    }
}
