//! Glob: busca de arquivos por padrão, com paridade com o `GlobTool` do CLI
//! 2.1.90 (`tools/GlobTool/GlobTool.js`, `utils/glob.js`).
//!
//! Como o CLI, roda `rg --files --glob <padrão> --sort=modified --no-ignore
//! --hidden` na raiz da busca (padrão absoluto vira raiz + padrão relativo,
//! o `extractGlobBaseDirectory`), corta em 100 arquivos e devolve os caminhos relativos
//! ao cwd. Sem `rg` no PATH, a mesma busca é feita em Rust, com a semântica
//! de glob do ripgrep.

use std::sync::OnceLock;
use std::time::Instant;

use async_trait::async_trait;
use serde_json::{json, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::fs_support::{self as fs, RgGlob, RipgrepOutcome};
use crate::tools::permission::{PermissionResult, PermissionRules};

/// Find files by glob pattern.
pub struct GlobTool;

/// O `limit` default do JS (`globLimits?.maxResults ?? 100`).
const MAX_RESULTS: usize = 100;

fn description_text() -> &'static str {
    static TEXT: OnceLock<String> = OnceLock::new();
    TEXT.get_or_init(|| {
        crate::tools::fs_prompts::expand(crate::tools::fs_prompts::GLOB_DESCRIPTION)
    })
}

fn schema_value() -> &'static Value {
    static SCHEMA: OnceLock<Value> = OnceLock::new();
    SCHEMA.get_or_init(|| crate::tools::fs_prompts::schema(crate::tools::fs_prompts::GLOB_SCHEMA))
}

/// `extractGlobBaseDirectory`: a parte estática de um padrão absoluto vira a
/// raiz da busca.
fn extract_glob_base_directory(pattern: &str) -> (String, String) {
    let glob_chars = ['*', '?', '[', '{'];
    let Some(index) = pattern.find(|c| glob_chars.contains(&c)) else {
        let p = std::path::Path::new(pattern);
        let dir = p
            .parent()
            .map(|d| d.to_string_lossy().to_string())
            .unwrap_or_default();
        let file = p
            .file_name()
            .map(|f| f.to_string_lossy().to_string())
            .unwrap_or_default();
        return (if dir.is_empty() { ".".to_string() } else { dir }, file);
    };
    let static_prefix = &pattern[..index];
    let Some(last_sep) = static_prefix.rfind('/') else {
        return (String::new(), pattern.to_string());
    };
    let mut base = static_prefix[..last_sep].to_string();
    if base.is_empty() && last_sep == 0 {
        base = "/".to_string();
    }
    (base, pattern[last_sep + 1..].to_string())
}

fn env_truthy(key: &str, default: &str) -> bool {
    let value = std::env::var(key).unwrap_or_else(|_| default.to_string());
    matches!(value.to_lowercase().trim(), "1" | "true" | "yes" | "on")
}

/// A busca em si: arquivos absolutos em ordem de modificação (mais antigo
/// primeiro, como `--sort=modified`).
async fn find_files(
    pattern: &str,
    search_dir: &std::path::Path,
    ignores: &[String],
) -> Result<Vec<String>, String> {
    let no_ignore = env_truthy("CLAUDE_CODE_GLOB_NO_IGNORE", "true");
    let hidden = env_truthy("CLAUDE_CODE_GLOB_HIDDEN", "true");
    if let Some(rg) = fs::ripgrep_path() {
        let mut args: Vec<String> = vec![
            "--files".into(),
            "--glob".into(),
            pattern.to_string(),
            "--sort=modified".into(),
        ];
        if no_ignore {
            args.push("--no-ignore".into());
        }
        if hidden {
            args.push("--hidden".into());
        }
        for ignore in ignores {
            args.push("--glob".into());
            args.push(format!("!{ignore}"));
        }
        return match fs::run_ripgrep(&rg, &args, search_dir).await {
            RipgrepOutcome::Lines(lines) => Ok(lines
                .into_iter()
                .map(|p| {
                    if std::path::Path::new(&p).is_absolute() {
                        p
                    } else {
                        search_dir.join(p).to_string_lossy().to_string()
                    }
                })
                .collect()),
            RipgrepOutcome::Error(e) => Err(e),
        };
    }
    Ok(list_without_ripgrep(pattern, search_dir, ignores, hidden))
}

