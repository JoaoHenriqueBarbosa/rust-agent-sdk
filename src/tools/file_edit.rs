//! Edit: substituição exata de texto num arquivo, com paridade com o
//! `FileEditTool` do CLI 2.1.90 (`tools/FileEditTool/FileEditTool.js`,
//! `tools/FileEditTool/utils.js`, `utils/diff.js`).
//!
//! - A descrição e o schema são os literais do CLI.
//! - O input passa pela normalização que o CLI aplica ao receber o tool_use
//!   (`normalizeToolInput` de `utils/api.js`): `new_string` perde o espaço
//!   do fim das linhas (salvo em Markdown) e as abreviações de marcação
//!   (`DESANITIZATIONS`) são desfeitas quando o arquivo tem a forma longa.
//! - `validateInput` roda antes da permissão, com as mesmas mensagens:
//!   arquivo não lido (`readFileState`), modificado desde a leitura, texto
//!   não encontrado (com a tolerância de aspas curvas do `findActualString`),
//!   várias ocorrências sem `replace_all`, e assim por diante.
//! - A permissão é a de escrita por caminho (`checkWritePermissionForTool`).
//! - O resultado é o texto do `mapToolResultToToolResultBlockParam`, como
//!   string, e o `tool_use_result` traz o `data` do JS na ordem do JS, com o
//!   `structuredPatch` do jsdiff.

use std::sync::OnceLock;

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::tools::file_state::FileState;
use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::fs_support::{self as fs, Encoding, LineEndings};
use crate::tools::permission::{PermissionResult, PermissionRules};

/// Perform exact string replacements in files.
pub struct FileEditTool;

/// `MAX_EDIT_FILE_SIZE` (1GiB).
const MAX_EDIT_FILE_SIZE: u64 = 1_073_741_824;

/// `FILE_UNEXPECTEDLY_MODIFIED_ERROR` de `tools/FileEditTool/constants.js`.
pub(crate) const FILE_UNEXPECTEDLY_MODIFIED_ERROR: &str =
    "File has been unexpectedly modified. Read it again before attempting to write it.";

/// Mensagem de arquivo não lido (Edit, Write e NotebookEdit).
pub(crate) const FILE_NOT_READ_ERROR: &str =
    "File has not been read yet. Read it first before writing to it.";

/// Mensagem de arquivo modificado depois da leitura.
pub(crate) const FILE_MODIFIED_SINCE_READ_ERROR: &str =
    "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.";

/// O input do Edit depois da normalização do CLI.
#[derive(Debug, Clone)]
struct EditInput {
    file_path: String,
    old_string: String,
    new_string: String,
    replace_all: bool,
}

/// `normalizeFileEditInput`: espaço de fim de linha fora do `new_string`
/// (exceto Markdown) e as abreviações de marcação desfeitas quando é o que
/// faz o `old_string` casar.
fn normalize_input(input: &Value, ctx: &ToolContext) -> EditInput {
    let file_path = input["file_path"].as_str().unwrap_or_default().to_string();
    let old_string = input["old_string"].as_str().unwrap_or_default().to_string();
    let new_string = input["new_string"].as_str().unwrap_or_default().to_string();
    let replace_all = input["replace_all"].as_bool().unwrap_or(false);
    let normalized_new = if fs::is_markdown_path(&file_path) {
        new_string.clone()
    } else {
        fs::strip_trailing_whitespace(&new_string)
    };
    let absolute = fs::absolute(&file_path, &ctx.cwd());
    let normalized = |old: String, new: String| EditInput {
        file_path: file_path.clone(),
        old_string: old,
        new_string: new,
        replace_all,
    };
    let Ok(meta) = fs::read_file_with_metadata(&absolute) else {
        // Sem arquivo, o JS devolve o input como veio.
        return normalized(old_string, new_string);
    };
    let content = meta.content;
    if content.contains(&old_string) {
        return normalized(old_string, normalized_new);
    }
    let mut desanitized_old = old_string.clone();
    let mut applied: Vec<(&str, &str)> = Vec::new();
    for (from, to) in fs::DESANITIZATIONS {
        let before = desanitized_old.clone();
        desanitized_old = desanitized_old.replace(from, to);
        if before != desanitized_old {
            applied.push((from, to));
        }
    }
    if content.contains(&desanitized_old) {
        let mut desanitized_new = normalized_new;
        for (from, to) in applied {
            desanitized_new = desanitized_new.replace(from, to);
        }
        return normalized(desanitized_old, desanitized_new);
    }
    normalized(old_string, normalized_new)
}

