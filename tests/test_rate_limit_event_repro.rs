/// Tests that rate_limit_event messages are parsed into typed RateLimitEvent.
///
/// CLI v2.1.45+ emits `rate_limit_event` messages when rate limit status changes
/// for claude.ai subscription users. The Python SDK's message parser originally
/// had no handler for this message type and crashed with MessageParseError. It was
/// then patched to silently return None (#598). This test verifies the full fix:
/// the parser now returns a typed RateLimitEvent so callers can act on warnings.
///
/// Ported from Python: tests/test_rate_limit_event_repro.py (5 tests)
/// ALL tests call `todo!()` methods and will panic — that's expected and correct.

use rust_agent_sdk::parse_message;
use rust_agent_sdk::types::*;
use serde_json::json;

#[cfg(test)]
mod test_rate_limit_event_handling {
    use super::*;

    // 1. test_rate_limit_event_parsed_as_typed_message
    #[test]
    fn test_rate_limit_event_parsed_as_typed_message() {
        // allowed_warning status should be parsed into a RateLimitEvent.
        let data = json!({
            "type": "rate_limit_event",
            "rate_limit_info": {
                "status": "allowed_warning",
                "resetsAt": 1700000000_i64,
                "rateLimitType": "five_hour",
                "utilization": 0.85,
                "isUsingOverage": false
            },
            "uuid": "550e8400-e29b-41d4-a716-446655440000",
            "session_id": "test-session-id"
        });

        let result = parse_message(&data).unwrap();
        let msg = result.expect("expected Some(Message), got None");
        match msg {
            Message::RateLimit(event) => {
                assert_eq!(event.uuid, "550e8400-e29b-41d4-a716-446655440000");
                assert_eq!(event.session_id, "test-session-id");

                let info = &event.rate_limit_info;
                assert_eq!(info.status, RateLimitStatus::AllowedWarning);
                assert_eq!(info.resets_at, Some(1700000000));
                assert_eq!(info.rate_limit_type, Some(RateLimitType::FiveHour));
                assert_eq!(info.utilization, Some(0.85));
                // Unmodeled field preserved in raw
                assert_eq!(info.raw["isUsingOverage"], json!(false));
            }
            other => panic!("expected Message::RateLimit, got {:?}", other),
        }
    }

    // 2. test_rate_limit_event_rejected_parsed
    #[test]
    fn test_rate_limit_event_rejected_parsed() {
        // Hard rate limit (status=rejected) with overage info.
        let data = json!({
            "type": "rate_limit_event",
            "rate_limit_info": {
                "status": "rejected",
                "resetsAt": 1700003600_i64,
                "rateLimitType": "seven_day",
                "isUsingOverage": false,
                "overageStatus": "rejected",
                "overageDisabledReason": "out_of_credits"
            },
            "uuid": "660e8400-e29b-41d4-a716-446655440001",
            "session_id": "test-session-id"
        });

        let result = parse_message(&data).unwrap();
        let msg = result.expect("expected Some(Message), got None");
        match msg {
            Message::RateLimit(event) => {
                assert_eq!(event.rate_limit_info.status, RateLimitStatus::Rejected);
                assert_eq!(
                    event.rate_limit_info.overage_status,
                    Some(RateLimitStatus::Rejected)
                );
                assert_eq!(
                    event.rate_limit_info.overage_disabled_reason.as_deref(),
                    Some("out_of_credits")
                );
            }
            other => panic!("expected Message::RateLimit, got {:?}", other),
        }
    }

    // 3. test_rate_limit_event_minimal_fields
    #[test]
    fn test_rate_limit_event_minimal_fields() {
        // Only status is required; optional fields default to None.
        let data = json!({
            "type": "rate_limit_event",
            "rate_limit_info": {"status": "allowed"},
            "uuid": "770e8400-e29b-41d4-a716-446655440002",
            "session_id": "test-session-id"
        });

        let result = parse_message(&data).unwrap();
        let msg = result.expect("expected Some(Message), got None");
        match msg {
            Message::RateLimit(event) => {
                assert_eq!(event.rate_limit_info.status, RateLimitStatus::Allowed);
                assert_eq!(event.rate_limit_info.resets_at, None);
                assert_eq!(event.rate_limit_info.rate_limit_type, None);
            }
            other => panic!("expected Message::RateLimit, got {:?}", other),
        }
    }

    // 4. test_unknown_message_type_returns_none
    #[test]
    fn test_unknown_message_type_returns_none() {
        // Truly unknown message types still return None for forward compat.
        let data = json!({
            "type": "some_future_event_type",
            "uuid": "880e8400-e29b-41d4-a716-446655440003",
            "session_id": "test-session-id"
        });

        let result = parse_message(&data).unwrap();
        assert!(result.is_none(), "expected None for unknown message type");
    }

    // 5. test_known_message_types_still_parsed
    #[test]
    fn test_known_message_types_still_parsed() {
        // Known message types should still be parsed normally.
        let data = json!({
            "type": "assistant",
            "message": {
                "content": [{"type": "text", "text": "hello"}],
                "model": "claude-sonnet-4-6-20250929"
            }
        });

        let result = parse_message(&data).unwrap();
        let msg = result.expect("expected Some(Message), got None");
        match msg {
            Message::Assistant(a) => {
                assert!(!a.content.is_empty());
                match &a.content[0] {
                    ContentBlock::Text(t) => assert_eq!(t.text, "hello"),
                    other => panic!("expected Text block, got {:?}", other),
                }
            }
            other => panic!("expected Message::Assistant, got {:?}", other),
        }
    }
}
