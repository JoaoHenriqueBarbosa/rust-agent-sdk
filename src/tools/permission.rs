/// A single permission rule for a tool.
#[derive(Debug, Clone)]
pub struct ToolPermissionRule {
    pub tool_name: String,
    /// Optional glob pattern to match against input arguments.
    pub pattern: Option<String>,
}

impl ToolPermissionRule {
    /// Parse a CLI-style rule string: `Bash` or `Bash(git *)` — the content
    /// in parentheses is a glob matched against the tool's primary argument
    /// (command for Bash, file_path for file tools, url for WebFetch).
    pub fn parse(rule: &str) -> Self {
        let rule = rule.trim();
        if let Some(open) = rule.find('(') {
            if rule.ends_with(')') {
                let tool_name = rule[..open].trim().to_string();
                let pattern = rule[open + 1..rule.len() - 1].trim().to_string();
                return Self {
                    tool_name,
                    pattern: if pattern.is_empty() { None } else { Some(pattern) },
                };
            }
        }
        Self {
            tool_name: rule.to_string(),
            pattern: None,
        }
    }

    /// Whether this rule matches the given invocation. A rule without a
    /// pattern matches every invocation of the tool; with a pattern, the
    /// tool's primary string argument must match the glob.
    fn matches(&self, tool_name: &str, input: &serde_json::Value) -> bool {
        if self.tool_name != "*" && self.tool_name != tool_name {
            return false;
        }
        match &self.pattern {
            None => true,
            Some(pattern) => primary_argument(tool_name, input)
                .map(|arg| glob_match(pattern, &arg))
                .unwrap_or(false),
        }
    }
}

/// The argument a rule pattern is matched against — the same convention the
/// CLI uses for rule content: the command for Bash, the path for file tools,
/// the URL for web tools.
fn primary_argument(tool_name: &str, input: &serde_json::Value) -> Option<String> {
    let key = match tool_name {
        "Bash" => "command",
        "WebFetch" | "WebSearch" => "url",
        _ => "file_path",
    };
    input
        .get(key)
        .and_then(|v| v.as_str())
        .map(str::to_string)
        .or_else(|| {
            // Fallback: qualquer primeiro campo string do input.
            input.as_object().and_then(|obj| {
                obj.values()
                    .find_map(|v| v.as_str().map(str::to_string))
            })
        })
}

/// Minimal glob: `*` matches any run of characters (including empty), other
/// characters match literally. Enough for CLI-style rules like `git *`.
fn glob_match(pattern: &str, text: &str) -> bool {
    fn inner(p: &[char], t: &[char]) -> bool {
        match p.split_first() {
            None => t.is_empty(),
            Some(('*', rest)) => (0..=t.len()).any(|i| inner(rest, &t[i..])),
            Some((c, rest)) => t.split_first().map(|(tc, tr)| tc == c && inner(rest, tr)).unwrap_or(false),
        }
    }
    let p: Vec<char> = pattern.chars().collect();
    let t: Vec<char> = text.chars().collect();
    inner(&p, &t)
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

    /// Build rules from CLI-style `allowed_tools`/`disallowed_tools` lists
    /// (entries like `"Read"` or `"Bash(git *)"`).
    pub fn from_lists(allowed: &[String], disallowed: &[String]) -> Self {
        Self {
            allow: allowed.iter().map(|r| ToolPermissionRule::parse(r)).collect(),
            deny: disallowed.iter().map(|r| ToolPermissionRule::parse(r)).collect(),
        }
    }

    /// Add an allow rule.
    pub fn add_allow(&mut self, tool_name: impl Into<String>) {
        self.allow.push(ToolPermissionRule::parse(&tool_name.into()));
    }

    /// Add a deny rule.
    pub fn add_deny(&mut self, tool_name: impl Into<String>) {
        self.deny.push(ToolPermissionRule::parse(&tool_name.into()));
    }

    /// A tool denied UNCONDITIONALLY (bare deny rule, no pattern) should not
    /// even be offered to the model — this is what registry filtering asks.
    pub fn is_tool_fully_denied(&self, tool_name: &str) -> bool {
        self.deny
            .iter()
            .any(|r| r.pattern.is_none() && (r.tool_name == "*" || r.tool_name == tool_name))
    }

    /// Check whether a tool invocation is allowed.
    /// Deny rules take precedence over allow rules.
    pub fn check(&self, tool_name: &str, input: &serde_json::Value) -> PermissionDecision {
        // Check deny rules first (deny takes precedence)
        for rule in &self.deny {
            if rule.matches(tool_name, input) {
                return PermissionDecision::Deny(format!("Tool '{}' is denied by rule", tool_name));
            }
        }

        // Check allow rules
        for rule in &self.allow {
            if rule.matches(tool_name, input) {
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

    #[test]
    fn pattern_rule_matches_the_command_glob() {
        let rules = PermissionRules::from_lists(&["Bash(git *)".to_string()], &[]);
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "git status"})),
            PermissionDecision::Allow
        );
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "rm -rf /"})),
            PermissionDecision::Ask
        );
    }

    #[test]
    fn pattern_deny_only_blocks_matching_invocations() {
        let rules = PermissionRules::from_lists(&[], &["Bash(rm *)".to_string()]);
        assert!(matches!(
            rules.check("Bash", &serde_json::json!({"command": "rm -rf x"})),
            PermissionDecision::Deny(_)
        ));
        assert_eq!(
            rules.check("Bash", &serde_json::json!({"command": "ls"})),
            PermissionDecision::Ask
        );
        // Deny com pattern NÃO remove a tool do registry.
        assert!(!rules.is_tool_fully_denied("Bash"));
    }

    #[test]
    fn bare_deny_marks_the_tool_fully_denied() {
        let rules = PermissionRules::from_lists(&[], &["WebFetch".to_string()]);
        assert!(rules.is_tool_fully_denied("WebFetch"));
        assert!(!rules.is_tool_fully_denied("Read"));
    }

    #[test]
    fn glob_matcher_basics() {
        assert!(glob_match("git *", "git push origin"));
        assert!(glob_match("*", ""));
        assert!(glob_match("a*c", "abc"));
        assert!(!glob_match("a*c", "abd"));
    }
}
