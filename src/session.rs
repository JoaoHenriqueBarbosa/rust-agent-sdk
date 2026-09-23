// Persistência de sessão: o transcript JSONL no formato e no caminho do CLI,
// para que uma sessão criada por um seja retomada pelo outro (o `~/.claude`
// pode ser compartilhado entre processos dos dois lados).
//
// Caminho: `<CLAUDE_CONFIG_DIR ou $HOME/.claude>/projects/<cwd sanitizado>/<session_id>.jsonl`
// (`getTranscriptPath` + `getProjectDir` + `sanitizePath` do CLI). Cada linha
// de mensagem é uma entrada do `insertMessageChain` (`sessionStorage/Project.js`):
// `parentUuid`, `logicalParentUuid` (só no compact boundary), `isSidechain`,
// `promptId` (só nas de usuário), a mensagem interna espalhada (`type`,
// `message`, `uuid`, `timestamp`, `requestId`, `toolUseResult`,
// `sourceToolAssistantUUID`, `isMeta`...) e por fim `userType`,
// `entrypoint`, `cwd`, `sessionId`, `version` e `gitBranch`.

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use serde_json::{json, Map, Value};
use tokio::io::AsyncWriteExt;

use crate::errors::{ClaudeSDKError, Result};
use crate::internal::sessions::{canonicalize_path, cli_config_home_dir, cli_project_dir};
use crate::internal::transcript_load::{
    is_compact_boundary, load_conversation_from_str, LoadedConversation,
};

/// A versão do CLI de referência, gravada em `version` como o `VERSION` do JS.
pub const CLI_VERSION: &str = "2.1.90";

/// O `CLAUDE_CODE_ENTRYPOINT` que o transporte por subprocesso deste SDK
/// passa ao CLI (o `env` das opções pode trocar).
pub const DEFAULT_ENTRYPOINT: &str = "sdk-rs";

/// Manages session persistence to JSONL files, compatible with the
/// Claude Code CLI transcript format.
#[derive(Debug, Clone)]
pub struct SessionStorage {
    project_dir: PathBuf,
    cwd: String,
    entrypoint: Option<String>,
}

/// O resultado de gravar uma sequência de mensagens.
#[derive(Debug, Clone, Default)]
pub struct ChainWrite {
    /// As entradas gravadas, na ordem (as mesmas que o mirror espelha).
    pub entries: Vec<Value>,
    /// O uuid da última mensagem que participa da cadeia (o próximo pai).
    pub last_uuid: Option<String>,
}

/// O contexto que o `insertMessageChain` acrescenta a cada mensagem.
#[derive(Debug, Clone, Copy)]
pub struct EntryContext<'a> {
    pub session_id: &'a str,
    pub cwd: &'a str,
    pub entrypoint: Option<&'a str>,
    pub git_branch: Option<&'a str>,
    pub prompt_id: Option<&'a str>,
}

impl SessionStorage {
    /// Create session storage for a given working directory.
    /// Uses the same path scheme as the CLI: ~/.claude/projects/{project_key}/
    pub async fn for_cwd(cwd: &str) -> Result<Self> {
        Self::for_cwd_with_env(cwd, None).await
    }

    /// Como [`Self::for_cwd`], mas com o `env` das opções mesclado sobre o
    /// do processo, como o CLI subprocesso o veria: `CLAUDE_CONFIG_DIR` e
    /// `HOME` dali decidem a raiz, e `CLAUDE_CODE_ENTRYPOINT` o `entrypoint`
    /// das entradas.
    pub async fn for_cwd_with_env(
        cwd: &str,
        env: Option<&HashMap<String, String>>,
    ) -> Result<Self> {
        let canonical = canonicalize_path(cwd);
        let projects_dir = cli_config_home_dir(env).join("projects");
        let project_dir = cli_project_dir(&projects_dir, &canonical);
        tokio::fs::create_dir_all(&project_dir).await.map_err(|e| {
            ClaudeSDKError::sdk(format!(
                "Failed to create session directory {}: {e}",
                project_dir.display()
            ))
        })?;
        let entrypoint = env
            .and_then(|e| e.get("CLAUDE_CODE_ENTRYPOINT").cloned())
            .or_else(|| Some(DEFAULT_ENTRYPOINT.to_string()));
        Ok(Self {
            project_dir,
            cwd: canonical,
            entrypoint,
        })
    }

