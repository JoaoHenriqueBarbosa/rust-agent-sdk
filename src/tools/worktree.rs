//! `EnterWorktree` e `ExitWorktree`: sessão numa worktree git isolada.
//!
//! Referências JS: `tools/EnterWorktreeTool/EnterWorktreeTool.js` e
//! `prompt.js`, `tools/ExitWorktreeTool/ExitWorktreeTool.js` e `prompt.js`
//! (schemas, validações, textos e `data`), e `utils/worktree/*.js`
//! (`validateWorktreeSlug`, `worktreePathFor` em `.claude/worktrees/`,
//! a branch `worktree-<slug>`, `getOrCreateWorktree` com base em
//! `origin/<default>` ou `HEAD`, `performPostCreationSetup`, `keepWorktree`
//! e `cleanupWorktree`).
//!
//! A sessão de worktree fica no `TaskStore` da sessão
//! ([`crate::tools::task_store::WorktreeSession`]); o engine deve usar
//! [`crate::tools::task_store::TaskStore::effective_cwd`] como cwd das
//! tools enquanto ela existir. Os hooks `WorktreeCreate`/`WorktreeRemove`
//! (worktree sem git) não existem no transporte nativo.

use std::path::{Path, PathBuf};

use async_trait::async_trait;
use serde_json::{json, Map, Value};

use crate::tools::framework::{Tool, ToolContext, ToolResult};
use crate::tools::permission::{PermissionResult, PermissionRules};
use crate::tools::schema_validation::custom_issue;
use crate::tools::task_store::WorktreeSession;

const ENTER_WORKTREE_PROMPT: &str = r###"Use this tool ONLY when the user explicitly asks to work in a worktree. This tool creates an isolated git worktree and switches the current session into it.

## When to Use

- The user explicitly says "worktree" (e.g., "start a worktree", "work in a worktree", "create a worktree", "use a worktree")

## When NOT to Use

- The user asks to create a branch, switch branches, or work on a different branch [[EM]] use git commands instead
- The user asks to fix a bug or work on a feature [[EM]] use normal git workflow unless they specifically mention worktrees
- Never use this tool unless the user explicitly mentions "worktree"

## Requirements

- Must be in a git repository, OR have WorktreeCreate/WorktreeRemove hooks configured in settings.json
- Must not already be in a worktree

## Behavior

- In a git repository: creates a new git worktree inside `.claude/worktrees/` with a new branch based on HEAD
- Outside a git repository: delegates to WorktreeCreate/WorktreeRemove hooks for VCS-agnostic isolation
- Switches the session's working directory to the new worktree
- Use ExitWorktree to leave the worktree mid-session (keep or remove). On session exit, if still in the worktree, the user will be prompted to keep or remove it

## Parameters

- `name` (optional): A name for the worktree. If not provided, a random name is generated.
"###;

const EXIT_WORKTREE_PROMPT: &str = r###"Exit a worktree session created by EnterWorktree and return the session to the original working directory.

## Scope

This tool ONLY operates on worktrees created by EnterWorktree in this session. It will NOT touch:
- Worktrees you created manually with `git worktree add`
- Worktrees from a previous session (even if created by EnterWorktree then)
- The directory you're in if EnterWorktree was never called

If called outside an EnterWorktree session, the tool is a **no-op**: it reports that no worktree session is active and takes no action. Filesystem state is unchanged.

## When to Use

- The user explicitly asks to "exit the worktree", "leave the worktree", "go back", or otherwise end the worktree session
- Do NOT call this proactively [[EM]] only when the user asks

## Parameters

- `action` (required): `"keep"` or `"remove"`
  - `"keep"` [[EM]] leave the worktree directory and branch intact on disk. Use this if the user wants to come back to the work later, or if there are changes to preserve.
  - `"remove"` [[EM]] delete the worktree directory and its branch. Use this for a clean exit when the work is done or abandoned.
- `discard_changes` (optional, default false): only meaningful with `action: "remove"`. If the worktree has uncommitted files or commits not on the original branch, the tool will REFUSE to remove it unless this is set to `true`. If the tool returns an error listing changes, confirm with the user before re-invoking with `discard_changes: true`.

