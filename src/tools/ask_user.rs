//! `AskUserQuestion`: pergunta ao usuário pelo canal de permissão.
//!
//! Referências JS: `tools/AskUserQuestionTool/AskUserQuestionTool.js` (schema,
//! refinamento de unicidade, `requiresUserInteraction`, `checkPermissions`
//! com `ask` "Answer questions?", o `data` e o texto do resultado) e
//! `tools/AskUserQuestionTool/prompt.js` (o prompt; a seção de preview só
//! entra quando `CLAUDE_CODE_QUESTION_PREVIEW_FORMAT` pede, porque numa
//! sessão SDK o `main.js` não define formato de preview).
//!
//! O cliente responde pelo `can_use_tool`: `allow` com `updatedInput`
//! trazendo `answers` (e opcionalmente `annotations`). A execução só formata
//! o que chegou; sem `answers` o resultado sai vazio, sem erro, como no JS.

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::permission::{PermissionAsk, PermissionResult, PermissionRules};
use crate::tools::schema_validation::custom_issue;

pub struct AskUserQuestionTool;

/// O formato de preview das opções (`getQuestionPreviewFormat`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum QuestionPreviewFormat {
    Markdown,
    Html,
}

/// O formato vigente: só `CLAUDE_CODE_QUESTION_PREVIEW_FORMAT` define numa
/// sessão SDK (o JS só liga `markdown` sozinho fora dos clientes `sdk-*`).
pub fn question_preview_format() -> Option<QuestionPreviewFormat> {
    match std::env::var("CLAUDE_CODE_QUESTION_PREVIEW_FORMAT")
        .ok()
        .as_deref()
    {
        Some("markdown") => Some(QuestionPreviewFormat::Markdown),
        Some("html") => Some(QuestionPreviewFormat::Html),
        _ => None,
    }
}

const PROMPT: &str = r###"Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ExitPlanMode for plan approval. IMPORTANT: Do not reference "the plan" in your questions (e.g., "Do you have feedback about the plan?", "Does the plan look good?") because the user cannot see the plan in the UI until you call ExitPlanMode. If you need plan approval, use ExitPlanMode instead.
"###;

const PREVIEW_MARKDOWN: &str = r###"
Preview feature:
Use the optional `preview` field on options when presenting concrete artifacts that users need to visually compare:
- ASCII mockups of UI layouts or components
- Code snippets showing different implementations
- Diagram variations
- Configuration examples

Preview content is rendered as markdown in a monospace box. Multi-line text with newlines is supported. When any option has a preview, the UI switches to a side-by-side layout with a vertical option list on the left and preview on the right. Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
"###;

const PREVIEW_HTML: &str = r###"
Preview feature:
Use the optional `preview` field on options when presenting concrete artifacts that users need to visually compare:
- HTML mockups of UI layouts or components
- Formatted code snippets showing different implementations
- Visual comparisons or diagrams

Preview content must be a self-contained HTML fragment (no <html>/<body> wrapper, no <script> or <style> tags [[EM]] use inline style attributes instead). Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
"###;

/// O prompt do JS para o formato de preview dado.
pub fn ask_user_question_prompt(format: Option<QuestionPreviewFormat>) -> String {
    match format {
        None => PROMPT.to_string(),
        Some(QuestionPreviewFormat::Markdown) => format!("{PROMPT}{PREVIEW_MARKDOWN}"),
        Some(QuestionPreviewFormat::Html) => {
            format!(
                "{PROMPT}{}",
                crate::tools::agent::with_js_dashes(PREVIEW_HTML)
            )
        }
    }
}

fn prompt_for_env() -> &'static str {
    static CACHE: std::sync::OnceLock<String> = std::sync::OnceLock::new();
    CACHE.get_or_init(|| ask_user_question_prompt(question_preview_format()))
}

fn option_schema() -> Value {
    json!({
        "type": "object",
        "properties": {
            "label": {
                "description": "The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice.",
                "type": "string"
            },
            "description": {
                "description": "Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications.",
                "type": "string"
            },
            "preview": {
                "description": "Optional preview content rendered when this option is focused. Use for mockups, code snippets, or visual comparisons that help users compare options. See the tool description for the expected content format.",
                "type": "string"
            }
        },
        "required": ["label", "description"],
        "additionalProperties": false
    })
}

fn question_schema() -> Value {
    json!({
        "type": "object",
        "properties": {
            "question": {
                "description": "The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: \"Which library should we use for date formatting?\" If multiSelect is true, phrase it accordingly, e.g. \"Which features do you want to enable?\"",
                "type": "string"
            },
            "header": {
                "description": "Very short label displayed as a chip/tag (max 12 chars). Examples: \"Auth method\", \"Library\", \"Approach\".",
                "type": "string"
            },
            "options": {
                "description": "The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically.",
                "minItems": 2,
                "maxItems": 4,
                "type": "array",
                "items": option_schema()
            },
            "multiSelect": {
                "description": "Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.",
                "default": false,
                "type": "boolean"
            }
        },
        "required": ["question", "header", "options", "multiSelect"],
        "additionalProperties": false
    })
}

