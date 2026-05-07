/// A single permission rule for a tool.
#[derive(Debug, Clone)]
pub struct ToolPermissionRule {
    pub tool_name: String,
    /// Optional glob pattern to match against input arguments.
    pub pattern: Option<String>,
}

/// Permission rules: explicit allow/deny lists.
#[derive(Debug, Clone, Default)]
pub struct PermissionRules {
    pub allow: Vec<ToolPermissionRule>,
    pub deny: Vec<ToolPermissionRule>,
}

/// Result of checking permissions for a tool invocation.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PermissionDecision {
    /// Tool is explicitly allowed.
    Allow,
    /// Tool is explicitly denied with a reason.
    Deny(String),
    /// Permission must be requested from the user.
    Ask,
}

impl PermissionRules {
    pub fn new() -> Self {
        Self::default()
    }

    /// Allow all tools (bypass permissions).
    pub fn allow_all() -> Self {
        Self {
            allow: vec![ToolPermissionRule {
                tool_name: "*".to_string(),
                pattern: None,
            }],
            deny: vec![],
        }
    }

    /// Add an allow rule.
    pub fn add_allow(&mut self, tool_name: impl Into<String>) {
        self.allow.push(ToolPermissionRule {
            tool_name: tool_name.into(),
            pattern: None,
        });
    }

    /// Add a deny rule.
    pub fn add_deny(&mut self, tool_name: impl Into<String>) {
        self.deny.push(ToolPermissionRule {
            tool_name: tool_name.into(),
            pattern: None,
        });
    }

    /// Check whether a tool invocation is allowed.
    /// Deny rules take precedence over allow rules.
    pub fn check(&self, tool_name: &str, _input: &serde_json::Value) -> PermissionDecision {
        // Check deny rules first (deny takes precedence)
        for rule in &self.deny {
            if rule.tool_name == "*" || rule.tool_name == tool_name {
                return PermissionDecision::Deny(format!("Tool '{}' is denied by rule", tool_name));
            }
        }

        // Check allow rules
        for rule in &self.allow {
            if rule.tool_name == "*" || rule.tool_name == tool_name {
                return PermissionDecision::Allow;
            }
        }

        // No explicit rule: need to ask
        PermissionDecision::Ask
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_allow_all() {
        let rules = PermissionRules::allow_all();
        assert_eq!(
            rules.check("anything", &serde_json::json!({})),
            PermissionDecision::Allow
        );
    }

    #[test]
    fn test_deny_takes_precedence() {
        let mut rules = PermissionRules::new();
        rules.add_allow("Bash");
        rules.add_deny("Bash");

        assert!(matches!(
            rules.check("Bash", &serde_json::json!({})),
            PermissionDecision::Deny(_)
        ));
    }

    #[test]
    fn test_specific_allow() {
        let mut rules = PermissionRules::new();
        rules.add_allow("Read");

        assert_eq!(
            rules.check("Read", &serde_json::json!({})),
            PermissionDecision::Allow
        );
        assert_eq!(
            rules.check("Write", &serde_json::json!({})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn test_no_rules_defaults_to_ask() {
        let rules = PermissionRules::new();
        assert_eq!(
            rules.check("Bash", &serde_json::json!({})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn test_wildcard_deny() {
        let mut rules = PermissionRules::new();
        rules.add_deny("*");

        assert!(matches!(
            rules.check("anything", &serde_json::json!({})),
            PermissionDecision::Deny(_)
        ));
    }
}