## Behavior

- Restores the session's working directory to where it was before EnterWorktree
- Clears CWD-dependent caches (system prompt sections, memory files, plans directory) so the session state reflects the original directory
- If a tmux session was attached to the worktree: killed on `remove`, left running on `keep` (its name is returned so the user can reattach)
- Once exited, EnterWorktree can be called again to create a fresh worktree
"###;

/// `MAX_WORKTREE_SLUG_LENGTH`.
const MAX_WORKTREE_SLUG_LENGTH: usize = 64;

/// `validateWorktreeSlug`.
pub fn validate_worktree_slug(slug: &str) -> Result<(), String> {
    let len = crate::tools::framework::js_len(slug);
    if len > MAX_WORKTREE_SLUG_LENGTH {
        return Err(format!(
            "Invalid worktree name: must be {MAX_WORKTREE_SLUG_LENGTH} characters or fewer (got {len})"
        ));
    }
    for segment in slug.split('/') {
        if segment == "." || segment == ".." {
            return Err(format!(
                "Invalid worktree name \"{slug}\": must not contain \".\" or \"..\" path segments"
            ));
        }
        let valid = !segment.is_empty()
            && segment
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '_' || c == '-');
        if !valid {
            return Err(format!(
                "Invalid worktree name \"{slug}\": each \"/\"-separated segment must be non-empty and contain only letters, digits, dots, underscores, and dashes"
            ));
        }
    }
    Ok(())
}

fn flatten_slug(slug: &str) -> String {
    slug.replace('/', "+")
}

async fn git(cwd: &Path, args: &[&str]) -> (i32, String, String) {
    let output = tokio::process::Command::new("git")
        .args(args)
        .current_dir(cwd)
        .env("GIT_TERMINAL_PROMPT", "0")
        .env("GIT_ASKPASS", "")
        .stdin(std::process::Stdio::null())
        .output()
        .await;
    match output {
        Ok(o) => (
            o.status.code().unwrap_or(-1),
            String::from_utf8_lossy(&o.stdout).to_string(),
            String::from_utf8_lossy(&o.stderr).to_string(),
        ),
        Err(e) => (-1, String::new(), e.to_string()),
    }
}

/// `findGitRoot`.
async fn find_git_root(cwd: &Path) -> Option<PathBuf> {
    let (code, out, _) = git(cwd, &["rev-parse", "--show-toplevel"]).await;
    (code == 0).then(|| PathBuf::from(out.trim()))
}

/// `findCanonicalGitRoot`: a raiz do repositório principal, mesmo de dentro
/// de uma worktree.
async fn find_canonical_git_root(cwd: &Path) -> Option<PathBuf> {
    let (code, out, _) = git(
        cwd,
        &["rev-parse", "--path-format=absolute", "--git-common-dir"],
    )
    .await;
    if code != 0 {
        return None;
    }
    let common = PathBuf::from(out.trim());
    if common.file_name().map(|n| n == ".git").unwrap_or(false) {
        return common.parent().map(Path::to_path_buf);
    }
    find_git_root(cwd).await
}

async fn default_branch(repo: &Path) -> String {
    let (code, out, _) = git(
        repo,
        &["symbolic-ref", "--short", "refs/remotes/origin/HEAD"],
    )
    .await;
    if code == 0 {
        if let Some(branch) = out.trim().strip_prefix("origin/") {
            return branch.to_string();
        }
    }
    for candidate in ["main", "master"] {
        let (code, _, _) = git(
            repo,
            &[
                "rev-parse",
                "--verify",
                "--quiet",
                &format!("refs/remotes/origin/{candidate}"),
            ],
        )
        .await;
        if code == 0 {
            return candidate.to_string();
        }
    }
    "main".to_string()
}

fn random_worktree_slug() -> String {
    crate::tools::plan_mode::generate_plan_slug()
}