/// Sem ripgrep: a mesma listagem em Rust (sem `.gitignore`, como o
/// `--no-ignore` default do Glob).
fn list_without_ripgrep(
    pattern: &str,
    search_dir: &std::path::Path,
    ignores: &[String],
    hidden: bool,
) -> Vec<String> {
    let mut globs: Vec<RgGlob> = Vec::new();
    if let Some(g) = RgGlob::new(pattern) {
        globs.push(g);
    }
    for ignore in ignores {
        if let Some(g) = RgGlob::new(&format!("!{ignore}")) {
            globs.push(g);
        }
    }
    let mut found: Vec<(i64, String)> = fs::walk_files(search_dir, &[])
        .into_iter()
        .filter(|(_, rel)| hidden || !rel.split('/').any(|s| s.starts_with('.')))
        .filter(|(_, rel)| fs::rg_globs_allow(&globs, rel))
        .map(|(path, _)| {
            (
                fs::modification_time_ms(&path).unwrap_or(0),
                path.to_string_lossy().to_string(),
            )
        })
        .collect();
    found.sort();
    found.into_iter().map(|(_, p)| p).collect()
}

#[async_trait]
impl Tool for GlobTool {
    fn name(&self) -> &str {
        "Glob"
    }

    fn description(&self) -> &str {
        description_text()
    }

    fn input_schema(&self) -> Value {
        schema_value().clone()
    }

    fn is_concurrency_safe(&self) -> bool {
        true
    }

    fn is_read_only(&self) -> bool {
        true
    }

    fn max_result_size_chars(&self) -> Option<usize> {
        Some(100_000)
    }