    /// Caminho do JSONL desta sessão, público porque o transporte nativo
    /// precisa dele para `transcript_path` dos hooks e para o mirror.
    pub fn session_path(&self, session_id: &str) -> PathBuf {
        self.project_dir.join(format!("{session_id}.jsonl"))
    }

    /// O diretório de projeto dos transcripts.
    pub fn project_dir(&self) -> &Path {
        &self.project_dir
    }

    /// O `cwd` gravado nas entradas (canonicalizado, como o `getCwd` do CLI).
    pub fn cwd(&self) -> &str {
        &self.cwd
    }

    /// Carrega a conversa gravada, como o `--resume <id>` do CLI a
    /// reconstrói. `None` quando não há transcript (ou ele não tem mensagem).
    pub async fn load_conversation(&self, session_id: &str) -> Result<Option<LoadedConversation>> {
        let path = self.session_path(session_id);
        if !path.exists() {
            return Ok(None);
        }
        let content = tokio::fs::read_to_string(&path).await.map_err(|e| {
            ClaudeSDKError::sdk(format!("Failed to read session {session_id}: {e}"))
        })?;
        Ok(load_conversation_from_str(&content))
    }

    /// Grava mensagens internas como o `insertMessageChain` do CLI: cada uma
    /// recebe o `parentUuid` da anterior que participa da cadeia (um
    /// resultado de tool aponta para o bloco de assistente que o pediu), e o
    /// compact boundary começa uma cadeia nova com `logicalParentUuid`.
    pub async fn append_chain(
        &self,
        session_id: &str,
        messages: &[Value],
        starting_parent: Option<&str>,
        prompt_id: Option<&str>,
    ) -> Result<ChainWrite> {
        if messages.is_empty() {
            return Ok(ChainWrite {
                entries: Vec::new(),
                last_uuid: starting_parent.map(str::to_string),
            });
        }
        let branch = git_branch(Path::new(&self.cwd));
        let ctx = EntryContext {
            session_id,
            cwd: &self.cwd,
            entrypoint: self.entrypoint.as_deref(),
            git_branch: Some(&branch),
            prompt_id,
        };
        let write = build_chain_entries(messages, starting_parent, &ctx);
        self.append_lines(session_id, &write.entries).await?;
        Ok(write)
    }

    /// Append the AI generated session title, in the same entry shape the CLI
    /// writes (`{"type":"ai-title","aiTitle":...,"sessionId":...}`).
    /// Returns the written entry so the caller can mirror it.
    pub async fn append_ai_title(&self, session_id: &str, ai_title: &str) -> Result<Value> {
        let entry = json!({
            "type": "ai-title",
            "aiTitle": ai_title,
            "sessionId": session_id,
        });
        self.append_lines(session_id, std::slice::from_ref(&entry))
            .await?;
        Ok(entry)
    }

    /// Acrescenta as entradas ao JSONL numa escrita só.
    async fn append_lines(&self, session_id: &str, entries: &[Value]) -> Result<()> {
        let mut buf = String::new();
        for entry in entries {
            let json = serde_json::to_string(entry)
                .map_err(|e| ClaudeSDKError::sdk(format!("Failed to serialize entry: {e}")))?;
            buf.push_str(&json);
            buf.push('\n');
        }
        let path = self.session_path(session_id);
        let mut file = tokio::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&path)
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to open session file: {e}")))?;
        file.write_all(buf.as_bytes())
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to write to session file: {e}")))?;
        // O `File` do tokio escreve em segundo plano: sem o flush, a entrada
        // pode não estar no disco quando o mirror e o frame seguinte saem.
        file.flush()
            .await
            .map_err(|e| ClaudeSDKError::sdk(format!("Failed to flush session file: {e}")))?;
        Ok(())
    }

    /// Check if a session exists.
    pub fn exists(&self, session_id: &str) -> bool {
        self.session_path(session_id).exists()
    }
}