/// `getOrCreateWorktree` + `performPostCreationSetup`.
async fn get_or_create_worktree(
    repo: &Path,
    slug: &str,
) -> Result<(PathBuf, String, Option<String>), String> {
    let worktree_path = repo
        .join(".claude")
        .join("worktrees")
        .join(flatten_slug(slug));
    let branch = format!("worktree-{}", flatten_slug(slug));
    if worktree_path.join(".git").exists() {
        let (code, out, _) = git(&worktree_path, &["rev-parse", "HEAD"]).await;
        if code == 0 {
            return Ok((worktree_path, branch, Some(out.trim().to_string())));
        }
    }
    let _ = tokio::fs::create_dir_all(repo.join(".claude").join("worktrees")).await;
    let default = default_branch(repo).await;
    let origin_ref = format!("origin/{default}");
    let (has_origin, _, _) = git(
        repo,
        &[
            "rev-parse",
            "--verify",
            "--quiet",
            &format!("refs/remotes/origin/{default}"),
        ],
    )
    .await;
    let base = if has_origin == 0 {
        origin_ref
    } else {
        let (fetch, _, _) = git(repo, &["fetch", "origin", &default]).await;
        if fetch == 0 {
            origin_ref
        } else {
            "HEAD".to_string()
        }
    };
    let (sha_code, sha, _) = git(repo, &["rev-parse", &base]).await;
    if sha_code != 0 {
        return Err(format!(
            "Failed to resolve base branch \"{base}\": git rev-parse failed"
        ));
    }
    let path_text = worktree_path.display().to_string();
    let (code, _, stderr) = git(repo, &["worktree", "add", "-B", &branch, &path_text, &base]).await;
    if code != 0 {
        return Err(format!("Failed to create worktree: {stderr}"));
    }
    // `performPostCreationSetup`: copia o settings.local.json e aponta os
    // hooks do git para os do repositório principal.
    let local_settings = repo.join(".claude").join("settings.local.json");
    if local_settings.exists() {
        let dest = worktree_path.join(".claude").join("settings.local.json");
        if let Some(parent) = dest.parent() {
            let _ = tokio::fs::create_dir_all(parent).await;
        }
        let _ = tokio::fs::copy(&local_settings, &dest).await;
    }
    for candidate in [repo.join(".husky"), repo.join(".git").join("hooks")] {
        if candidate.is_dir() {
            let hooks = candidate.display().to_string();
            let (_, current, _) = git(repo, &["config", "--get", "core.hooksPath"]).await;
            if current.trim() != hooks {
                let _ = git(&worktree_path, &["config", "core.hooksPath", &hooks]).await;
            }
            break;
        }
    }
    Ok((worktree_path, branch, Some(sha.trim().to_string())))
}

/// `countWorktreeChanges`: arquivos não commitados e commits além da base.
async fn count_worktree_changes(
    path: &Path,
    original_head: Option<&str>,
) -> Option<(usize, usize)> {
    let (code, status, _) = git(path, &["status", "--porcelain"]).await;
    if code != 0 {
        return None;
    }
    let changed = status.lines().filter(|l| !l.trim().is_empty()).count();
    let head = original_head?;
    let (code, out, _) = git(path, &["rev-list", "--count", &format!("{head}..HEAD")]).await;
    if code != 0 {
        return None;
    }
    Some((changed, out.trim().parse().unwrap_or(0)))
}

fn plural(n: usize, one: &str, many: &str) -> String {
    format!("{n} {}", if n == 1 { one } else { many })
}

pub struct EnterWorktreeTool;

#[async_trait]
impl Tool for EnterWorktreeTool {
    fn name(&self) -> &str {
        "EnterWorktree"
    }

