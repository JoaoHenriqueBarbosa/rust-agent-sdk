//! Validação do input de uma tool contra o JSON Schema dela, com os issues
//! na forma do zod v4 que o CLI usa, e a mensagem formatada como o
//! `formatZodValidationError` de `utils/toolErrors.js`.
//!
//! O CLI valida com `tool.inputSchema.safeParse(input)` ANTES de qualquer
//! checagem de permissão; a falha vira o tool_result
//! `<tool_use_error>InputValidationError: ...</tool_use_error>` e o
//! `tool_use_result` `InputValidationError: <issues em JSON>`. O schema que
//! a API recebe é o `z.toJSONSchema` do mesmo zod, então validar contra o
//! JSON Schema cobre as mesmas regras: tipos, obrigatórios,
//! `additionalProperties: false` (os `strictObject`), `enum`/`const`,
//! tamanhos e limites numéricos.

use serde_json::{json, Map, Value};

/// Um issue na forma do zod v4 (a ordem das chaves é a do zod).
pub type SchemaIssue = Value;

fn parsed_type(value: &Value) -> &'static str {
    match value {
        Value::Null => "null",
        Value::Bool(_) => "boolean",
        Value::Number(_) => "number",
        Value::String(_) => "string",
        Value::Array(_) => "array",
        Value::Object(_) => "object",
    }
}

fn path_value(path: &[Value]) -> Value {
    Value::Array(path.to_vec())
}

fn invalid_type(expected: &str, received: Option<&Value>, path: &[Value]) -> SchemaIssue {
    let received_name = received.map(parsed_type).unwrap_or("undefined");
    let mut issue = Map::new();
    issue.insert("expected".into(), json!(expected));
    issue.insert("code".into(), json!("invalid_type"));
    issue.insert("path".into(), path_value(path));
    issue.insert(
        "message".into(),
        json!(format!(
            "Invalid input: expected {expected}, received {received_name}"
        )),
    );
    Value::Object(issue)
}

fn js_number(n: f64) -> String {
    if n.fract() == 0.0 && n.abs() < 1e21 {
        format!("{}", n as i64)
    } else {
        format!("{n}")
    }
}

fn number_value(n: f64) -> Value {
    if n.fract() == 0.0 && n.abs() < 9.007_199_254_740_992e15 {
        json!(n as i64)
    } else {
        json!(n)
    }
}

fn too_small(origin: &str, minimum: f64, inclusive: bool, path: &[Value]) -> SchemaIssue {
    let op = if inclusive { ">=" } else { ">" };
    let message = match origin {
        "string" => format!(
            "Too small: expected string to have {op}{} characters",
            js_number(minimum)
        ),
        "array" => format!(
            "Too small: expected array to have {op}{} items",
            js_number(minimum)
        ),
        _ => format!(
            "Too small: expected number to be {op}{}",
            js_number(minimum)
        ),
    };
    let mut issue = Map::new();
    issue.insert("origin".into(), json!(origin));
    issue.insert("code".into(), json!("too_small"));
    issue.insert("minimum".into(), number_value(minimum));
    issue.insert("inclusive".into(), json!(inclusive));
    issue.insert("path".into(), path_value(path));
    issue.insert("message".into(), json!(message));
    Value::Object(issue)
}

fn too_big(origin: &str, maximum: f64, inclusive: bool, path: &[Value]) -> SchemaIssue {
    let op = if inclusive { "<=" } else { "<" };
    let message = match origin {
        "string" => format!(
            "Too big: expected string to have {op}{} characters",
            js_number(maximum)
        ),
        "array" => format!(
            "Too big: expected array to have {op}{} items",
            js_number(maximum)
        ),
        _ => format!("Too big: expected number to be {op}{}", js_number(maximum)),
    };
    let mut issue = Map::new();
    issue.insert("origin".into(), json!(origin));
    issue.insert("code".into(), json!("too_big"));
    issue.insert("maximum".into(), number_value(maximum));
    issue.insert("inclusive".into(), json!(inclusive));
    issue.insert("path".into(), path_value(path));
    issue.insert("message".into(), json!(message));
    Value::Object(issue)
}

