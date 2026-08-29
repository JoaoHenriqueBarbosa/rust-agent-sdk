/// Reserva de output subtraída da janela — `min(max_output_tokens, 20_000)`
/// no CLI (autoCompact.js).
const OUTPUT_RESERVE_CAP: usize = 20_000;

/// Buffer absoluto antes do limite (AUTOCOMPACT_BUFFER_TOKENS do CLI).
const AUTOCOMPACT_BUFFER_TOKENS: usize = 13_000;

/// Configuration for automatic context compaction.
#[derive(Debug, Clone)]
pub struct AutoCompactConfig {
    /// Total context window size in tokens.
    pub context_window_tokens: usize,
    /// max_tokens de output da sessão — entra na reserva do threshold.
    pub max_output_tokens: usize,
    /// Maximum consecutive compaction failures before giving up.
    pub max_failures: u32,
    failure_count: u32,
}

impl AutoCompactConfig {
    pub fn new(context_window_tokens: usize, max_output_tokens: usize) -> Self {
        Self {
            context_window_tokens,
            max_output_tokens,
            max_failures: 3,
            failure_count: 0,
        }
    }

    /// Limite de tokens de INPUT a partir do qual compacta. É buffer
    /// ABSOLUTO, não porcentagem: `janela − min(max_output, 20k) − 13k`,
    /// como o CLI — porcentagem fixa não escala nem para janelas de 1M
    /// (compactaria cedo demais) nem para as de 32k (não reservaria espaço
    /// para a própria chamada de sumarização).
    pub fn threshold(&self) -> usize {
        let reserve = self.max_output_tokens.min(OUTPUT_RESERVE_CAP);
        self.context_window_tokens
            .saturating_sub(reserve)
            .saturating_sub(AUTOCOMPACT_BUFFER_TOKENS)
    }

    /// Check whether compaction should be triggered, given a token count that
    /// the caller computed (usage real da API + estimativa do delta).
    pub fn should_compact(&self, token_count: usize) -> bool {
        if self.failure_count >= self.max_failures {
            return false;
        }
        token_count >= self.threshold()
    }

    /// Record a compaction failure (circuit breaker).
    pub fn record_failure(&mut self) {
        self.failure_count += 1;
    }

    /// Reset failure count after a successful compaction.
    pub fn record_success(&mut self) {
        self.failure_count = 0;
    }

    /// Whether the circuit breaker has tripped.
    pub fn is_circuit_broken(&self) -> bool {
        self.failure_count >= self.max_failures
    }
}

impl Default for AutoCompactConfig {
    fn default() -> Self {
        Self::new(200_000, 16_384)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_threshold_reserves_output_and_buffer() {
        // janela − min(max_output, 20k) − 13k, como o CLI.
        let config = AutoCompactConfig::new(200_000, 16_384);
        assert_eq!(config.threshold(), 200_000 - 16_384 - 13_000);
        // max_output acima do cap: reserva satura em 20k.
        let config = AutoCompactConfig::new(1_000_000, 64_000);
        assert_eq!(config.threshold(), 1_000_000 - 20_000 - 13_000);
    }

    #[test]
    fn test_should_compact_by_count() {
        let config = AutoCompactConfig::new(200_000, 16_384);
        assert!(!config.should_compact(100_000));
        assert!(config.should_compact(config.threshold()));
    }

    #[test]
    fn test_circuit_breaker() {
        let mut config = AutoCompactConfig::new(200_000, 16_384);
        config.record_failure();
        config.record_failure();
        assert!(!config.is_circuit_broken());
        config.record_failure();
        assert!(config.is_circuit_broken());

        // Even with high token count, circuit breaker prevents compaction
        assert!(!config.should_compact(usize::MAX));

        config.record_success();
        assert!(!config.is_circuit_broken());
    }
}
