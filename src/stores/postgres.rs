//! Postgres-backed [`SessionStore`], ported 1:1 from the Python SDK's
//! `examples/session_stores/postgres_session_store.py`.
//!
//! One row per entry; `seq` (bigserial) orders entries within a key. The main
//! transcript uses the sentinel `subpath = ''` (not NULL, so it can be part of
//! the primary key), while subagent transcripts carry their real subpath. A
//! partial index on `subpath = ''` keeps `list_sessions` cheap.
//!
//! Requires the `postgres` feature. Does not implement `list_session_summaries`
//! (matching the Python example).

use sqlx::{postgres::PgPoolOptions, PgPool, Row};

use crate::errors::ClaudeSDKError;
use crate::types::{
    SessionKey, SessionListSubkeysKey, SessionStore, SessionStoreEntry, SessionStoreListEntry,
};

/// A [`SessionStore`] that mirrors session transcripts into a Postgres table.
pub struct PostgresSessionStore {
    pool: PgPool,
    table: String,
}

fn to_sdk_err(e: impl std::fmt::Display) -> ClaudeSDKError {
    ClaudeSDKError::sdk(format!("postgres session store: {e}"))
}

/// Table names are interpolated into SQL (identifiers cannot be bound as
/// parameters), so they must be validated against a strict identifier pattern.
fn valid_identifier(name: &str) -> bool {
    let mut chars = name.chars();
    match chars.next() {
        Some(c) if c.is_ascii_alphabetic() || c == '_' => {}
        _ => return false,
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '_')
}

impl PostgresSessionStore {
    /// Connect using a Postgres connection string and ensure the schema exists.
    /// `table` defaults to `claude_session_store` when `None`.
    pub async fn connect(database_url: &str, table: Option<&str>) -> Result<Self, ClaudeSDKError> {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await
            .map_err(to_sdk_err)?;
        Self::with_pool(pool, table).await
    }

    /// Build from an existing pool and ensure the schema exists.
    pub async fn with_pool(pool: PgPool, table: Option<&str>) -> Result<Self, ClaudeSDKError> {
        let table = table.unwrap_or("claude_session_store").to_string();
        if !valid_identifier(&table) {
            return Err(ClaudeSDKError::sdk(format!(
                "invalid Postgres table name: {table:?}"
            )));
        }
        let store = Self { pool, table };
        store.create_schema().await?;
        Ok(store)
    }

    async fn create_schema(&self) -> Result<(), ClaudeSDKError> {
        let ddl = format!(
            r#"
            CREATE TABLE IF NOT EXISTS {table} (
              project_key text   NOT NULL,
              session_id  text   NOT NULL,
              subpath     text   NOT NULL DEFAULT '',
              seq         bigserial,
              entry       jsonb  NOT NULL,
              mtime       bigint NOT NULL,
              PRIMARY KEY (project_key, session_id, subpath, seq)
            );
            CREATE INDEX IF NOT EXISTS {table}_list_idx
              ON {table} (project_key, session_id) WHERE subpath = '';
            "#,
            table = self.table
        );
        sqlx::raw_sql(&ddl)
            .execute(&self.pool)
            .await
            .map_err(to_sdk_err)?;
        Ok(())
    }
}

/// Normalize the optional subpath: absent (or empty) means the main transcript,
/// stored under the `''` sentinel.
fn subpath_sentinel(key: &SessionKey) -> &str {
    match key.subpath.as_deref() {
        Some(s) if !s.is_empty() => s,
        _ => "",
    }
}