fn stringify_primitive(v: &Value) -> String {
    match v {
        Value::String(s) => format!("\"{s}\""),
        other => other.to_string(),
    }
}

fn invalid_value(values: &[Value], path: &[Value]) -> SchemaIssue {
    let message = if values.len() == 1 {
        format!(
            "Invalid input: expected {}",
            stringify_primitive(&values[0])
        )
    } else {
        format!(
            "Invalid option: expected one of {}",
            values
                .iter()
                .map(stringify_primitive)
                .collect::<Vec<_>>()
                .join("|")
        )
    };
    let mut issue = Map::new();
    issue.insert("code".into(), json!("invalid_value"));
    issue.insert("values".into(), Value::Array(values.to_vec()));
    issue.insert("path".into(), path_value(path));
    issue.insert("message".into(), json!(message));
    Value::Object(issue)
}

fn unrecognized_keys(keys: &[String], path: &[Value]) -> SchemaIssue {
    let quoted: Vec<String> = keys.iter().map(|k| format!("\"{k}\"")).collect();
    let message = if keys.len() == 1 {
        format!("Unrecognized key: {}", quoted[0])
    } else {
        format!("Unrecognized keys: {}", quoted.join(", "))
    };
    let mut issue = Map::new();
    issue.insert("code".into(), json!("unrecognized_keys"));
    issue.insert("keys".into(), json!(keys));
    issue.insert("path".into(), path_value(path));
    issue.insert("message".into(), json!(message));
    Value::Object(issue)
}

/// Issue `custom` (o `.refine` do zod), para as tools que refinam o schema.
pub fn custom_issue(message: &str, path: &[Value]) -> SchemaIssue {
    let mut issue = Map::new();
    issue.insert("code".into(), json!("custom"));
    issue.insert("path".into(), path_value(path));
    issue.insert("message".into(), json!(message));
    Value::Object(issue)
}

/// O tipo "principal" de um schema, para o `expected` do zod.
fn schema_type(schema: &Value) -> Option<String> {
    match schema.get("type") {
        Some(Value::String(t)) => Some(t.clone()),
        Some(Value::Array(types)) => types
            .iter()
            .filter_map(Value::as_str)
            .find(|t| *t != "null")
            .map(str::to_string),
        _ => None,
    }
}

fn type_accepts(declared: &str, value: &Value) -> bool {
    match declared {
        "string" => value.is_string(),
        "number" => value.is_number(),
        "integer" => value.is_number(),
        "boolean" => value.is_boolean(),
        "array" => value.is_array(),
        "object" => value.is_object(),
        "null" => value.is_null(),
        _ => true,
    }
}

fn nullable(schema: &Value) -> bool {
    match schema.get("type") {
        Some(Value::Array(types)) => types.iter().any(|t| t == "null"),
        _ => false,
    }
}