    async fn validate_input(&self, input: &Value, ctx: &ToolContext) -> Result<(), String> {
        let Some(path) = input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        else {
            return Ok(());
        };
        let absolute = fs::absolute(path, &ctx.working_directory);
        let text = absolute.to_string_lossy();
        if text.starts_with("\\\\") || text.starts_with("//") {
            return Ok(());
        }
        match std::fs::metadata(&absolute) {
            Ok(meta) if meta.is_dir() => Ok(()),
            Ok(_) => Err(format!("Path is not a directory: {path}")),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                let mut message = format!(
                    "Directory does not exist: {path}. {} {}.",
                    fs::FILE_NOT_FOUND_CWD_NOTE,
                    ctx.working_directory.display()
                );
                if let Some(suggestion) =
                    fs::suggest_path_under_cwd(&absolute, &ctx.working_directory)
                {
                    message.push_str(&format!(" Did you mean {suggestion}?"));
                }
                Err(message)
            }
            Err(e) => Err(e.to_string()),
        }
    }

    async fn check_permissions(
        &self,
        input: &Value,
        ctx: &ToolContext,
        rules: &PermissionRules,
    ) -> PermissionResult {
        let path = match input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        {
            Some(p) => fs::absolute(p, &ctx.working_directory),
            None => ctx.working_directory.clone(),
        };
        crate::tools::permission::check_read_permission(&path.to_string_lossy(), ctx, rules)
    }

    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult {
        let start = Instant::now();
        let pattern = input["pattern"].as_str().unwrap_or_default().to_string();
        let mut search_dir = match input
            .get("path")
            .and_then(Value::as_str)
            .filter(|p| !p.is_empty())
        {
            Some(p) => fs::absolute(p, &ctx.working_directory),
            None => ctx.working_directory.clone(),
        };
        let mut search_pattern = pattern.clone();
        if std::path::Path::new(&pattern).is_absolute() {
            let (base, relative) = extract_glob_base_directory(&pattern);
            if !base.is_empty() {
                search_dir = std::path::PathBuf::from(base);
                search_pattern = relative;
            }
        }
        // O JS esconde da listagem o que as regras deny de `Read(...)` cobrem
        // (`getFileReadIgnorePatterns`). O `execute` do nativo não recebe as
        // regras; a raiz da busca já passou pela checagem de leitura, e o
        // corte por arquivo fica pendente de o contexto carregar as regras.
        let ignores: Vec<String> = Vec::new();
        let files = match find_files(&search_pattern, &search_dir, &ignores).await {
            Ok(files) => files,
            Err(e) => return ToolResult::error(e),
        };
        let truncated = files.len() > MAX_RESULTS;
        let filenames: Vec<String> = files
            .into_iter()
            .take(MAX_RESULTS)
            .map(|f| fs::to_relative_path(&f, &ctx.working_directory))
            .collect();
        let duration_ms = start.elapsed().as_millis() as u64;
        let text = if filenames.is_empty() {
            "No files found".to_string()
        } else {
            let mut lines = filenames.clone();
            if truncated {
                lines.push(
                    "(Results are truncated. Consider using a more specific path or pattern.)"
                        .to_string(),
                );
            }
            lines.join("\n")
        };
        ToolResult::text(text).with_tool_use_result(json!({
            "filenames": filenames,
            "durationMs": duration_ms,
            "numFiles": filenames.len(),
            "truncated": truncated,
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_glob_finds_cargo_toml() {
        let tool = GlobTool;
        let ctx = ToolContext {
            working_directory: std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")),
            ..Default::default()
        };

        let result = tool.execute(json!({"pattern": "Cargo.toml"}), &ctx).await;
        assert!(!result.is_error);
        assert!(result.text_content().lines().any(|l| l == "Cargo.toml"));
    }

    #[tokio::test]
    async fn test_glob_no_match() {
        let tool = GlobTool;
        let dir = tempfile::tempdir().unwrap();
        let ctx = ToolContext {
            working_directory: dir.path().to_path_buf(),
            ..Default::default()
        };
        let result = tool
            .execute(json!({"pattern": "*.nonexistent_extension_xyz"}), &ctx)
            .await;
        assert!(!result.is_error);
        assert_eq!(result.text_content(), "No files found");
        let data = result.tool_use_result.unwrap();
        assert_eq!(data["numFiles"], 0);
        assert_eq!(data["truncated"], false);
    }

    #[test]
    fn listing_without_ripgrep_follows_rg_glob_semantics() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::create_dir_all(dir.path().join("src/deep")).unwrap();
        std::fs::write(dir.path().join("a.ts"), "").unwrap();
        std::fs::write(dir.path().join("src/b.tsx"), "").unwrap();
        std::fs::write(dir.path().join("src/deep/c.ts"), "").unwrap();
        std::fs::write(dir.path().join(".hidden.ts"), "").unwrap();
        let rel = |files: Vec<String>| -> Vec<String> {
            let mut v: Vec<String> = files
                .iter()
                .map(|f| fs::to_relative_path(f, dir.path()))
                .collect();
            v.sort();
            v
        };
        // Sem `/`, casa o nome em qualquer nível (e inclui ocultos).
        assert_eq!(
            rel(list_without_ripgrep("*.ts", dir.path(), &[], true)),
            vec![".hidden.ts", "a.ts", "src/deep/c.ts"]
        );
        // Com `/`, casa o caminho relativo; chaves expandem.
        assert_eq!(
            rel(list_without_ripgrep(
                "src/**/*.{ts,tsx}",
                dir.path(),
                &[],
                true
            )),
            vec!["src/b.tsx", "src/deep/c.ts"]
        );
        assert_eq!(
            rel(list_without_ripgrep(
                "*.ts",
                dir.path(),
                &["src/deep".to_string()],
                true
            )),
            vec![".hidden.ts", "a.ts"]
        );
    }

    #[test]
    fn absolute_patterns_split_into_base_and_relative() {
        assert_eq!(
            extract_glob_base_directory("/a/b/**/*.rs"),
            ("/a/b".to_string(), "**/*.rs".to_string())
        );
        assert_eq!(
            extract_glob_base_directory("/*.rs"),
            ("/".to_string(), "*.rs".to_string())
        );
        assert_eq!(
            extract_glob_base_directory("/a/b/c.txt"),
            ("/a/b".to_string(), "c.txt".to_string())
        );
    }
}