/// O `insertMessageChain` puro: monta as entradas sem gravar.
///
/// A ordem das chaves é a do objeto literal do JS: as do cabeçalho
/// (`parentUuid`, `logicalParentUuid`, `isSidechain`, `promptId`), depois as
/// da mensagem (que mantêm a posição do cabeçalho quando repetem uma chave,
/// como no spread), depois as do contexto (`userType`, `entrypoint`, `cwd`,
/// `sessionId`, `version`, `gitBranch`), que sempre valem as atuais.
pub fn build_chain_entries(
    messages: &[Value],
    starting_parent: Option<&str>,
    ctx: &EntryContext<'_>,
) -> ChainWrite {
    let mut parent = starting_parent.map(str::to_string);
    let mut entries = Vec::with_capacity(messages.len());
    for message in messages {
        let is_boundary = is_compact_boundary(message);
        let msg_type = message.get("type").and_then(Value::as_str).unwrap_or("");
        let mut effective_parent = parent.clone();
        if msg_type == "user" {
            if let Some(source) = message
                .get("sourceToolAssistantUUID")
                .and_then(Value::as_str)
                .filter(|s| !s.is_empty())
            {
                effective_parent = Some(source.to_string());
            }
        }
        let mut entry = Map::new();
        entry.insert(
            "parentUuid".into(),
            if is_boundary {
                Value::Null
            } else {
                effective_parent.map_or(Value::Null, Value::String)
            },
        );
        if is_boundary {
            entry.insert(
                "logicalParentUuid".into(),
                parent.clone().map_or(Value::Null, Value::String),
            );
        }
        entry.insert("isSidechain".into(), json!(false));
        if msg_type == "user" {
            if let Some(prompt_id) = ctx.prompt_id {
                entry.insert("promptId".into(), json!(prompt_id));
            }
        }
        if let Some(obj) = message.as_object() {
            for (k, v) in obj {
                entry.insert(k.clone(), v.clone());
            }
        }
        entry.insert("userType".into(), json!("external"));
        match ctx.entrypoint {
            Some(ep) => {
                entry.insert("entrypoint".into(), json!(ep));
            }
            None => {
                entry.shift_remove("entrypoint");
            }
        }
        entry.insert("cwd".into(), json!(ctx.cwd));
        entry.insert("sessionId".into(), json!(ctx.session_id));
        entry.insert("version".into(), json!(CLI_VERSION));
        match ctx.git_branch {
            Some(branch) => {
                entry.insert("gitBranch".into(), json!(branch));
            }
            None => {
                entry.shift_remove("gitBranch");
            }
        }
        // `isChainParticipant`: só o `progress` fica fora da cadeia.
        if msg_type != "progress" {
            if let Some(uuid) = message.get("uuid").and_then(Value::as_str) {
                parent = Some(uuid.to_string());
            }
        }
        entries.push(Value::Object(entry));
    }
    ChainWrite {
        entries,
        last_uuid: parent,
    }
}

/// O `getBranch()` do CLI (`computeBranch` em `git/gitFilesystem.js`): sobe a
/// partir de `cwd` até achar um `.git` (diretório, ou arquivo `gitdir:` de
/// worktree), lê o `HEAD` e devolve o nome do branch; fora de um repositório,
/// em HEAD destacado ou com ref suspeito, `"HEAD"`.
pub fn git_branch(cwd: &Path) -> String {
    const DETACHED: &str = "HEAD";
    let Some(root) = find_git_root(cwd) else {
        return DETACHED.to_string();
    };
    let git_path = root.join(".git");
    let git_dir = if git_path.is_file() {
        match std::fs::read_to_string(&git_path) {
            Ok(content) => match content.trim().strip_prefix("gitdir:") {
                Some(raw) => root.join(raw.trim()),
                None => git_path,
            },
            Err(_) => return DETACHED.to_string(),
        }
    } else {
        git_path
    };
    let Ok(head) = std::fs::read_to_string(git_dir.join("HEAD")) else {
        return DETACHED.to_string();
    };
    let head = head.trim();
    if let Some(reference) = head.strip_prefix("ref:") {
        if let Some(name) = reference.trim().strip_prefix("refs/heads/") {
            if is_safe_ref_name(name) {
                return name.to_string();
            }
        }
    }
    DETACHED.to_string()
}