/// Valida `value` contra `schema` e acumula os issues (na ordem do zod:
/// propriedades na ordem do schema, chaves não reconhecidas no fim).
pub fn validate_value(
    value: Option<&Value>,
    schema: &Value,
    path: &mut Vec<Value>,
    issues: &mut Vec<SchemaIssue>,
) {
    // anyOf/oneOf: aceita se algum ramo aceitar.
    if let Some(branches) = schema
        .get("anyOf")
        .or_else(|| schema.get("oneOf"))
        .and_then(Value::as_array)
    {
        if let Some(v) = value {
            let ok = branches.iter().any(|b| {
                let mut local = Vec::new();
                validate_value(Some(v), b, &mut path.clone(), &mut local);
                local.is_empty()
            });
            if !ok {
                let mut issue = Map::new();
                issue.insert("code".into(), json!("invalid_union"));
                issue.insert("errors".into(), json!([]));
                issue.insert("path".into(), path_value(path));
                issue.insert("message".into(), json!("Invalid input"));
                issues.push(Value::Object(issue));
            }
            return;
        }
    }
    if let Some(values) = schema.get("enum").and_then(Value::as_array) {
        match value {
            Some(v) if values.contains(v) => {}
            _ => issues.push(invalid_value(values, path)),
        }
        return;
    }
    if let Some(constant) = schema.get("const") {
        match value {
            Some(v) if v == constant => {}
            _ => issues.push(invalid_value(std::slice::from_ref(constant), path)),
        }
        return;
    }
    let declared = schema_type(schema);
    let Some(v) = value else {
        if let Some(t) = declared {
            let expected = if t == "integer" {
                "number".to_string()
            } else {
                t
            };
            issues.push(invalid_type(&expected, None, path));
        }
        return;
    };
    if v.is_null() && nullable(schema) {
        return;
    }
    let Some(declared) = declared else {
        return;
    };
    if !type_accepts(&declared, v) {
        let expected = if declared == "integer" {
            "number"
        } else {
            declared.as_str()
        };
        issues.push(invalid_type(expected, Some(v), path));
        return;
    }
    match declared.as_str() {
        "string" => {
            let s = v.as_str().unwrap_or_default();
            // O zod mede em unidades UTF-16, como o `length` do JS.
            let len = s.encode_utf16().count() as f64;
            if let Some(min) = schema.get("minLength").and_then(Value::as_f64) {
                if len < min {
                    issues.push(too_small("string", min, true, path));
                }
            }
            if let Some(max) = schema.get("maxLength").and_then(Value::as_f64) {
                if len > max {
                    issues.push(too_big("string", max, true, path));
                }
            }
        }
        "number" | "integer" => {
            let n = v.as_f64().unwrap_or_default();
            if declared == "integer" && n.fract() != 0.0 {
                let mut issue = Map::new();
                issue.insert("expected".into(), json!("int"));
                issue.insert("format".into(), json!("safeint"));
                issue.insert("code".into(), json!("invalid_type"));
                issue.insert("path".into(), path_value(path));
                issue.insert(
                    "message".into(),
                    json!("Invalid input: expected int, received number"),
                );
                issues.push(Value::Object(issue));
                return;
            }
            if let Some(min) = schema.get("minimum").and_then(Value::as_f64) {
                if n < min {
                    issues.push(too_small("number", min, true, path));
                }
            }
            if let Some(min) = schema.get("exclusiveMinimum").and_then(Value::as_f64) {
                if n <= min {
                    issues.push(too_small("number", min, false, path));
                }
            }
            if let Some(max) = schema.get("maximum").and_then(Value::as_f64) {
                if n > max {
                    issues.push(too_big("number", max, true, path));
                }
            }
            if let Some(max) = schema.get("exclusiveMaximum").and_then(Value::as_f64) {
                if n >= max {
                    issues.push(too_big("number", max, false, path));
                }
            }
        }
        "array" => {
            let items = v.as_array().cloned().unwrap_or_default();
            if let Some(item_schema) = schema.get("items") {
                for (i, item) in items.iter().enumerate() {
                    path.push(json!(i));
                    validate_value(Some(item), item_schema, path, issues);
                    path.pop();
                }
            }
            let len = items.len() as f64;
            if let Some(min) = schema.get("minItems").and_then(Value::as_f64) {
                if len < min {
                    issues.push(too_small("array", min, true, path));
                }
            }
            if let Some(max) = schema.get("maxItems").and_then(Value::as_f64) {
                if len > max {
                    issues.push(too_big("array", max, true, path));
                }
            }
        }
        "object" => {
            let obj = v.as_object().cloned().unwrap_or_default();
            let required: Vec<&str> = schema
                .get("required")
                .and_then(Value::as_array)
                .map(|r| r.iter().filter_map(Value::as_str).collect())
                .unwrap_or_default();
            let properties = schema.get("properties").and_then(Value::as_object);
            if let Some(props) = properties {
                for (name, prop_schema) in props {
                    let present = obj.get(name);
                    // Campo com `default` aparece em `required` no schema de
                    // saída do zod, mas no parse o zod preenche o default:
                    // ausente não é erro.
                    if present.is_none()
                        && (!required.contains(&name.as_str())
                            || prop_schema.get("default").is_some())
                    {
                        continue;
                    }
                    path.push(json!(name));
                    validate_value(present, prop_schema, path, issues);
                    path.pop();
                }
            }
            match schema.get("additionalProperties") {
                Some(Value::Bool(false)) => {
                    let unknown: Vec<String> = obj
                        .keys()
                        .filter(|k| properties.map(|p| !p.contains_key(*k)).unwrap_or(true))
                        .cloned()
                        .collect();
                    if !unknown.is_empty() {
                        issues.push(unrecognized_keys(&unknown, path));
                    }
                }
                Some(extra @ Value::Object(_)) => {
                    for (k, val) in &obj {
                        if properties.map(|p| p.contains_key(k)).unwrap_or(false) {
                            continue;
                        }
                        path.push(json!(k));
                        validate_value(Some(val), extra, path, issues);
                        path.pop();
                    }
                }
                _ => {}
            }
        }
        _ => {}
    }
}

