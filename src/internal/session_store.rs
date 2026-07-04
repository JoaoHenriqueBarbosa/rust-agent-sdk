use std::collections::HashMap;
use std::sync::Mutex;

use crate::errors::ClaudeSDKError;
use crate::internal::session_summary::fold_session_summary;
use crate::types::{
    SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry, SessionStoreListEntry,
    SessionSummaryEntry,
};

/// In-memory reference implementation of SessionStore for testing.
pub struct InMemorySessionStore {
    data: Mutex<HashMap<String, Vec<SessionStoreEntry>>>,
    mtimes: Mutex<HashMap<String, i64>>,
    summaries: Mutex<HashMap<String, SessionSummaryEntry>>,
    mtime_counter: Mutex<i64>,
}

impl InMemorySessionStore {
    pub fn new() -> Self {
        Self {
            data: Mutex::new(HashMap::new()),
            mtimes: Mutex::new(HashMap::new()),
            summaries: Mutex::new(HashMap::new()),
            mtime_counter: Mutex::new(0),
        }
    }

    pub fn get_entries(&self, key: &SessionKey) -> Vec<SessionStoreEntry> {
        let data = self.data.lock().unwrap();
        data.get(&Self::key_to_string(key))
            .cloned()
            .unwrap_or_default()
    }

    pub fn size(&self) -> usize {
        let data = self.data.lock().unwrap();
        let mut count = 0;
        for k in data.keys() {
            if let Some(first_slash) = k.find('/') {
                if !k[first_slash + 1..].contains('/') {
                    count += 1;
                }
            }
        }
        count
    }

    pub fn clear(&self) {
        self.data.lock().unwrap().clear();
        self.mtimes.lock().unwrap().clear();
        self.summaries.lock().unwrap().clear();
        *self.mtime_counter.lock().unwrap() = 0;
    }

    /// Manually set the mtime for a `project_key/session_id` composite key.
    pub fn set_mtime(&self, composite_key: &str, mtime: i64) {
        self.mtimes
            .lock()
            .unwrap()
            .insert(composite_key.to_string(), mtime);
    }

    fn key_to_string(key: &SessionKey) -> String {
        match &key.subpath {
            Some(sub) => format!("{}/{}/{}", key.project_key, key.session_id, sub),
            None => format!("{}/{}", key.project_key, key.session_id),
        }
    }

    fn next_mtime(&self) -> i64 {
        let now_ms = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64;
        let mut last = self.mtime_counter.lock().unwrap();
        let mtime = if now_ms <= *last { *last + 1 } else { now_ms };
        *last = mtime;
        mtime
    }
}

impl Default for InMemorySessionStore {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait::async_trait]
impl SessionStore for InMemorySessionStore {
    async fn append(
        &self,
        key: &SessionKey,
        entries: &[SessionStoreEntry],
    ) -> Result<(), ClaudeSDKError> {
        let key_str = Self::key_to_string(key);
        let mut data = self.data.lock().unwrap();
        let existing = data.entry(key_str.clone()).or_default();
        existing.extend(entries.iter().cloned());
        let mtime = self.next_mtime();
        self.mtimes.lock().unwrap().insert(key_str, mtime);

        // Maintain summary sidecar for main keys (no subpath).
        if key.subpath.is_none() {
            let summary_key = format!("{}/{}", key.project_key, key.session_id);
            let mut summaries = self.summaries.lock().unwrap();
            let prev = summaries.get(&summary_key);
            let mut folded = fold_session_summary(prev, key, entries);
            folded.mtime = mtime;
            summaries.insert(summary_key, folded);
        }

        Ok(())
    }

    async fn load(
        &self,
        key: &SessionKey,
    ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
        let data = self.data.lock().unwrap();
        Ok(data.get(&Self::key_to_string(key)).cloned())
    }

    async fn list_sessions(
        &self,
        project_key: &str,
    ) -> Result<Vec<SessionStoreListEntry>, ClaudeSDKError> {
        let data = self.data.lock().unwrap();
        let mtimes = self.mtimes.lock().unwrap();
        let prefix = format!("{}/", project_key);
        let mut result = Vec::new();

        for key_str in data.keys() {
            if key_str.starts_with(&prefix) {
                let parts: Vec<&str> = key_str[prefix.len()..].splitn(2, '/').collect();
                if parts.len() == 1 {
                    // Main transcript (no subpath)
                    let session_id = parts[0].to_string();
                    let mtime = mtimes.get(key_str).copied().unwrap_or(0);
                    result.push(SessionStoreListEntry { session_id, mtime });
                }
            }
        }

        Ok(result)
    }