    fn description(&self) -> &str {
        static TEXT: std::sync::OnceLock<String> = std::sync::OnceLock::new();
        TEXT.get_or_init(|| crate::tools::agent::with_js_dashes(ENTER_WORKTREE_PROMPT))
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "name": {
                    "description": "Optional name for the worktree. Each \"/\"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. A random name is generated if not provided.",
                    "type": "string"
                }
            },
            "additionalProperties": false
        })
    }

    /// O `superRefine` do `name` com o `validateWorktreeSlug`.
    fn refine_input(&self, input: &Value) -> Vec<Value> {
        match input.get("name").and_then(Value::as_str) {
            Some(name) => match validate_worktree_slug(name) {
                Ok(()) => Vec::new(),
                Err(message) => vec![custom_issue(&message, &[json!("name")])],
            },
            None => Vec::new(),
        }
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = context.task_store.clone() else {
            return ToolResult::error(
                "Worktree sessions need the session task store, which this context does not have.",
            );
        };
        if store.worktree_session().is_some() {
            return ToolResult::error("Already in a worktree session");
        }
        let cwd = context.working_directory.clone();
        let repo_root = match find_canonical_git_root(&cwd).await {
            Some(root) => root,
            None => {
                return ToolResult::error("Cannot create a worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
            }
        };
        let slug = input
            .get("name")
            .and_then(Value::as_str)
            .map(str::to_string)
            .unwrap_or_else(random_worktree_slug);
        if let Err(message) = validate_worktree_slug(&slug) {
            return ToolResult::error(message);
        }
        let (_, branch_out, _) = git(&repo_root, &["rev-parse", "--abbrev-ref", "HEAD"]).await;
        let original_branch = Some(branch_out.trim().to_string()).filter(|b| !b.is_empty());
        let (path, branch, head) = match get_or_create_worktree(&repo_root, &slug).await {
            Ok(created) => created,
            Err(message) => return ToolResult::error(message),
        };
        store.set_worktree_session(Some(WorktreeSession {
            original_cwd: repo_root.clone(),
            worktree_path: path.clone(),
            worktree_name: slug,
            worktree_branch: Some(branch.clone()),
            original_branch,
            original_head_commit: head,
        }));
        let path_text = path.display().to_string();
        let message = format!(
            "Created worktree at {path_text} on branch {branch}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted."
        );
        let mut data = Map::new();
        data.insert("worktreePath".into(), json!(path_text));
        data.insert("worktreeBranch".into(), json!(branch));
        data.insert("message".into(), json!(message));
        ToolResult::text(message).with_tool_use_result(Value::Object(data))
    }
}

pub struct ExitWorktreeTool;

#[async_trait]
impl Tool for ExitWorktreeTool {
    fn name(&self) -> &str {
        "ExitWorktree"
    }

    fn description(&self) -> &str {
        static TEXT: std::sync::OnceLock<String> = std::sync::OnceLock::new();
        TEXT.get_or_init(|| crate::tools::agent::with_js_dashes(EXIT_WORKTREE_PROMPT))
    }