/// Valida o input inteiro e devolve os issues (vazio = válido).
pub fn validate_input(input: &Value, schema: &Value) -> Vec<SchemaIssue> {
    let mut issues = Vec::new();
    validate_value(Some(input), schema, &mut Vec::new(), &mut issues);
    issues
}

/// `formatValidationPath` do JS.
fn format_validation_path(path: &[Value]) -> String {
    let mut out = String::new();
    for (i, segment) in path.iter().enumerate() {
        match segment {
            Value::Number(n) => out.push_str(&format!("[{n}]")),
            Value::String(s) => {
                if i == 0 {
                    out.push_str(s);
                } else {
                    out.push('.');
                    out.push_str(s);
                }
            }
            other => out.push_str(&other.to_string()),
        }
    }
    out
}

/// O `message` de um ZodError: os issues em JSON com indentação 2, como o
/// `JSON.stringify(issues, null, 2)` do zod v4.
pub fn zod_error_message(issues: &[SchemaIssue]) -> String {
    serde_json::to_string_pretty(&Value::Array(issues.to_vec())).unwrap_or_default()
}

/// `formatZodValidationError(toolName, error)` de `utils/toolErrors.js`.
pub fn format_zod_validation_error(tool_name: &str, issues: &[SchemaIssue]) -> String {
    let message_of = |i: &Value| {
        i.get("message")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string()
    };
    let path_of = |i: &Value| {
        i.get("path")
            .and_then(Value::as_array)
            .map(|p| format_validation_path(p))
            .unwrap_or_default()
    };
    let is_invalid_type = |i: &Value| i.get("code").and_then(Value::as_str) == Some("invalid_type");
    let missing: Vec<String> = issues
        .iter()
        .filter(|i| is_invalid_type(i) && message_of(i).contains("received undefined"))
        .map(path_of)
        .collect();
    let unexpected: Vec<String> = issues
        .iter()
        .filter(|i| i.get("code").and_then(Value::as_str) == Some("unrecognized_keys"))
        .flat_map(|i| {
            i.get("keys")
                .and_then(Value::as_array)
                .map(|k| {
                    k.iter()
                        .filter_map(Value::as_str)
                        .map(str::to_string)
                        .collect::<Vec<_>>()
                })
                .unwrap_or_default()
        })
        .collect();
    let mismatches: Vec<(String, String, String)> = issues
        .iter()
        .filter(|i| is_invalid_type(i) && !message_of(i).contains("received undefined"))
        .map(|i| {
            let message = message_of(i);
            let received = message
                .split("received ")
                .nth(1)
                .map(|rest| {
                    rest.chars()
                        .take_while(|c| c.is_alphanumeric() || *c == '_')
                        .collect::<String>()
                })
                .filter(|s| !s.is_empty())
                .unwrap_or_else(|| "unknown".to_string());
            let expected = i
                .get("expected")
                .and_then(Value::as_str)
                .unwrap_or_default()
                .to_string();
            (path_of(i), expected, received)
        })
        .collect();
    let mut parts: Vec<String> = Vec::new();
    for p in &missing {
        parts.push(format!("The required parameter `{p}` is missing"));
    }
    for p in &unexpected {
        parts.push(format!("An unexpected parameter `{p}` was provided"));
    }
    for (p, expected, received) in &mismatches {
        parts.push(format!(
            "The parameter `{p}` type is expected as `{expected}` but provided as `{received}`"
        ));
    }
    if parts.is_empty() {
        return zod_error_message(issues);
    }
    format!(
        "{tool_name} failed due to the following {}:\n{}",
        if parts.len() > 1 { "issues" } else { "issue" },
        parts.join("\n")
    )
}

