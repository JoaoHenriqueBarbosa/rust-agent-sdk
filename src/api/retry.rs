use std::time::Duration;
use rand::Rng;

/// Configuration for retry behavior.
#[derive(Debug, Clone)]
pub struct RetryConfig {
    /// Maximum number of retry attempts.
    pub max_retries: u32,
    /// Base delay in milliseconds for exponential backoff.
    pub base_delay_ms: u64,
    /// Maximum delay in milliseconds.
    pub max_delay_ms: u64,
    /// Maximum retries for 529 (overloaded) responses.
    pub overload_max_retries: u32,
}

impl Default for RetryConfig {
    fn default() -> Self {
        Self {
            max_retries: 5,
            base_delay_ms: 500,
            max_delay_ms: 30_000,
            overload_max_retries: 3,
        }
    }
}

/// Classification of HTTP/API errors for retry decisions.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ErrorKind {
    /// 429 Too Many Requests — retry with backoff, respect retry-after.
    RateLimited { retry_after: Option<Duration> },
    /// 529 Overloaded — retry up to overload_max_retries.
    Overloaded,
    /// 5xx Server Error — retry with backoff.
    ServerError(u16),
    /// Connection/network error — retry with backoff.
    ConnectionError,
    /// 400 Bad Request — context too long, may attempt compaction.
    PromptTooLong,
    /// 4xx Client Error — do NOT retry.
    ClientError(u16),
    /// Unknown error.
    Unknown(String),
}

impl ErrorKind {
    /// Whether this error kind is retryable.
    pub fn is_retryable(&self) -> bool {
        matches!(
            self,
            ErrorKind::RateLimited { .. }
                | ErrorKind::Overloaded
                | ErrorKind::ServerError(_)
                | ErrorKind::ConnectionError
        )
    }

    /// Classify an HTTP status code and optional headers into an ErrorKind.
    pub fn from_status(status: u16, retry_after_header: Option<&str>, body: Option<&str>) -> Self {
        match status {
            429 => {
                let retry_after = retry_after_header.and_then(|v| {
                    v.parse::<u64>().ok().map(Duration::from_secs)
                });
                ErrorKind::RateLimited { retry_after }
            }
            529 => ErrorKind::Overloaded,
            400 => {
                if let Some(body) = body {
                    if body.contains("prompt is too long") || body.contains("too many tokens") {
                        return ErrorKind::PromptTooLong;
                    }
                }
                ErrorKind::ClientError(400)
            }
            401 | 403 | 404 => ErrorKind::ClientError(status),
            s if (500..600).contains(&s) => ErrorKind::ServerError(s),
            s if (400..500).contains(&s) => ErrorKind::ClientError(s),
            _ => ErrorKind::Unknown(format!("unexpected status: {status}")),
        }
    }
}

/// Calculate the delay for a given retry attempt with jitter.
pub fn calculate_delay(config: &RetryConfig, attempt: u32) -> Duration {
    let base = config.base_delay_ms as f64;
    let exp_delay = base * 2f64.powi(attempt as i32);
    let capped = exp_delay.min(config.max_delay_ms as f64);

    // Add ±25% jitter
    let mut rng = rand::thread_rng();
    let jitter_factor = rng.gen_range(0.75..=1.25);
    let jittered = (capped * jitter_factor) as u64;

    Duration::from_millis(jittered)
}

/// Determines if a retry should be attempted, given the error kind and current state.
pub fn should_retry(
    config: &RetryConfig,
    error_kind: &ErrorKind,
    attempt: u32,
    overload_retries: u32,
) -> bool {
    if !error_kind.is_retryable() {
        return false;
    }

    if attempt >= config.max_retries {
        return false;
    }

    if *error_kind == ErrorKind::Overloaded && overload_retries >= config.overload_max_retries {
        return false;
    }

    true
}