/// `applyEditToFile`: troca a primeira ocorrência (ou todas); apagar um
/// trecho leva junto o `\n` seguinte quando ele existe.
fn apply_edit(content: &str, old: &str, new: &str, replace_all: bool) -> String {
    let apply = |content: &str, search: &str, replace: &str| {
        if replace_all {
            content.replace(search, replace)
        } else {
            content.replacen(search, replace, 1)
        }
    };
    if !new.is_empty() {
        return apply(content, old, new);
    }
    let with_newline = format!("{old}\n");
    if !old.ends_with('\n') && content.contains(&with_newline) {
        apply(content, &with_newline, new)
    } else {
        apply(content, old, new)
    }
}

fn description_text() -> &'static str {
    static TEXT: OnceLock<String> = OnceLock::new();
    TEXT.get_or_init(|| {
        crate::tools::fs_prompts::expand(crate::tools::fs_prompts::EDIT_DESCRIPTION)
    })
}

fn schema_value() -> &'static Value {
    static SCHEMA: OnceLock<Value> = OnceLock::new();
    SCHEMA.get_or_init(|| crate::tools::fs_prompts::schema(crate::tools::fs_prompts::EDIT_SCHEMA))
}

/// A mensagem de arquivo inexistente com as sugestões do JS.
pub(crate) fn file_not_found_message(absolute: &std::path::Path, ctx: &ToolContext) -> String {
    let cwd = &ctx.cwd();
    let mut message = format!(
        "File does not exist. {} {}.",
        fs::FILE_NOT_FOUND_CWD_NOTE,
        cwd.display()
    );
    if let Some(suggestion) = fs::suggest_path_under_cwd(absolute, cwd) {
        message.push_str(&format!(" Did you mean {suggestion}?"));
    } else if let Some(similar) = fs::find_similar_file(absolute) {
        message.push_str(&format!(" Did you mean {similar}?"));
    }
    message
}

#[async_trait]
impl Tool for FileEditTool {
    fn name(&self) -> &str {
        "Edit"
    }

    fn is_edit_tool(&self) -> bool {
        true
    }

    fn description(&self) -> &str {
        description_text()
    }

    fn input_schema(&self) -> Value {
        schema_value().clone()
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        Some(100_000)
    }

    /// O `semanticBoolean` do `replace_all`.
    fn preprocess_input(&self, input: Value) -> Value {
        let Value::Object(mut map) = input else {
            return input;
        };
        if let Some(v) = map.get("replace_all").cloned() {
            map.insert(
                "replace_all".into(),
                crate::tools::schema_validation::semantic_boolean(&v),
            );
        }
        Value::Object(map)
    }

    /// `normalizeToolInput` do Edit: o `normalizeFileEditInput` (espaço de
    /// fim de linha fora do `new_string` e as abreviações desfeitas) nas
    /// chaves `replace_all` (o default `false` do zod), `file_path`,
    /// `old_string` e `new_string`, nessa ordem.
    fn normalize_input(&self, input: Value, ctx: &ToolContext) -> Value {
        let parsed = self.preprocess_input(input.clone());
        if !crate::tools::schema_validation::validate_input(&parsed, schema_value()).is_empty() {
            return input;
        }
        let edit = normalize_input(&parsed, ctx);
        json!({
            "replace_all": edit.replace_all,
            "file_path": edit.file_path,
            "old_string": edit.old_string,
            "new_string": edit.new_string,
        })
    }

