//! Optional [`SessionStore`](crate::SessionStore) backends.
//!
//! Each backend lives behind a Cargo feature so the default build stays free of
//! heavy transport dependencies:
//!
//! - `postgres` → [`postgres::PostgresSessionStore`]
//! - `redis-store` → [`redis::RedisSessionStore`]
//!
//! Both are faithful ports of the Python SDK's `examples/session_stores/`
//! adapters and pass the same conformance contracts. An S3 backend is on the
//! roadmap.

#[cfg(feature = "postgres")]
pub mod postgres;

#[cfg(feature = "redis-store")]
pub mod redis;