/// O input schema exato do JS (`z.toJSONSchema`).
pub fn ask_user_question_schema() -> Value {
    json!({
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "questions": {
                "description": "Questions to ask the user (1-4 questions)",
                "minItems": 1,
                "maxItems": 4,
                "type": "array",
                "items": question_schema()
            },
            "answers": {
                "description": "User answers collected by the permission component",
                "type": "object",
                "propertyNames": {"type": "string"},
                "additionalProperties": {"type": "string"}
            },
            "annotations": {
                "description": "Optional per-question annotations from the user (e.g., notes on preview selections). Keyed by question text.",
                "type": "object",
                "propertyNames": {"type": "string"},
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "preview": {
                            "description": "The preview content of the selected option, if the question used previews.",
                            "type": "string"
                        },
                        "notes": {
                            "description": "Free-text notes the user added to their selection.",
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
                }
            },
            "metadata": {
                "description": "Optional metadata for tracking and analytics purposes. Not displayed to user.",
                "type": "object",
                "properties": {
                    "source": {
                        "description": "Optional identifier for the source of this question (e.g., \"remember\" for /remember command). Used for analytics tracking.",
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        },
        "required": ["questions"],
        "additionalProperties": false
    })
}

/// Mantém só as chaves conhecidas de um objeto (o `strip` do `z.object`).
fn strip_object(value: &Value, keys: &[&str]) -> Value {
    match value {
        Value::Object(map) => {
            let mut out = Map::new();
            for key in keys {
                if let Some(v) = map.get(*key) {
                    out.insert((*key).to_string(), v.clone());
                }
            }
            Value::Object(out)
        }
        other => other.clone(),
    }
}

/// O que o zod faz no parse além de validar: `multiSelect` ganha o default
/// `false`, e as chaves desconhecidas das questões, opções, anotações e do
/// `metadata` (objetos não estritos) somem. A raiz é `strictObject`, então as
/// chaves desconhecidas dela continuam e viram erro na validação.
fn normalize_input(input: Value) -> Value {
    let Value::Object(mut root) = input else {
        return input;
    };
    if let Some(Value::Array(questions)) = root.get_mut("questions") {
        for question in questions.iter_mut() {
            if !question.is_object() {
                continue;
            }
            let mut q = strip_object(question, &["question", "header", "options", "multiSelect"]);
            if let Some(map) = q.as_object_mut() {
                if let Some(Value::Array(options)) = map.get_mut("options") {
                    for option in options.iter_mut() {
                        if option.is_object() {
                            *option = strip_object(option, &["label", "description", "preview"]);
                        }
                    }
                }
                if !map.contains_key("multiSelect") {
                    map.insert("multiSelect".into(), Value::Bool(false));
                }
            }
            *question = q;
        }
    }
    if let Some(Value::Object(annotations)) = root.get_mut("annotations") {
        for value in annotations.values_mut() {
            if value.is_object() {
                *value = strip_object(value, &["preview", "notes"]);
            }
        }
    }
    if let Some(metadata) = root.get_mut("metadata") {
        if metadata.is_object() {
            *metadata = strip_object(metadata, &["source"]);
        }
    }
    Value::Object(root)
}

/// `validateHtmlPreview`.
fn validate_html_preview(preview: Option<&str>) -> Option<&'static str> {
    let preview = preview?;
    let lower = preview.to_lowercase();
    let full_document = regex::Regex::new(r"(?i)<\s*(html|body|!doctype)\b").expect("regex");
    if full_document.is_match(preview) {
        return Some("preview must be an HTML fragment, not a full document (no <html>, <body>, or <!DOCTYPE>)");
    }
    let script = regex::Regex::new(r"(?i)<\s*(script|style)\b").expect("regex");
    if script.is_match(&lower) {
        return Some("preview must not contain <script> or <style> tags. Use inline styles via the style attribute if needed.");
    }
    let tag = regex::Regex::new(r"(?i)<[a-z][^>]*>").expect("regex");
    if !tag.is_match(preview) {
        return Some("preview must contain HTML (previewFormat is set to \"html\"). Wrap content in a tag like <div> or <pre>.");
    }
    None
}

/// O texto do tool_result (`mapToolResultToToolResultBlockParam`).
pub fn ask_user_question_result_text(
    answers: &Map<String, Value>,
    annotations: Option<&Map<String, Value>>,
) -> String {
    let parts: Vec<String> = answers
        .iter()
        .map(|(question, answer)| {
            let answer_text = match answer {
                Value::String(s) => s.clone(),
                other => other.to_string(),
            };
            let mut pieces = vec![format!("\"{question}\"=\"{answer_text}\"")];
            if let Some(annotation) = annotations.and_then(|a| a.get(question)) {
                if let Some(preview) = annotation.get("preview").and_then(Value::as_str) {
                    if !preview.is_empty() {
                        pieces.push(format!("selected preview:\n{preview}"));
                    }
                }
                if let Some(notes) = annotation.get("notes").and_then(Value::as_str) {
                    if !notes.is_empty() {
                        pieces.push(format!("user notes: {notes}"));
                    }
                }
            }
            pieces.join(" ")
        })
        .collect();
    format!(
        "User has answered your questions: {}. You can now continue with the user's answers in mind.",
        parts.join(", ")
    )
}

#[async_trait]
impl Tool for AskUserQuestionTool {
    fn name(&self) -> &str {
        "AskUserQuestion"
    }

    fn description(&self) -> &str {
        prompt_for_env()
    }

    fn input_schema(&self) -> Value {
        ask_user_question_schema()
    }

    fn is_concurrency_safe(&self, _input: &serde_json::Value) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    fn requires_user_interaction(&self) -> bool {
        true
    }

    fn preprocess_input(&self, input: Value) -> Value {
        normalize_input(input)
    }

    /// `UNIQUENESS_REFINE`: textos de pergunta únicos e rótulos únicos em
    /// cada pergunta.
    fn refine_input(&self, input: &Value) -> Vec<Value> {
        let Some(questions) = input.get("questions").and_then(Value::as_array) else {
            return Vec::new();
        };
        let texts: Vec<&Value> = questions.iter().filter_map(|q| q.get("question")).collect();
        let mut unique = true;
        for (i, t) in texts.iter().enumerate() {
            if texts[..i].contains(t) {
                unique = false;
            }
        }
        for question in questions {
            let labels: Vec<&Value> = question
                .get("options")
                .and_then(Value::as_array)
                .map(|o| o.iter().filter_map(|opt| opt.get("label")).collect())
                .unwrap_or_default();
            for (i, l) in labels.iter().enumerate() {
                if labels[..i].contains(l) {
                    unique = false;
                }
            }
        }
        if unique {
            Vec::new()
        } else {
            vec![custom_issue(
                "Question texts must be unique, option labels must be unique within each question",
                &[],
            )]
        }
    }

    async fn validate_input(&self, input: &Value, _context: &ToolContext) -> Result<(), String> {
        if question_preview_format() != Some(QuestionPreviewFormat::Html) {
            return Ok(());
        }
        for question in input
            .get("questions")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
        {
            for option in question
                .get("options")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
            {
                if let Some(err) =
                    validate_html_preview(option.get("preview").and_then(Value::as_str))
                {
                    return Err(format!(
                        "Option \"{}\" in question \"{}\": {err}",
                        option
                            .get("label")
                            .and_then(Value::as_str)
                            .unwrap_or_default(),
                        question
                            .get("question")
                            .and_then(Value::as_str)
                            .unwrap_or_default()
                    ));
                }
            }
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::Ask(PermissionAsk {
            message: "Answer questions?".to_string(),
            updated_input: Some(input.clone()),
            ..Default::default()
        })
    }

    async fn execute(&self, input: Value, _context: &ToolContext) -> ToolResult {
        // O input chega normalizado de novo porque o `updatedInput` do
        // callback substitui o do modelo e não passa pelo preprocess.
        let input = normalize_input(input);
        let questions = input.get("questions").cloned().unwrap_or(json!([]));
        let answers = input
            .get("answers")
            .and_then(Value::as_object)
            .cloned()
            .unwrap_or_default();
        let annotations = input.get("annotations").and_then(Value::as_object).cloned();
        let text = ask_user_question_result_text(&answers, annotations.as_ref());
        let mut data = Map::new();
        data.insert("questions".into(), questions);
        data.insert("answers".into(), Value::Object(answers));
        if let Some(annotations) = annotations {
            data.insert("annotations".into(), Value::Object(annotations));
        }
        ToolResult::text(text).with_tool_use_result(Value::Object(data))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn result_text_matches_the_cli_capture() {
        let answers = json!({"Qual lib?": "B"});
        let annotations = json!({"Qual lib?": {"notes": "prefiro B"}});
        assert_eq!(
            ask_user_question_result_text(
                answers.as_object().unwrap(),
                annotations.as_object()
            ),
            "User has answered your questions: \"Qual lib?\"=\"B\" user notes: prefiro B. You can now continue with the user's answers in mind."
        );
    }

    #[test]
    fn normalization_fills_multiselect_and_strips_unknown_nested_keys() {
        let input = json!({"questions": [{"question": "Q?", "header": "H", "options": [
            {"label": "A", "description": "a"}, {"label": "B", "description": "b", "extra": 1}
        ]}]});
        let normalized = normalize_input(input);
        assert_eq!(normalized["questions"][0]["multiSelect"], json!(false));
        assert!(normalized["questions"][0]["options"][1]
            .get("extra")
            .is_none());
    }
}
