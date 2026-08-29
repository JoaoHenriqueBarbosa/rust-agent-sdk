//! Redis-backed [`SessionStore`], ported 1:1 from the Python SDK's
//! `examples/session_stores/redis_session_store.py`.
//!
//! Key layout (separator `:`):
//! ```text
//! {prefix}{project}:{session}              -> LIST  (main transcript, one JSON per element)
//! {prefix}{project}:{session}:{subpath}    -> LIST  (subagent transcript)
//! {prefix}{project}:{session}:__subkeys    -> SET   (subpaths under the session)
//! {prefix}{project}:__sessions             -> ZSET  (session_id -> mtime ms, score = mtime)
//! ```
//!
//! Redis has no native mtime, so a sorted set holds the session index with the
//! mtime as score. Requires the `redis-store` feature. Does not implement
//! `list_session_summaries` (matching the Python example).

use redis::AsyncCommands;

use crate::errors::ClaudeSDKError;
use crate::types::{
    SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry, SessionStoreListEntry,
};

/// A [`SessionStore`] that mirrors session transcripts into Redis.
pub struct RedisSessionStore {
    client: redis::Client,
    prefix: String,
}

fn to_sdk_err(e: impl std::fmt::Display) -> ClaudeSDKError {
    ClaudeSDKError::sdk(format!("redis session store: {e}"))
}

fn now_ms() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as i64
}

impl RedisSessionStore {
    /// Connect to Redis from a URL (e.g. `redis://127.0.0.1:6379`). `prefix`
    /// namespaces every key; a trailing `:` is normalized in.
    pub fn connect(url: &str, prefix: Option<&str>) -> Result<Self, ClaudeSDKError> {
        let client = redis::Client::open(url).map_err(to_sdk_err)?;
        let prefix = match prefix {
            Some(p) if !p.is_empty() => format!("{}:", p.trim_end_matches(':')),
            _ => String::new(),
        };
        Ok(Self { client, prefix })
    }

    async fn conn(&self) -> Result<redis::aio::MultiplexedConnection, ClaudeSDKError> {
        self.client
            .get_multiplexed_async_connection()
            .await
            .map_err(to_sdk_err)
    }

    fn has_real_subpath(key: &SessionKey) -> Option<&str> {
        match key.subpath.as_deref() {
            Some(s) if !s.is_empty() => Some(s),
            _ => None,
        }
    }

    fn entry_key(&self, key: &SessionKey) -> String {
        match Self::has_real_subpath(key) {
            Some(sub) => format!(
                "{}{}:{}:{}",
                self.prefix, key.project_key, key.session_id, sub
            ),
            None => format!("{}{}:{}", self.prefix, key.project_key, key.session_id),
        }
    }

    fn subkeys_key(&self, project_key: &str, session_id: &str) -> String {
        format!("{}{}:{}:__subkeys", self.prefix, project_key, session_id)
    }

    fn sessions_key(&self, project_key: &str) -> String {
        format!("{}{}:__sessions", self.prefix, project_key)
    }
}

#[async_trait::async_trait]
impl SessionStore for RedisSessionStore {
    async fn append(
        &self,
        key: &SessionKey,
        entries: &[SessionStoreEntry],
    ) -> Result<(), ClaudeSDKError> {
        if entries.is_empty() {
            return Ok(());
        }
        let mut conn = self.conn().await?;
        let entry_key = self.entry_key(key);
        let payloads: Vec<String> = entries
            .iter()
            .map(|e| serde_json::to_string(e).map_err(to_sdk_err))
            .collect::<Result<_, _>>()?;

        let mut pipe = redis::pipe();
        pipe.atomic();
        pipe.rpush(&entry_key, payloads);
        match Self::has_real_subpath(key) {
            Some(sub) => {
                pipe.sadd(self.subkeys_key(&key.project_key, &key.session_id), sub);
            }
            None => {
                // Only the main transcript bumps the session index.
                pipe.zadd(
                    self.sessions_key(&key.project_key),
                    &key.session_id,
                    now_ms(),
                );
            }
        }
        pipe.query_async::<()>(&mut conn)
            .await
            .map_err(to_sdk_err)?;
        Ok(())
    }

    async fn load(
        &self,
        key: &SessionKey,
    ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
        let mut conn = self.conn().await?;
        let raw: Vec<String> = conn
            .lrange(self.entry_key(key), 0, -1)
            .await
            .map_err(to_sdk_err)?;
        if raw.is_empty() {
            // Like the Python adapter, an empty list is indistinguishable from
            // "never written" and maps to None.
            return Ok(None);
        }
        let mut entries = Vec::with_capacity(raw.len());
        for s in raw {
            // Skip malformed elements rather than failing the whole load.
            if let Ok(v) = serde_json::from_str::<SessionStoreEntry>(&s) {
                entries.push(v);
            }
        }
        if entries.is_empty() {
            return Ok(None);
        }
        Ok(Some(entries))
    }

    async fn list_sessions(
        &self,
        project_key: &str,
    ) -> Result<Vec<SessionStoreListEntry>, ClaudeSDKError> {
        let mut conn = self.conn().await?;
        let items: Vec<(String, i64)> = conn
            .zrange_withscores(self.sessions_key(project_key), 0, -1)
            .await
            .map_err(to_sdk_err)?;
        Ok(items
            .into_iter()
            .map(|(session_id, mtime)| SessionStoreListEntry { session_id, mtime })
            .collect())
    }

    async fn delete(&self, key: &SessionKey) -> Result<(), ClaudeSDKError> {
        let mut conn = self.conn().await?;
        let entry_key = self.entry_key(key);
        let subkeys_key = self.subkeys_key(&key.project_key, &key.session_id);

        match Self::has_real_subpath(key) {
            Some(sub) => {
                let mut pipe = redis::pipe();
                pipe.atomic();
                pipe.del(&entry_key);
                pipe.srem(&subkeys_key, sub);
                pipe.query_async::<()>(&mut conn)
                    .await
                    .map_err(to_sdk_err)?;
            }
            None => {
                // Cascade: read subpaths first, then delete the main list, the
                // subkeys set, every subagent list, and the session index entry.
                let subpaths: Vec<String> =
                    conn.smembers(&subkeys_key).await.map_err(to_sdk_err)?;
                let mut keys_to_del = vec![entry_key.clone(), subkeys_key.clone()];
                for sub in &subpaths {
                    keys_to_del.push(format!(
                        "{}{}:{}:{}",
                        self.prefix, key.project_key, key.session_id, sub
                    ));
                }
                let mut pipe = redis::pipe();
                pipe.atomic();
                pipe.del(keys_to_del);
                pipe.zrem(self.sessions_key(&key.project_key), &key.session_id);
                pipe.query_async::<()>(&mut conn)
                    .await
                    .map_err(to_sdk_err)?;
            }
        }
        Ok(())
    }

    async fn list_subkeys(
        &self,
        key: &SessionListSubkeysKey,
    ) -> Result<Vec<String>, ClaudeSDKError> {
        let mut conn = self.conn().await?;
        let members: Vec<String> = conn
            .smembers(self.subkeys_key(&key.project_key, &key.session_id))
            .await
            .map_err(to_sdk_err)?;
        Ok(members)
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
    // list_session_summaries intentionally left as the default (unimplemented),
    // matching the Python example.
}