    async fn validate_input(&self, input: &Value, ctx: &ToolContext) -> Result<(), String> {
        let input = normalize_input(input, ctx);
        let full_path = fs::absolute(&input.file_path, &ctx.cwd());
        if input.old_string == input.new_string {
            return Err(
                "No changes to make: old_string and new_string are exactly the same.".to_string(),
            );
        }
        if crate::tools::permission::path_denied_by_rules(
            &full_path,
            ctx,
            crate::tools::permission::PathRuleKind::Edit,
        ) {
            return Err(crate::tools::permission::DENIED_BY_PERMISSION_SETTINGS.to_string());
        }
        let text = full_path.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return Ok(());
        }
        if let Ok(meta) = std::fs::metadata(&full_path) {
            if meta.len() > MAX_EDIT_FILE_SIZE {
                return Err(format!(
                    "File is too large to edit ({}). Maximum editable file size is {}.",
                    crate::tools::framework::format_file_size(meta.len()),
                    crate::tools::framework::format_file_size(MAX_EDIT_FILE_SIZE)
                ));
            }
        }
        let content = match fs::read_file_with_metadata(&full_path) {
            Ok(meta) => Some(meta.content),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => None,
            Err(e) => return Err(e.to_string()),
        };
        let Some(content) = content else {
            if input.old_string.is_empty() {
                return Ok(());
            }
            return Err(file_not_found_message(&full_path, ctx));
        };
        if input.old_string.is_empty() {
            if !content.trim().is_empty() {
                return Err("Cannot create new file - file already exists.".to_string());
            }
            return Ok(());
        }
        if text.ends_with(".ipynb") {
            return Err(
                "File is a Jupyter Notebook. Use the NotebookEdit to edit this file.".to_string(),
            );
        }
        let read = ctx.file_state.get(&full_path);
        let Some(read) = read.filter(|r| !r.is_partial_view) else {
            return Err(FILE_NOT_READ_ERROR.to_string());
        };
        let mtime = fs::modification_time_ms(&full_path).unwrap_or(0);
        if mtime > read.timestamp {
            let full_read_same =
                read.offset.is_none() && read.limit.is_none() && content == read.content;
            if !full_read_same {
                return Err(FILE_MODIFIED_SINCE_READ_ERROR.to_string());
            }
        }
        let Some(actual) = fs::find_actual_string(&content, &input.old_string) else {
            return Err(format!(
                "String to replace not found in file.\nString: {}",
                input.old_string
            ));
        };
        let matches = content.matches(actual.as_str()).count();
        if matches > 1 && !input.replace_all {
            return Err(format!(
                "Found {matches} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.\nString: {}",
                input.old_string
            ));
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        input: &Value,
        ctx: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        let path = input["file_path"].as_str().unwrap_or_default();
        crate::tools::permission::check_write_permission(path, ctx, rules)
    }

    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult {
        let input = normalize_input(&input, ctx);
        let absolute = fs::absolute(&input.file_path, &ctx.cwd());
        if let Some(parent) = absolute.parent() {
            if let Err(e) = std::fs::create_dir_all(parent) {
                return ToolResult::error(e.to_string());
            }
        }
        let (original, exists, encoding, endings) = match fs::read_file_with_metadata(&absolute) {
            Ok(meta) => (meta.content, true, meta.encoding, meta.line_endings),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                (String::new(), false, Encoding::Utf8, LineEndings::Lf)
            }
            Err(e) => return ToolResult::error(e.to_string()),
        };
        if exists {
            let last_write = fs::modification_time_ms(&absolute).unwrap_or(0);
            let last_read = ctx.file_state.get(&absolute);
            let stale = match &last_read {
                None => true,
                Some(read) => last_write > read.timestamp,
            };
            if stale {
                let unchanged = last_read
                    .as_ref()
                    .map(|r| r.offset.is_none() && r.limit.is_none() && original == r.content)
                    .unwrap_or(false);
                if !unchanged {
                    return ToolResult::error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
                }
            }
        }
        let actual_old = fs::find_actual_string(&original, &input.old_string)
            .unwrap_or_else(|| input.old_string.clone());
        let actual_new =
            fs::preserve_quote_style(&input.old_string, &actual_old, &input.new_string);

        // `getPatchForEdits`.
        let updated = if original.is_empty() && actual_old.is_empty() && actual_new.is_empty() {
            String::new()
        } else {
            let updated = if actual_old.is_empty() {
                actual_new.clone()
            } else {
                apply_edit(&original, &actual_old, &actual_new, input.replace_all)
            };
            // Com uma edição só, o "Original and edited file match exactly"
            // do JS nunca é alcançado: a mesma igualdade já cai aqui.
            if updated == original {
                return ToolResult::error("String not found in file. Failed to apply edit.");
            }
            updated
        };
        let patch = fs::patch_json(&original, &updated);

