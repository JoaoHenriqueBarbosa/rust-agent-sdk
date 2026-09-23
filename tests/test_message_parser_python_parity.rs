//! Paridade do parser com o `_internal/message_parser.py` do SDK Python
//! 0.2.93: `deferred_tool_use` e `api_error_status` no `ResultMessage`, e os
//! eventos de hook (`hook_started`/`hook_response`) como `HookEventMessage`.

use prana::{parse_message, DeferredToolUse, Message};
use serde_json::json;

fn result_frame(extra: serde_json::Value) -> serde_json::Value {
    let mut frame = json!({
        "type": "result",
        "subtype": "success",
        "duration_ms": 10,
        "duration_api_ms": 5,
        "is_error": true,
        "num_turns": 1,
        "session_id": "s1",
    });
    for (k, v) in extra.as_object().unwrap() {
        frame[k] = v.clone();
    }
    frame
}

#[test]
fn result_carries_deferred_tool_use_and_api_error_status() {
    let frame = result_frame(json!({
        "deferred_tool_use": {"id": "toolu_1", "name": "Bash", "input": {"command": "ls"}},
        "api_error_status": 529,
    }));
    let Some(Message::Result(result)) = parse_message(&frame).unwrap() else {
        panic!("esperava ResultMessage");
    };
    assert_eq!(
        result.deferred_tool_use,
        Some(DeferredToolUse {
            id: "toolu_1".into(),
            name: "Bash".into(),
            input: json!({"command": "ls"}),
        })
    );
    assert_eq!(result.api_error_status, Some(529));
}

#[test]
fn absent_null_or_empty_deferred_tool_use_is_none() {
    for extra in [
        json!({}),
        json!({"deferred_tool_use": null, "api_error_status": null}),
        json!({"deferred_tool_use": {}}),
    ] {
        let Some(Message::Result(result)) = parse_message(&result_frame(extra)).unwrap() else {
            panic!("esperava ResultMessage");
        };
        assert_eq!(result.deferred_tool_use, None);
        assert_eq!(result.api_error_status, None);
    }
}

#[test]
fn deferred_tool_use_without_input_is_a_parse_error() {
    let frame = result_frame(json!({"deferred_tool_use": {"id": "t", "name": "Bash"}}));
    assert!(parse_message(&frame).is_err());
}

#[test]
fn hook_events_become_hook_event_messages() {
    let frame = json!({
        "type": "system",
        "subtype": "hook_response",
        "hook_event": "",
        "hook_name": "PreToolUse",
        "exit_code": 0,
        "session_id": "s1",
        "uuid": "u1",
    });
    let Some(Message::HookEvent(event)) = parse_message(&frame).unwrap() else {
        panic!("esperava HookEventMessage");
    };
    // `hook_event or hook_name or hook_event_name`: string vazia não conta.
    assert_eq!(event.hook_event_name, "PreToolUse");
    assert_eq!(event.subtype, "hook_response");
    assert_eq!(event.session_id.as_deref(), Some("s1"));
    assert_eq!(event.uuid.as_deref(), Some("u1"));
    assert_eq!(event.data, frame);
    assert!(Message::HookEvent(event).is_system());

    let started = json!({"type": "system", "subtype": "hook_started"});
    let Some(Message::HookEvent(event)) = parse_message(&started).unwrap() else {
        panic!("esperava HookEventMessage");
    };
    assert_eq!(event.hook_event_name, "");
    assert_eq!(event.session_id, None);
}