    async fn list_session_summaries(
        &self,
        project_key: &str,
    ) -> Result<Vec<SessionSummaryEntry>, ClaudeSDKError> {
        let summaries = self.summaries.lock().unwrap();
        let prefix = format!("{}/", project_key);
        Ok(summaries
            .iter()
            .filter(|(k, _)| k.starts_with(&prefix))
            .map(|(_, v)| v.clone())
            .collect())
    }

    async fn delete(&self, key: &SessionKey) -> Result<(), ClaudeSDKError> {
        let key_str = Self::key_to_string(key);
        let mut data = self.data.lock().unwrap();

        if key.subpath.is_none() {
            // Cascade: remove all subkeys
            let prefix = format!("{}/{}/", key.project_key, key.session_id);
            data.retain(|k, _| !k.starts_with(&prefix) && *k != key_str);
            // Drop summary sidecar
            let summary_key = format!("{}/{}", key.project_key, key.session_id);
            self.summaries.lock().unwrap().remove(&summary_key);
        } else {
            data.remove(&key_str);
        }

        self.mtimes.lock().unwrap().remove(&key_str);
        Ok(())
    }

    async fn list_subkeys(
        &self,
        key: &SessionListSubkeysKey,
    ) -> Result<Vec<String>, ClaudeSDKError> {
        let data = self.data.lock().unwrap();
        let prefix = format!("{}/{}/", key.project_key, key.session_id);
        let mut result = Vec::new();

        for key_str in data.keys() {
            if key_str.starts_with(&prefix) {
                let subpath = key_str[prefix.len()..].to_string();
                if !subpath.is_empty() {
                    result.push(subpath);
                }
            }
        }

        Ok(result)
    }

    fn has_list_sessions(&self) -> bool {
        true
    }
    fn has_delete(&self) -> bool {
        true
    }
    fn has_list_subkeys(&self) -> bool {
        true
    }
    fn has_list_session_summaries(&self) -> bool {
        true
    }
}

/// Convert a file path to a SessionKey.
///
/// Given a path like `<projects_dir>/<project_key>/<session_id>.jsonl`
/// or `<projects_dir>/<project_key>/<session_id>/subagents/agent-abc.jsonl`,
/// extracts the project_key, session_id, and optional subpath.
pub fn file_path_to_session_key(file_path: &str, projects_dir: &str) -> Option<SessionKey> {
    use std::path::Path;

    let file = Path::new(file_path);
    let base = Path::new(projects_dir);
    let rel = file.strip_prefix(base).ok()?;

    let components: Vec<&str> = rel
        .components()
        .map(|c| c.as_os_str().to_str().unwrap_or(""))
        .collect();

    if components.len() < 2 {
        return None;
    }

    let project_key = components[0].to_string();
    let second = components[1];

    // Direct session file: <project_key>/<session_id>.jsonl
    if second.ends_with(".jsonl") && components.len() == 2 {
        let session_id = &second[..second.len() - ".jsonl".len()];
        return Some(SessionKey::new(project_key, session_id));
    }

    // Subagent file: <project_key>/<session_id>/subagents/.../<file>.jsonl
    // Must have at least 4 parts (project_key/session_id/subagents/file.jsonl)
    if components.len() >= 4 {
        let session_id = second;
        let last_component = components.last().unwrap_or(&"");
        // Last component must be a .jsonl file
        if !last_component.ends_with(".jsonl") {
            return None;
        }
        // Build subpath from remaining components, strip .jsonl from last
        let mut sub_parts: Vec<String> = components[2..].iter().map(|s| s.to_string()).collect();
        if let Some(last) = sub_parts.last_mut() {
            *last = last[..last.len() - ".jsonl".len()].to_string();
        }
        let subpath = sub_parts.join("/");
        return Some(SessionKey {
            project_key,
            session_id: session_id.to_string(),
            subpath: Some(subpath),
        });
    }

    None
}
