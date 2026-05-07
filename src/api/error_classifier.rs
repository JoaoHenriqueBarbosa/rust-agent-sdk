// Port of getAssistantMessageFromError from claude-code-js/services/api/errors.js
// Classifies API error responses into user-friendly messages.

/// Classify an API error by HTTP status code and response body into a
/// user-friendly message string.
pub fn classify_api_error(status: u16, body: &str) -> String {
    let body_lower = body.to_lowercase();

    match status {
        429 => "Rate limited. Please wait and try again.".to_string(),
        529 => "API is overloaded. Retrying...".to_string(),
        401 => "Invalid API key. Check your ANTHROPIC_API_KEY.".to_string(),
        403 => "Access denied. Your API key may not have access to this model.".to_string(),
        400 => {
            if body_lower.contains("prompt is too long") || body_lower.contains("too many tokens")
            {
                "The conversation is too long. Use /compact or start a new conversation."
                    .to_string()
            } else if body_lower.contains("credit") {
                "Insufficient credits. Check your Anthropic account balance.".to_string()
            } else {
                body.to_string()
            }
        }
        s if s >= 500 => "API server error. Please try again.".to_string(),
        _ => body.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rate_limited() {
        let msg = classify_api_error(429, r#"{"error":"rate_limit"}"#);
        assert_eq!(msg, "Rate limited. Please wait and try again.");
    }

    #[test]
    fn test_overloaded() {
        let msg = classify_api_error(529, "overloaded");
        assert_eq!(msg, "API is overloaded. Retrying...");
    }

    #[test]
    fn test_invalid_api_key() {
        let msg = classify_api_error(401, "unauthorized");
        assert_eq!(msg, "Invalid API key. Check your ANTHROPIC_API_KEY.");
    }

    #[test]
    fn test_access_denied() {
        let msg = classify_api_error(403, "forbidden");
        assert_eq!(msg, "Access denied. Your API key may not have access to this model.");
    }

    #[test]
    fn test_prompt_too_long() {
        let msg = classify_api_error(400, r#"{"error":"prompt is too long"}"#);
        assert_eq!(
            msg,
            "The conversation is too long. Use /compact or start a new conversation."
        );
    }

    #[test]
    fn test_too_many_tokens() {
        let msg = classify_api_error(400, "Request has too many tokens");
        assert_eq!(
            msg,
            "The conversation is too long. Use /compact or start a new conversation."
        );
    }

    #[test]
    fn test_credit() {
        let msg = classify_api_error(400, r#"{"error":"insufficient credit balance"}"#);
        assert_eq!(
            msg,
            "Insufficient credits. Check your Anthropic account balance."
        );
    }

    #[test]
    fn test_bad_request_default() {
        let body = r#"{"error":"invalid parameter"}"#;
        let msg = classify_api_error(400, body);
        assert_eq!(msg, body);
    }

    #[test]
    fn test_server_error() {
        let msg = classify_api_error(500, "internal server error");
        assert_eq!(msg, "API server error. Please try again.");
    }

    #[test]
    fn test_502_server_error() {
        let msg = classify_api_error(502, "bad gateway");
        assert_eq!(msg, "API server error. Please try again.");
    }

    #[test]
    fn test_unknown_status_returns_body() {
        let body = "some weird error";
        let msg = classify_api_error(418, body);
        assert_eq!(msg, body);
    }
}