        if let Err(e) = fs::write_text_content(&absolute, &updated, encoding, endings) {
            return ToolResult::error(e.to_string());
        }
        ctx.file_state.set(
            &absolute,
            FileState {
                content: updated.clone(),
                timestamp: fs::modification_time_ms(&absolute).unwrap_or(0),
                offset: None,
                limit: None,
                is_partial_view: false,
            },
        );

        let text = if input.replace_all {
            format!(
                "The file {} has been updated. All occurrences were successfully replaced.",
                input.file_path
            )
        } else {
            format!(
                "The file {} has been updated successfully.",
                input.file_path
            )
        };
        ToolResult::text(text).with_tool_use_result(json!({
            "filePath": input.file_path,
            "oldString": actual_old,
            "newString": input.new_string,
            "originalFile": original,
            "structuredPatch": patch,
            "userModified": false,
            "replaceAll": input.replace_all,
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Simula a leitura do Read: registra o arquivo no `readFileState`.
    fn mark_read(ctx: &ToolContext, path: &std::path::Path) {
        let meta = fs::read_file_with_metadata(path).unwrap();
        ctx.file_state.set(
            path,
            FileState {
                content: meta.content,
                timestamp: fs::modification_time_ms(path).unwrap(),
                offset: None,
                limit: None,
                is_partial_view: false,
            },
        );
    }

    fn ctx_in(dir: &std::path::Path) -> ToolContext {
        ToolContext {
            working_directory: dir.to_path_buf(),
            ..Default::default()
        }
    }

    #[tokio::test]
    async fn test_edit_single_replacement() {
        let tool = FileEditTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ctx_in(dir.path());
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "hello world").unwrap();
        mark_read(&ctx, &path);

        let input = json!({
            "file_path": path.to_str().unwrap(),
            "old_string": "hello",
            "new_string": "goodbye"
        });
        assert!(tool.validate_input(&input, &ctx).await.is_ok());
        let result = tool.execute(input, &ctx).await;
        assert!(!result.is_error);
        assert_eq!(std::fs::read_to_string(&path).unwrap(), "goodbye world");
    }

    #[tokio::test]
    async fn test_edit_multiple_fails_without_replace_all() {
        let tool = FileEditTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ctx_in(dir.path());
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "aaa bbb aaa").unwrap();
        mark_read(&ctx, &path);

        let err = tool
            .validate_input(
                &json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "aaa",
                    "new_string": "ccc"
                }),
                &ctx,
            )
            .await
            .unwrap_err();
        assert!(err.starts_with("Found 2 matches of the string to replace"));
    }

    #[tokio::test]
    async fn test_edit_replace_all() {
        let tool = FileEditTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ctx_in(dir.path());
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "aaa bbb aaa").unwrap();
        mark_read(&ctx, &path);

        let result = tool
            .execute(
                json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "aaa",
                    "new_string": "ccc",
                    "replace_all": true
                }),
                &ctx,
            )
            .await;
        assert!(!result.is_error);
        assert_eq!(std::fs::read_to_string(&path).unwrap(), "ccc bbb ccc");
    }

    #[tokio::test]
    async fn test_edit_not_found() {
        let tool = FileEditTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ctx_in(dir.path());
        let path = dir.path().join("test.txt");
        std::fs::write(&path, "hello").unwrap();
        mark_read(&ctx, &path);

        let err = tool
            .validate_input(
                &json!({
                    "file_path": path.to_str().unwrap(),
                    "old_string": "notfound",
                    "new_string": "replacement"
                }),
                &ctx,
            )
            .await
            .unwrap_err();
        assert_eq!(
            err,
            "String to replace not found in file.\nString: notfound"
        );
    }

    #[tokio::test]
    async fn crlf_file_keeps_its_line_endings() {
        let tool = FileEditTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ctx_in(dir.path());
        let path = dir.path().join("win.txt");
        std::fs::write(&path, "a\r\nb\r\n").unwrap();
        mark_read(&ctx, &path);
        let result = tool
            .execute(
                json!({"file_path": path.to_str().unwrap(), "old_string": "b", "new_string": "c"}),
                &ctx,
            )
            .await;
        assert!(!result.is_error, "{}", result.text_content());
        assert_eq!(std::fs::read(&path).unwrap(), b"a\r\nc\r\n");
    }
}
