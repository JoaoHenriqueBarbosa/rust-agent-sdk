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
        // Espelha o withRetry do CLI: DEFAULT_MAX_RETRIES = 10, cap 32s.
        Self {
            max_retries: 10,
            base_delay_ms: 500,
            max_delay_ms: 32_000,
            overload_max_retries: 3,
        }
    }
}

/// Outcome of a retry loop when retries are exhausted or a special condition is met.
#[derive(Debug, Clone)]
pub enum RetryOutcome {
    /// The overload (529) retry limit was hit — if a fallback model is available,
    /// the caller should switch to it.
    FallbackTriggered {
        consecutive_529s: u32,
    },
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
    /// 400 "input length and max_tokens exceed context limit": o retry deve
    /// REDUZIR max_tokens para o espaço disponível e tentar de novo (é o que
    /// o withRetry do CLI faz), nunca falhar direto.
    MaxTokensContextOverflow {
        /// Espaço que sobrou para output (L - N do erro), quando parseável.
        available: Option<u32>,
    },
    /// 401 — retryable poucas vezes: num gateway, um 401 transitório durante
    /// restart é comum; numa chave errada de verdade, o teto corta rápido.
    AuthError,
    /// 4xx Client Error — do NOT retry.
    ClientError(u16),
    /// Unknown error.
    Unknown(String),
}

/// Teto de tentativas para 401 — sem refresh de credencial, insistir 10x numa
/// chave inválida só queima tempo.
const AUTH_MAX_RETRIES: u32 = 2;

/// Piso de output tokens no reajuste por context overflow (FLOOR do CLI).
pub const FLOOR_OUTPUT_TOKENS: u32 = 3_000;

/// Parseia "input length and max_tokens exceed context limit: N + M > L" e
/// devolve o espaço disponível para output (L - N).
fn parse_context_overflow(body: &str) -> Option<u32> {
    let marker = "exceed context limit:";
    let rest = &body[body.find(marker)? + marker.len()..];
    let mut numbers = rest
        .split(|c: char| !c.is_ascii_digit())
        .filter(|s| !s.is_empty())
        .filter_map(|s| s.parse::<u64>().ok());
    let input = numbers.next()?;
    let _max_tokens = numbers.next()?;
    let limit = numbers.next()?;
    u32::try_from(limit.saturating_sub(input)).ok()
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
                | ErrorKind::MaxTokensContextOverflow { .. }
                | ErrorKind::AuthError
        )
    }

    /// Classify an HTTP status code and optional headers into an ErrorKind.
    ///
    /// `should_retry_header` é o `x-should-retry` da resposta: "true" força a
    /// classificação retryable, "false" força não-retryable — a API sabe mais
    /// que a tabela de status.
    pub fn from_status(
        status: u16,
        retry_after_header: Option<&str>,
        body: Option<&str>,
        should_retry_header: Option<&str>,
    ) -> Self {
        // Gateways devolvem erro Anthropic com o status ERRADO (500/502 com
        // "overloaded_error" no corpo, às vezes 200 com erro embutido) — o
        // corpo decide antes do status, como no is529Error do CLI.
        if body.is_some_and(|b| b.contains("\"overloaded_error\"")) {
            return Self::apply_should_retry_header(ErrorKind::Overloaded, status, should_retry_header);
        }
        let kind = match status {
            429 => {
                let retry_after = retry_after_header.and_then(|v| {
                    v.parse::<u64>().ok().map(Duration::from_secs)
                });
                ErrorKind::RateLimited { retry_after }
            }
            529 => ErrorKind::Overloaded,
            400 => {
                if let Some(body) = body {
                    if body.contains("exceed context limit") {
                        return ErrorKind::MaxTokensContextOverflow {
                            available: parse_context_overflow(body),
                        };
                    }
                    if body.contains("prompt is too long") || body.contains("too many tokens") {
                        return ErrorKind::PromptTooLong;
                    }
                }
                ErrorKind::ClientError(400)
            }
            401 => ErrorKind::AuthError,
            // 408/409 são o que um proxy sob carga devolve — retryable no CLI.
            408 | 409 => ErrorKind::ServerError(status),
            403 | 404 => ErrorKind::ClientError(status),
            s if (500..600).contains(&s) => ErrorKind::ServerError(s),
            s if (400..500).contains(&s) => ErrorKind::ClientError(s),
            _ => ErrorKind::Unknown(format!("unexpected status: {status}")),
        };
        Self::apply_should_retry_header(kind, status, should_retry_header)
    }

    fn apply_should_retry_header(kind: ErrorKind, status: u16, header: Option<&str>) -> ErrorKind {
        match header {
            Some("true") if !kind.is_retryable() => ErrorKind::ServerError(status),
            Some("false") if kind.is_retryable() => ErrorKind::ClientError(status),
            _ => kind,
        }
    }
}