    fn input_schema(&self) -> Value {
        json!({
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "action": {
                    "description": "\"keep\" leaves the worktree and branch on disk; \"remove\" deletes both.",
                    "type": "string",
                    "enum": ["keep", "remove"]
                },
                "discard_changes": {
                    "description": "Required true when action is \"remove\" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.",
                    "type": "boolean"
                }
            },
            "required": ["action"],
            "additionalProperties": false
        })
    }

    async fn validate_input(&self, input: &Value, context: &ToolContext) -> Result<(), String> {
        let session = context
            .task_store
            .as_ref()
            .and_then(|s| s.worktree_session());
        let Some(session) = session else {
            return Err(crate::tools::agent::with_js_dashes("No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session [[EM]] it will not touch worktrees created manually or in a previous session. No filesystem changes were made."));
        };
        let remove = input.get("action").and_then(Value::as_str) == Some("remove");
        let discard = input
            .get("discard_changes")
            .and_then(Value::as_bool)
            .unwrap_or(false);
        if remove && !discard {
            let path = session.worktree_path.display().to_string();
            let Some((files, commits)) = count_worktree_changes(
                &session.worktree_path,
                session.original_head_commit.as_deref(),
            )
            .await
            else {
                return Err(crate::tools::agent::with_js_dashes(&format!(
                    "Could not verify worktree state at {path}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed [[EM]] or use action: \"keep\" to preserve the worktree."
                )));
            };
            if files > 0 || commits > 0 {
                let mut parts = Vec::new();
                if files > 0 {
                    parts.push(format!(
                        "{} uncommitted {}",
                        files,
                        if files == 1 { "file" } else { "files" }
                    ));
                }
                if commits > 0 {
                    parts.push(format!(
                        "{} on {}",
                        plural(commits, "commit", "commits"),
                        session
                            .worktree_branch
                            .clone()
                            .unwrap_or_else(|| "the worktree branch".to_string())
                    ));
                }
                return Err(crate::tools::agent::with_js_dashes(&format!(
                    "Worktree has {}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true [[EM]] or use action: \"keep\" to preserve the worktree.",
                    parts.join(" and ")
                )));
            }
        }
        Ok(())
    }

    async fn check_permissions(
        &self,
        _input: &Value,
        _context: &ToolContext,
        _rules: &PermissionRules,
    ) -> PermissionResult {
        PermissionResult::allow()
    }

    async fn execute(&self, input: Value, context: &ToolContext) -> ToolResult {
        let Some(store) = context.task_store.clone() else {
            return ToolResult::error("Not in a worktree session");
        };
        let Some(session) = store.worktree_session() else {
            return ToolResult::error("Not in a worktree session");
        };
        let (files, commits) = count_worktree_changes(
            &session.worktree_path,
            session.original_head_commit.as_deref(),
        )
        .await
        .unwrap_or((0, 0));
        let original = session.original_cwd.display().to_string();
        let path = session.worktree_path.display().to_string();
        let mut data = Map::new();
        if input.get("action").and_then(Value::as_str) == Some("keep") {
            store.set_worktree_session(None);
            let branch_note = session
                .worktree_branch
                .as_ref()
                .map(|b| format!(" on branch {b}"))
                .unwrap_or_default();
            let message = format!(
                "Exited worktree. Your work is preserved at {path}{branch_note}. Session is now back in {original}."
            );
            data.insert("action".into(), json!("keep"));
            data.insert("originalCwd".into(), json!(original));
            data.insert("worktreePath".into(), json!(path));
            if let Some(branch) = &session.worktree_branch {
                data.insert("worktreeBranch".into(), json!(branch));
            }
            data.insert("message".into(), json!(message));
            return ToolResult::text(message).with_tool_use_result(Value::Object(data));
        }
        // `cleanupWorktree`: remove a worktree e apaga a branch.
        let _ = git(
            &session.original_cwd,
            &["worktree", "remove", "--force", &path],
        )
        .await;
        store.set_worktree_session(None);
        if let Some(branch) = &session.worktree_branch {
            tokio::time::sleep(std::time::Duration::from_millis(100)).await;
            let _ = git(&session.original_cwd, &["branch", "-D", branch]).await;
        }
        let mut discarded = Vec::new();
        if commits > 0 {
            discarded.push(plural(commits, "commit", "commits"));
        }
        if files > 0 {
            discarded.push(format!(
                "{} uncommitted {}",
                files,
                if files == 1 { "file" } else { "files" }
            ));
        }
        let note = if discarded.is_empty() {
            String::new()
        } else {
            format!(" Discarded {}.", discarded.join(" and "))
        };
        let message = format!(
            "Exited and removed worktree at {path}.{note} Session is now back in {original}."
        );
        data.insert("action".into(), json!("remove"));
        data.insert("originalCwd".into(), json!(original));
        data.insert("worktreePath".into(), json!(path));
        if let Some(branch) = &session.worktree_branch {
            data.insert("worktreeBranch".into(), json!(branch));
        }
        data.insert("discardedFiles".into(), json!(files));
        data.insert("discardedCommits".into(), json!(commits));
        data.insert("message".into(), json!(message));
        ToolResult::text(message).with_tool_use_result(Value::Object(data))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slug_validation_matches_the_js_messages() {
        assert!(validate_worktree_slug("feature/x-1.2").is_ok());
        assert_eq!(
            validate_worktree_slug("a/../b").unwrap_err(),
            "Invalid worktree name \"a/../b\": must not contain \".\" or \"..\" path segments"
        );
        assert!(validate_worktree_slug("com espaço").is_err());
        assert!(validate_worktree_slug(&"a".repeat(65))
            .unwrap_err()
            .starts_with("Invalid worktree name: must be 64 characters or fewer (got 65)"));
        assert!(validate_worktree_slug(&random_worktree_slug()).is_ok());
    }
}