/// `semanticNumber` do JS: string numérica vira número antes da validação.
pub fn semantic_number(value: &Value) -> Value {
    if let Value::String(s) = value {
        static RE: std::sync::OnceLock<regex::Regex> = std::sync::OnceLock::new();
        let re = RE.get_or_init(|| regex::Regex::new(r"^-?\d+(\.\d+)?$").expect("regex"));
        if re.is_match(s) {
            if let Ok(n) = s.parse::<f64>() {
                if n.is_finite() {
                    return number_value(n);
                }
            }
        }
    }
    value.clone()
}

/// `semanticBoolean` do JS: `"true"`/`"false"` viram booleanos.
pub fn semantic_boolean(value: &Value) -> Value {
    match value {
        Value::String(s) if s == "true" => Value::Bool(true),
        Value::String(s) if s == "false" => Value::Bool(false),
        other => other.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn read_schema() -> Value {
        json!({
            "type": "object",
            "properties": {
                "file_path": {"type": "string"},
                "offset": {"type": "integer", "minimum": 0, "maximum": 9007199254740991i64},
                "limit": {"type": "integer", "exclusiveMinimum": 0, "maximum": 9007199254740991i64},
                "pages": {"type": "string"}
            },
            "required": ["file_path"],
            "additionalProperties": false
        })
    }

    #[test]
    fn matches_the_cli_capture_for_type_and_unknown_key() {
        // Capturado do CLI 2.1.90: `{"file_path": 5, "bogus": 1}` no Read.
        let issues = validate_input(&json!({"file_path": 5, "bogus": 1}), &read_schema());
        assert_eq!(
            format_zod_validation_error("Read", &issues),
            "Read failed due to the following issues:\nAn unexpected parameter `bogus` was provided\nThe parameter `file_path` type is expected as `string` but provided as `number`"
        );
        assert_eq!(
            zod_error_message(&issues),
            "[\n  {\n    \"expected\": \"string\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"file_path\"\n    ],\n    \"message\": \"Invalid input: expected string, received number\"\n  },\n  {\n    \"code\": \"unrecognized_keys\",\n    \"keys\": [\n      \"bogus\"\n    ],\n    \"path\": [],\n    \"message\": \"Unrecognized key: \\\"bogus\\\"\"\n  }\n]"
        );
    }

    #[test]
    fn missing_required_is_reported_as_missing() {
        let issues = validate_input(&json!({}), &read_schema());
        assert_eq!(
            format_zod_validation_error("Read", &issues),
            "Read failed due to the following issue:\nThe required parameter `file_path` is missing"
        );
    }

    #[test]
    fn range_issues_fall_back_to_the_raw_zod_message() {
        let issues = validate_input(&json!({"file_path": "/x", "limit": 0}), &read_schema());
        let text = format_zod_validation_error("Read", &issues);
        assert!(text.contains("\"code\": \"too_small\""), "{text}");
        assert!(
            text.contains("Too small: expected number to be >0"),
            "{text}"
        );
    }

    #[test]
    fn required_field_with_default_may_be_absent() {
        let schema = json!({
            "type": "object",
            "properties": {"block": {"type": "boolean", "default": true}},
            "required": ["block"],
            "additionalProperties": false
        });
        assert!(validate_input(&json!({}), &schema).is_empty());
        assert!(!validate_input(&json!({"block": "x"}), &schema).is_empty());
    }

    #[test]
    fn semantic_number_coerces_numeric_strings_only() {
        assert_eq!(semantic_number(&json!("10")), json!(10));
        assert_eq!(semantic_number(&json!("1.5")), json!(1.5));
        assert_eq!(semantic_number(&json!("dez")), json!("dez"));
    }
}