/// Teto de espera derivada do header `anthropic-ratelimit-unified-reset`
/// (epoch). O CLI em modo persistente espera o reset real; aqui o cap é 5min
/// (PERSISTENT_MAX_BACKOFF_MS) para não pendurar um worker por horas.
const UNIFIED_RESET_CAP: Duration = Duration::from_secs(300);

/// Preenche o retry_after de um RateLimited sem `retry-after` a partir do
/// header de reset unificado, quando presente.
pub fn apply_unified_reset(kind: ErrorKind, reset_epoch_header: Option<&str>) -> ErrorKind {
    let ErrorKind::RateLimited { retry_after: None } = kind else {
        return kind;
    };
    let Some(epoch) = reset_epoch_header.and_then(|v| v.parse::<u64>().ok()) else {
        return kind;
    };
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let wait = Duration::from_secs(epoch.saturating_sub(now)).min(UNIFIED_RESET_CAP);
    ErrorKind::RateLimited {
        retry_after: Some(wait),
    }
}

/// Calculate the delay for a given retry attempt with jitter.
pub fn calculate_delay(config: &RetryConfig, attempt: u32) -> Duration {
    let base = config.base_delay_ms as f64;
    let exp_delay = base * 2f64.powi(attempt as i32);
    let capped = exp_delay.min(config.max_delay_ms as f64);

    // Jitter só POSITIVO (1.0-1.25x), como o CLI: jitter simétrico encurta o
    // backoff sob rate limit, que é a direção errada.
    let mut rng = rand::thread_rng();
    let jitter_factor = rng.gen_range(1.0..=1.25);
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

    if *error_kind == ErrorKind::AuthError && attempt >= AUTH_MAX_RETRIES {
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
            ErrorKind::from_status(429, None, None, None),
            ErrorKind::RateLimited { retry_after: None }
        ));

        assert!(matches!(
            ErrorKind::from_status(429, Some("5"), None, None),
            ErrorKind::RateLimited { retry_after: Some(d) } if d == Duration::from_secs(5)
        ));

        assert_eq!(ErrorKind::from_status(529, None, None, None), ErrorKind::Overloaded);

        assert_eq!(
            ErrorKind::from_status(400, None, Some(r#"{"error":{"message":"prompt is too long"}}"#), None),
            ErrorKind::PromptTooLong
        );

        assert_eq!(ErrorKind::from_status(400, None, None, None), ErrorKind::ClientError(400));
        // 401 é retryable poucas vezes: gateways devolvem 401 transitório.
        assert_eq!(ErrorKind::from_status(401, None, None, None), ErrorKind::AuthError);
        // Corpo com overloaded_error decide antes do status errado do proxy.
        assert_eq!(
            ErrorKind::from_status(500, None, Some(r#"{"error":{"type":"overloaded_error"}}"#), None),
            ErrorKind::Overloaded
        );
        // 408/409 são transientes de proxy: retryable.
        assert_eq!(ErrorKind::from_status(408, None, None, None), ErrorKind::ServerError(408));
        assert_eq!(ErrorKind::from_status(409, None, None, None), ErrorKind::ServerError(409));
        // x-should-retry manda mais que a tabela.
        assert!(ErrorKind::from_status(404, None, None, Some("true")).is_retryable());
        assert!(!ErrorKind::from_status(500, None, None, Some("false")).is_retryable());
        // Overflow de max_tokens carrega o espaço disponível parseado.
        assert_eq!(
            ErrorKind::from_status(400, None, Some("input length and max_tokens exceed context limit: 190000 + 16384 > 200000"), None),
            ErrorKind::MaxTokensContextOverflow { available: Some(10_000) }
        );
        assert_eq!(ErrorKind::from_status(500, None, None, None), ErrorKind::ServerError(500));
        assert_eq!(ErrorKind::from_status(502, None, None, None), ErrorKind::ServerError(502));
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

        // Max retries exceeded (default max_retries = 10, como o CLI)
        assert!(should_retry(&config, &ErrorKind::ServerError(500), 3, 0));
        assert!(!should_retry(&config, &ErrorKind::ServerError(500), 10, 0));
        // 401 é retryable só 2 vezes — sem refresh de credencial, insistir
        // numa chave inválida é queimar tempo.
        assert!(should_retry(&config, &ErrorKind::AuthError, 1, 0));
        assert!(!should_retry(&config, &ErrorKind::AuthError, 2, 0));

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