/// Get the delay for a retry, taking into account retry-after headers.
pub fn get_retry_delay(
    config: &RetryConfig,
    error_kind: &ErrorKind,
    attempt: u32,
) -> Duration {
    if let ErrorKind::RateLimited { retry_after: Some(duration) } = error_kind {
        return *duration;
    }
    calculate_delay(config, attempt)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_kind_from_status() {
        assert!(matches!(
            ErrorKind::from_status(429, None, None),
            ErrorKind::RateLimited { retry_after: None }
        ));

        assert!(matches!(
            ErrorKind::from_status(429, Some("5"), None),
            ErrorKind::RateLimited { retry_after: Some(d) } if d == Duration::from_secs(5)
        ));

        assert_eq!(ErrorKind::from_status(529, None, None), ErrorKind::Overloaded);

        assert_eq!(
            ErrorKind::from_status(400, None, Some(r#"{"error":{"message":"prompt is too long"}}"#)),
            ErrorKind::PromptTooLong
        );

        assert_eq!(ErrorKind::from_status(400, None, None), ErrorKind::ClientError(400));
        assert_eq!(ErrorKind::from_status(401, None, None), ErrorKind::ClientError(401));
        assert_eq!(ErrorKind::from_status(500, None, None), ErrorKind::ServerError(500));
        assert_eq!(ErrorKind::from_status(502, None, None), ErrorKind::ServerError(502));
    }

    #[test]
    fn test_retryable() {
        assert!(ErrorKind::RateLimited { retry_after: None }.is_retryable());
        assert!(ErrorKind::Overloaded.is_retryable());
        assert!(ErrorKind::ServerError(500).is_retryable());
        assert!(ErrorKind::ConnectionError.is_retryable());
        assert!(!ErrorKind::ClientError(400).is_retryable());
        assert!(!ErrorKind::PromptTooLong.is_retryable());
    }

    #[test]
    fn test_calculate_delay_exponential() {
        let config = RetryConfig {
            base_delay_ms: 500,
            max_delay_ms: 30_000,
            ..Default::default()
        };

        // attempt 0: ~500ms (with jitter 375..625)
        for _ in 0..20 {
            let d = calculate_delay(&config, 0);
            assert!(d.as_millis() >= 375 && d.as_millis() <= 625);
        }

        // attempt 3: ~4000ms (with jitter 3000..5000)
        for _ in 0..20 {
            let d = calculate_delay(&config, 3);
            assert!(d.as_millis() >= 3000 && d.as_millis() <= 5000);
        }
    }

    #[test]
    fn test_calculate_delay_capped() {
        let config = RetryConfig {
            base_delay_ms: 500,
            max_delay_ms: 5_000,
            ..Default::default()
        };

        // attempt 10: would be 512000ms, but capped at 5000 (jittered 3750..6250)
        let d = calculate_delay(&config, 10);
        assert!(d.as_millis() <= 6250);
    }

    #[test]
    fn test_should_retry() {
        let config = RetryConfig::default();

        // Retryable error, first attempt
        assert!(should_retry(&config, &ErrorKind::RateLimited { retry_after: None }, 0, 0));

        // Non-retryable error
        assert!(!should_retry(&config, &ErrorKind::ClientError(400), 0, 0));

        // Max retries exceeded
        assert!(!should_retry(&config, &ErrorKind::ServerError(500), 5, 0));

        // Overload max exceeded
        assert!(!should_retry(&config, &ErrorKind::Overloaded, 1, 3));

        // Overload under limit
        assert!(should_retry(&config, &ErrorKind::Overloaded, 1, 2));
    }

    #[test]
    fn test_get_retry_delay_respects_retry_after() {
        let config = RetryConfig::default();
        let delay = get_retry_delay(
            &config,
            &ErrorKind::RateLimited { retry_after: Some(Duration::from_secs(10)) },
            0,
        );
        assert_eq!(delay, Duration::from_secs(10));
    }
}
