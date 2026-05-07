// Faithful port of ~/claude-code/src/utils/modelCost.ts
// Pricing per 1M tokens (USD)

use crate::api::types::Usage;

struct ModelCost {
    input_tokens: f64,
    output_tokens: f64,
    cache_write_tokens: f64,
    cache_read_tokens: f64,
}

// COST_TIER_3_15: Sonnet-class models
const COST_TIER_3_15: ModelCost = ModelCost {
    input_tokens: 3.0,
    output_tokens: 15.0,
    cache_write_tokens: 3.75,
    cache_read_tokens: 0.3,
};

// COST_TIER_15_75: Opus 4 / 4.1
const COST_TIER_15_75: ModelCost = ModelCost {
    input_tokens: 15.0,
    output_tokens: 75.0,
    cache_write_tokens: 18.75,
    cache_read_tokens: 1.5,
};

// COST_TIER_5_25: Opus 4.5 / 4.6
const COST_TIER_5_25: ModelCost = ModelCost {
    input_tokens: 5.0,
    output_tokens: 25.0,
    cache_write_tokens: 6.25,
    cache_read_tokens: 0.5,
};

// COST_HAIKU_35: Haiku 3.5
const COST_HAIKU_35: ModelCost = ModelCost {
    input_tokens: 0.8,
    output_tokens: 4.0,
    cache_write_tokens: 1.0,
    cache_read_tokens: 0.08,
};

// COST_HAIKU_45: Haiku 4.5
const COST_HAIKU_45: ModelCost = ModelCost {
    input_tokens: 1.0,
    output_tokens: 5.0,
    cache_write_tokens: 1.25,
    cache_read_tokens: 0.1,
};

/// Resolve model string to its cost tier.
/// Matches on known substrings so dated variants (e.g. claude-sonnet-4-20250514) work.
fn get_model_cost(model: &str) -> &'static ModelCost {
    let m = model.to_lowercase();

    // Haiku — check before generic sonnet/opus to avoid false matches
    if m.contains("haiku-4.5") || m.contains("haiku-4-5") {
        return &COST_HAIKU_45;
    }
    if m.contains("haiku") {
        return &COST_HAIKU_35;
    }

    // Opus 4.6 (default tier, fast mode tier handled externally if needed)
    if m.contains("opus-4.6") || m.contains("opus-4-6") {
        return &COST_TIER_5_25;
    }
    // Opus 4.5
    if m.contains("opus-4.5") || m.contains("opus-4-5") {
        return &COST_TIER_5_25;
    }
    // Opus 4.1
    if m.contains("opus-4.1") || m.contains("opus-4-1") {
        return &COST_TIER_15_75;
    }
    // Opus 4 (must come after 4.1/4.5/4.6 checks)
    if m.contains("opus-4") || m.contains("opus4") {
        return &COST_TIER_15_75;
    }

    // Sonnet 4.6
    if m.contains("sonnet-4.6") || m.contains("sonnet-4-6") {
        return &COST_TIER_3_15;
    }
    // Sonnet 4.5
    if m.contains("sonnet-4.5") || m.contains("sonnet-4-5") {
        return &COST_TIER_3_15;
    }
    // Sonnet 4
    if m.contains("sonnet-4") || m.contains("sonnet4") {
        return &COST_TIER_3_15;
    }
    // Sonnet 3.7
    if m.contains("sonnet-3.7") || m.contains("sonnet-3-7") {
        return &COST_TIER_3_15;
    }
    // Sonnet 3.5
    if m.contains("sonnet-3.5") || m.contains("sonnet-3-5") {
        return &COST_TIER_3_15;
    }

    // Fallback: Sonnet-class pricing (same as DEFAULT_UNKNOWN_MODEL_COST in TS)
    &COST_TIER_5_25
}

fn tokens_to_usd(cost: &ModelCost, usage: &Usage) -> f64 {
    (usage.input_tokens as f64 / 1_000_000.0) * cost.input_tokens
        + (usage.output_tokens as f64 / 1_000_000.0) * cost.output_tokens
        + (usage.cache_read_input_tokens.unwrap_or(0) as f64 / 1_000_000.0) * cost.cache_read_tokens
        + (usage.cache_creation_input_tokens.unwrap_or(0) as f64 / 1_000_000.0)
            * cost.cache_write_tokens
}

/// Calculate the USD cost for a single API response given the model and usage.
pub fn calculate_cost(model: &str, usage: &Usage) -> f64 {
    let cost = get_model_cost(model);
    tokens_to_usd(cost, usage)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sonnet_4_cost() {
        let usage = Usage {
            input_tokens: 1_000_000,
            output_tokens: 1_000_000,
            cache_read_input_tokens: None,
            cache_creation_input_tokens: None,
        };
        let cost = calculate_cost("claude-sonnet-4-20250514", &usage);
        // $3 input + $15 output = $18
        assert!((cost - 18.0).abs() < 0.001);
    }

    #[test]
    fn test_opus_4_cost() {
        let usage = Usage {
            input_tokens: 1_000_000,
            output_tokens: 1_000_000,
            cache_read_input_tokens: None,
            cache_creation_input_tokens: None,
        };
        let cost = calculate_cost("claude-opus-4-20250514", &usage);
        // $15 input + $75 output = $90
        assert!((cost - 90.0).abs() < 0.001);
    }

    #[test]
    fn test_haiku_35_cost() {
        let usage = Usage {
            input_tokens: 1_000_000,
            output_tokens: 1_000_000,
            cache_read_input_tokens: None,
            cache_creation_input_tokens: None,
        };
        let cost = calculate_cost("claude-3-5-haiku-20241022", &usage);
        // $0.80 input + $4 output = $4.80
        assert!((cost - 4.8).abs() < 0.001);
    }

    #[test]
    fn test_cache_tokens_included() {
        let usage = Usage {
            input_tokens: 0,
            output_tokens: 0,
            cache_read_input_tokens: Some(1_000_000),
            cache_creation_input_tokens: Some(1_000_000),
        };
        let cost = calculate_cost("claude-sonnet-4-20250514", &usage);
        // $0.30 cache_read + $3.75 cache_write = $4.05
        assert!((cost - 4.05).abs() < 0.001);
    }

    #[test]
    fn test_zero_usage() {
        let usage = Usage::default();
        let cost = calculate_cost("claude-sonnet-4-20250514", &usage);
        assert!((cost - 0.0).abs() < f64::EPSILON);
    }

    #[test]
    fn test_unknown_model_fallback() {
        let usage = Usage {
            input_tokens: 1_000_000,
            output_tokens: 1_000_000,
            cache_read_input_tokens: None,
            cache_creation_input_tokens: None,
        };
        let cost = calculate_cost("some-unknown-model", &usage);
        // Falls back to COST_TIER_5_25: $5 + $25 = $30
        assert!((cost - 30.0).abs() < 0.001);
    }
}
