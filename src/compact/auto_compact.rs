use crate::compact::token_estimation::*;
use crate::api::types::{ApiMessage, SystemBlock, ToolDefinition};

/// Configuration for automatic context compaction.
#[derive(Debug, Clone)]
pub struct AutoCompactConfig {
    /// Percentage of context window at which compaction triggers (default 0.83).
    pub threshold_percentage: f64,
    /// Total context window size in tokens.
    pub context_window_tokens: usize,
    /// Maximum consecutive compaction failures before giving up.
    pub max_failures: u32,
    failure_count: u32,
}

impl AutoCompactConfig {
    pub fn new(context_window_tokens: usize) -> Self {
        Self {
            threshold_percentage: 0.83,
            context_window_tokens,
            max_failures: 3,
            failure_count: 0,
        }
    }

    /// Check whether compaction should be triggered.
    pub fn should_compact(
        &self,
        system: &[SystemBlock],
        messages: &[ApiMessage],
        tools: &[ToolDefinition],
    ) -> bool {
        if self.failure_count >= self.max_failures {
            return false;
        }

        let total = estimate_system_tokens(system)
            + estimate_message_tokens(messages)
            + estimate_tool_definition_tokens(tools);

        let threshold = (self.context_window_tokens as f64 * self.threshold_percentage) as usize;
        total >= threshold
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
        Self::new(200_000)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::types::*;

    #[test]
    fn test_should_compact_below_threshold() {
        let config = AutoCompactConfig::new(200_000);
        let system = vec![SystemBlock::text("short")];
        let messages = vec![ApiMessage::user(vec![ContentBlock::text("hello")])];
        let tools = vec![];

        assert!(!config.should_compact(&system, &messages, &tools));
    }

    #[test]
    fn test_should_compact_above_threshold() {
        let config = AutoCompactConfig::new(100); // Very small window
        let system = vec![SystemBlock::text("A".repeat(400))]; // 100 tokens
        let messages = vec![]; // Empty
        let tools = vec![];

        assert!(config.should_compact(&system, &messages, &tools));
    }

    #[test]
    fn test_circuit_breaker() {
        let mut config = AutoCompactConfig::new(100);
        config.record_failure();
        config.record_failure();
        assert!(!config.is_circuit_broken());
        config.record_failure();
        assert!(config.is_circuit_broken());

        // Even with high token count, circuit breaker prevents compaction
        let system = vec![SystemBlock::text("A".repeat(400))];
        assert!(!config.should_compact(&system, &[], &[]));

        config.record_success();
        assert!(!config.is_circuit_broken());
    }
}
