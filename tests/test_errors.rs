use rust_agent_sdk::ClaudeSDKError;

mod test_error_types {
    use super::*;

    #[test]
    fn test_base_error() {
        let error = ClaudeSDKError::sdk("Something went wrong");
        assert_eq!(format!("{}", error), "Something went wrong");
        assert!(matches!(error, ClaudeSDKError::Sdk(_)));
    }

    #[test]
    fn test_cli_not_found_error() {
        let error = ClaudeSDKError::cli_not_found("Claude Code not found");
        assert!(matches!(error, ClaudeSDKError::CliNotFound(_)));
        let display = format!("{}", error);
        assert!(
            display.contains("Claude Code not found"),
            "expected display to contain 'Claude Code not found', got: {display}"
        );
    }

    #[test]
    fn test_connection_error() {
        let error = ClaudeSDKError::cli_connection("Failed to connect to CLI");
        assert!(matches!(error, ClaudeSDKError::CliConnection(_)));
        let display = format!("{}", error);
        assert!(
            display.contains("Failed to connect to CLI"),
            "expected display to contain 'Failed to connect to CLI', got: {display}"
        );
    }

    #[test]
    fn test_process_error() {
        let error = ClaudeSDKError::process(
            "Process failed",
            Some(1),
            Some("Command not found".to_string()),
        );

        match &error {
            ClaudeSDKError::Process {
                exit_code, stderr, ..
            } => {
                assert_eq!(*exit_code, Some(1));
                assert_eq!(stderr.as_deref(), Some("Command not found"));
            }
            other => panic!("expected Process variant, got: {other:?}"),
        }

        let display = format!("{}", error);
        assert!(
            display.contains("Process failed"),
            "expected display to contain 'Process failed', got: {display}"
        );
        assert!(
            display.contains("exit code: 1"),
            "expected display to contain 'exit code: 1', got: {display}"
        );
        assert!(
            display.contains("Command not found"),
            "expected display to contain 'Command not found', got: {display}"
        );
    }

    #[test]
    fn test_json_decode_error() {
        let bad_json = "{invalid json}";
        let serde_err = serde_json::from_str::<serde_json::Value>(bad_json).unwrap_err();

        let error = ClaudeSDKError::json_decode(bad_json, serde_err);

        match &error {
            ClaudeSDKError::JsonDecode { line, .. } => {
                assert_eq!(line, bad_json);
            }
            other => panic!("expected JsonDecode variant, got: {other:?}"),
        }

        let display = format!("{}", error);
        assert!(
            display.contains("Failed to decode JSON"),
            "expected display to contain 'Failed to decode JSON', got: {display}"
        );
    }

    #[test]
    fn test_message_parse_error() {
        let data = serde_json::json!({"key": "value"});
        let error = ClaudeSDKError::message_parse("Bad message format", Some(data.clone()));

        match &error {
            ClaudeSDKError::MessageParse { message, data: d } => {
                assert_eq!(message, "Bad message format");
                assert_eq!(*d, Some(data));
            }
            other => panic!("expected MessageParse variant, got: {other:?}"),
        }

        let display = format!("{}", error);
        assert!(
            display.contains("Bad message format"),
            "expected display to contain 'Bad message format', got: {display}"
        );
    }

    #[test]
    fn test_message_parse_error_without_data() {
        let error = ClaudeSDKError::message_parse("Parse failed", None);

        match &error {
            ClaudeSDKError::MessageParse { data, .. } => {
                assert!(data.is_none());
            }
            other => panic!("expected MessageParse variant, got: {other:?}"),
        }
    }

    #[test]
    fn test_all_errors_implement_error_trait() {
        fn assert_error<E: std::error::Error>(_: &E) {}

        assert_error(&ClaudeSDKError::sdk("a"));
        assert_error(&ClaudeSDKError::cli_not_found("b"));
        assert_error(&ClaudeSDKError::cli_connection("c"));
        assert_error(&ClaudeSDKError::process("d", None, None));

        let serde_err = serde_json::from_str::<serde_json::Value>("!").unwrap_err();
        assert_error(&ClaudeSDKError::json_decode("!", serde_err));

        assert_error(&ClaudeSDKError::message_parse("e", None));
    }
}