/// `findGitRoot`: o primeiro ancestral de `start` com `.git`.
fn find_git_root(start: &Path) -> Option<PathBuf> {
    let mut current = Some(start);
    while let Some(dir) = current {
        if dir.join(".git").exists() {
            return Some(dir.to_path_buf());
        }
        current = dir.parent();
    }
    None
}

/// `isSafeRefName`.
fn is_safe_ref_name(name: &str) -> bool {
    !name.is_empty()
        && !name.starts_with('-')
        && !name.starts_with('/')
        && !name.contains("..")
        && !name.split('/').any(|c| c == "." || c.is_empty())
        && name
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || "/._+@-".contains(c))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn ctx<'a>(prompt_id: Option<&'a str>) -> EntryContext<'a> {
        EntryContext {
            session_id: "s1",
            cwd: "/w",
            entrypoint: Some("sdk-rs"),
            git_branch: Some("main"),
            prompt_id,
        }
    }

    #[test]
    fn entries_follow_the_cli_key_order() {
        let user = json!({"type": "user", "message": {"role": "user", "content": "oi"}, "uuid": "u1", "timestamp": "t"});
        let assistant = json!({"message": {"id": "m"}, "requestId": "req_1", "type": "assistant", "uuid": "a1", "timestamp": "t"});
        let write = build_chain_entries(&[user, assistant], None, &ctx(Some("p1")));
        let keys: Vec<Vec<&str>> = write
            .entries
            .iter()
            .map(|e| e.as_object().unwrap().keys().map(String::as_str).collect())
            .collect();
        assert_eq!(
            keys[0],
            vec![
                "parentUuid",
                "isSidechain",
                "promptId",
                "type",
                "message",
                "uuid",
                "timestamp",
                "userType",
                "entrypoint",
                "cwd",
                "sessionId",
                "version",
                "gitBranch"
            ]
        );
        assert_eq!(
            keys[1],
            vec![
                "parentUuid",
                "isSidechain",
                "message",
                "requestId",
                "type",
                "uuid",
                "timestamp",
                "userType",
                "entrypoint",
                "cwd",
                "sessionId",
                "version",
                "gitBranch"
            ]
        );
        assert_eq!(write.entries[1]["parentUuid"], json!("u1"));
        assert_eq!(write.last_uuid.as_deref(), Some("a1"));
    }

    #[test]
    fn tool_results_chain_to_their_source_block_and_boundaries_restart_the_chain() {
        let messages = vec![
            json!({"message": {}, "type": "assistant", "uuid": "a1", "timestamp": "t"}),
            json!({"message": {}, "type": "assistant", "uuid": "a2", "timestamp": "t"}),
            json!({"type": "user", "message": {}, "uuid": "r1", "timestamp": "t", "sourceToolAssistantUUID": "a1"}),
            json!({"type": "system", "subtype": "compact_boundary", "uuid": "b1", "timestamp": "t"}),
        ];
        let write = build_chain_entries(&messages, Some("u0"), &ctx(None));
        assert_eq!(write.entries[0]["parentUuid"], json!("u0"));
        assert_eq!(write.entries[2]["parentUuid"], json!("a1"));
        assert_eq!(write.entries[3]["parentUuid"], Value::Null);
        assert_eq!(write.entries[3]["logicalParentUuid"], json!("r1"));
        assert!(write.entries[2].get("promptId").is_none());
    }

    #[test]
    fn git_branch_reads_head_and_falls_back_to_head() {
        let dir = tempfile::tempdir().unwrap();
        assert_eq!(git_branch(dir.path()), "HEAD");
        std::fs::create_dir_all(dir.path().join(".git")).unwrap();
        std::fs::write(dir.path().join(".git/HEAD"), "ref: refs/heads/feat/x\n").unwrap();
        let nested = dir.path().join("a/b");
        std::fs::create_dir_all(&nested).unwrap();
        assert_eq!(git_branch(&nested), "feat/x");
        std::fs::write(
            dir.path().join(".git/HEAD"),
            "0123456789abcdef0123456789abcdef01234567\n",
        )
        .unwrap();
        assert_eq!(git_branch(dir.path()), "HEAD");
    }
}