#[async_trait::async_trait]
impl SessionStore for PostgresSessionStore {
    async fn append(
        &self,
        key: &SessionKey,
        entries: &[SessionStoreEntry],
    ) -> Result<(), ClaudeSDKError> {
        if entries.is_empty() {
            return Ok(());
        }
        // Insert all entries in a single round-trip, preserving order via
        // WITH ORDINALITY. mtime comes from the server's clock in ms.
        let sql = format!(
            r#"
            INSERT INTO {table} (project_key, session_id, subpath, entry, mtime)
            SELECT $1, $2, $3, e,
                   (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::bigint
            FROM unnest($4::jsonb[]) WITH ORDINALITY AS t(e, ord)
            ORDER BY ord
            "#,
            table = self.table
        );
        sqlx::query(&sql)
            .bind(&key.project_key)
            .bind(&key.session_id)
            .bind(subpath_sentinel(key))
            .bind(entries)
            .execute(&self.pool)
            .await
            .map_err(to_sdk_err)?;
        Ok(())
    }

    async fn load(
        &self,
        key: &SessionKey,
    ) -> Result<Option<Vec<SessionStoreEntry>>, ClaudeSDKError> {
        let sql = format!(
            "SELECT entry FROM {table} \
             WHERE project_key = $1 AND session_id = $2 AND subpath = $3 \
             ORDER BY seq",
            table = self.table
        );
        let rows = sqlx::query(&sql)
            .bind(&key.project_key)
            .bind(&key.session_id)
            .bind(subpath_sentinel(key))
            .fetch_all(&self.pool)
            .await
            .map_err(to_sdk_err)?;
        if rows.is_empty() {
            return Ok(None);
        }
        let entries = rows
            .into_iter()
            .map(|row| row.get::<SessionStoreEntry, _>("entry"))
            .collect();
        Ok(Some(entries))
    }

    async fn list_sessions(
        &self,
        project_key: &str,
    ) -> Result<Vec<SessionStoreListEntry>, ClaudeSDKError> {
        let sql = format!(
            "SELECT session_id, MAX(mtime) AS mtime FROM {table} \
             WHERE project_key = $1 AND subpath = '' \
             GROUP BY session_id",
            table = self.table
        );
        let rows = sqlx::query(&sql)
            .bind(project_key)
            .fetch_all(&self.pool)
            .await
            .map_err(to_sdk_err)?;
        Ok(rows
            .into_iter()
            .map(|row| SessionStoreListEntry {
                session_id: row.get("session_id"),
                mtime: row.get("mtime"),
            })
            .collect())
    }

    async fn delete(&self, key: &SessionKey) -> Result<(), ClaudeSDKError> {
        let sentinel = subpath_sentinel(key);
        // A main-transcript delete (absent subpath) omits the subpath predicate
        // and therefore cascades to every row of this (project_key, session_id).
        let sql = if key
            .subpath
            .as_deref()
            .map(|s| !s.is_empty())
            .unwrap_or(false)
        {
            format!(
                "DELETE FROM {table} \
                 WHERE project_key = $1 AND session_id = $2 AND subpath = $3",
                table = self.table
            )
        } else {
            format!(
                "DELETE FROM {table} WHERE project_key = $1 AND session_id = $2",
                table = self.table
            )
        };
        let mut q = sqlx::query(&sql)
            .bind(&key.project_key)
            .bind(&key.session_id);
        if key
            .subpath
            .as_deref()
            .map(|s| !s.is_empty())
            .unwrap_or(false)
        {
            q = q.bind(sentinel);
        }
        q.execute(&self.pool).await.map_err(to_sdk_err)?;
        Ok(())
    }

    async fn list_subkeys(
        &self,
        key: &SessionListSubkeysKey,
    ) -> Result<Vec<String>, ClaudeSDKError> {
        let sql = format!(
            "SELECT DISTINCT subpath FROM {table} \
             WHERE project_key = $1 AND session_id = $2 AND subpath <> ''",
            table = self.table
        );
        let rows = sqlx::query(&sql)
            .bind(&key.project_key)
            .bind(&key.session_id)
            .fetch_all(&self.pool)
            .await
            .map_err(to_sdk_err)?;
        Ok(rows.into_iter().map(|row| row.get("subpath")).collect())
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
