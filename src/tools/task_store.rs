//! Estado in-process compartilhado pelas tools de tarefa: a lista TodoV2
//! (TaskCreate/Get/List/Update) e os processos em background do Bash
//! (run_in_background → TaskOutput/TaskStop).

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;

use serde::Serialize;

/// Um item da lista de tarefas (TodoV2).
#[derive(Debug, Clone, Serialize)]
pub struct TaskRecord {
    pub id: String,
    pub subject: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// "pending" | "in_progress" | "completed" | "cancelled"
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub active_form: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub owner: Option<String>,
}

/// Um processo em background (Bash run_in_background).
pub struct BackgroundTask {
    pub id: String,
    pub description: String,
    /// O comando do shell (o `command` que o TaskStop do JS devolve); vazio
    /// quando quem registrou não informou.
    pub command: String,
    pub output_path: PathBuf,
    /// Handle para matar o processo; `None` depois que terminou/foi morto.
    pub child: Option<tokio::process::Child>,
    pub finished: bool,
    pub exit_code: Option<i32>,
    /// Morto pelo TaskStop (status `killed` no JS).
    pub killed: bool,
}

/// O retrato de uma task de background, na forma que o TaskOutput e o
/// TaskStop do JS usam.
#[derive(Debug, Clone, PartialEq)]
pub struct BackgroundSnapshot {
    pub id: String,
    /// `local_bash`.
    pub task_type: String,
    /// `running`, `completed`, `failed` ou `killed`.
    pub status: String,
    pub description: String,
    pub command: String,
    pub exit_code: Option<i32>,
    pub output_path: PathBuf,
}

/// Uma sessão de worktree aberta pelo EnterWorktree (o
/// `currentWorktreeSession` do JS).
#[derive(Debug, Clone, PartialEq)]
pub struct WorktreeSession {
    pub original_cwd: PathBuf,
    pub worktree_path: PathBuf,
    pub worktree_name: String,
    pub worktree_branch: Option<String>,
    pub original_branch: Option<String>,
    pub original_head_commit: Option<String>,
}

/// Estado de sessão que as tools de plano e de worktree precisam guardar
/// entre chamadas.
#[derive(Debug, Default)]
struct SessionSlots {
    /// O modo antes de entrar em plan (o `prePlanMode` do JS).
    pre_plan_mode: Option<crate::types::PermissionMode>,
    /// O slug do arquivo de plano da sessão (`getPlanSlug`).
    plan_slug: Option<String>,
    /// A sessão de worktree ativa.
    worktree: Option<WorktreeSession>,
}

/// Store por sessão. As tools recebem um `Arc<TaskStore>` via `ToolContext`.
#[derive(Default)]
pub struct TaskStore {
    counter: AtomicU64,
    tasks: Mutex<Vec<TaskRecord>>,
    background: tokio::sync::Mutex<HashMap<String, BackgroundTask>>,
    session: Mutex<SessionSlots>,
}

impl TaskStore {
    pub fn new() -> Self {
        Self::default()
    }

    fn next_id(&self, prefix: &str) -> String {
        let n = self.counter.fetch_add(1, Ordering::Relaxed) + 1;
        format!("{prefix}{n}")
    }

    // ── TodoV2 ─────────────────────────────────────────────────────────

    pub fn create_task(
        &self,
        subject: String,
        description: Option<String>,
        active_form: Option<String>,
    ) -> TaskRecord {
        let record = TaskRecord {
            id: self.next_id(""),
            subject,
            description,
            status: "pending".to_string(),
            active_form,
            owner: None,
        };
        self.tasks.lock().unwrap().push(record.clone());
        record
    }

    pub fn get_task(&self, id: &str) -> Option<TaskRecord> {
        self.tasks
            .lock()
            .unwrap()
            .iter()
            .find(|t| t.id == id)
            .cloned()
    }

    pub fn list_tasks(&self) -> Vec<TaskRecord> {
        self.tasks.lock().unwrap().clone()
    }

    /// Atualiza campos presentes; devolve o registro novo ou None se não existe.
    pub fn update_task(
        &self,
        id: &str,
        subject: Option<String>,
        description: Option<String>,
        status: Option<String>,
        active_form: Option<String>,
        owner: Option<String>,
    ) -> Option<TaskRecord> {
        let mut tasks = self.tasks.lock().unwrap();
        let task = tasks.iter_mut().find(|t| t.id == id)?;
        if let Some(s) = subject {
            task.subject = s;
        }
        if let Some(d) = description {
            task.description = Some(d);
        }
        if let Some(s) = status {
            task.status = s;
        }
        if let Some(a) = active_form {
            task.active_form = Some(a);
        }
        if let Some(o) = owner {
            task.owner = Some(o);
        }
        Some(task.clone())
    }

    // ── Background (Bash) ──────────────────────────────────────────────

    pub async fn register_background(
        &self,
        description: String,
        output_path: PathBuf,
        child: tokio::process::Child,
    ) -> String {
        self.register_background_command(description, String::new(), output_path, child)
            .await
    }

    /// Registra um processo de background guardando também o comando, que
    /// o TaskStop devolve.
    pub async fn register_background_command(
        &self,
        description: String,
        command: String,
        output_path: PathBuf,
        child: tokio::process::Child,
    ) -> String {
        let id = self.next_id("bash_");
        self.background.lock().await.insert(
            id.clone(),
            BackgroundTask {
                id: id.clone(),
                description,
                command,
                output_path,
                child: Some(child),
                finished: false,
                exit_code: None,
                killed: false,
            },
        );
        id
    }

    /// O retrato de uma task (com poll do processo); `None` se não existe.
    pub async fn background_snapshot(&self, id: &str) -> Option<BackgroundSnapshot> {
        let mut map = self.background.lock().await;
        let task = map.get_mut(id)?;
        poll_task(task);
        Some(snapshot_of(task))
    }

    /// Mata a task e devolve o retrato de antes da morte (para o TaskStop,
    /// que exige `running`). `None` se não existe.
    pub async fn kill_background(&self, id: &str) -> Option<BackgroundSnapshot> {
        let mut map = self.background.lock().await;
        let task = map.get_mut(id)?;
        poll_task(task);
        let before = snapshot_of(task);
        if let Some(child) = task.child.as_mut() {
            let _ = child.kill().await;
            task.child = None;
        }
        task.finished = true;
        task.killed = true;
        Some(before)
    }

    // ── Estado de sessão: plano e worktree ─────────────────────────────

    fn slots(&self) -> std::sync::MutexGuard<'_, SessionSlots> {
        self.session.lock().unwrap_or_else(|e| e.into_inner())
    }

    /// Guarda o modo de antes do plan mode (o engine deve chamar isto
    /// também quando o cliente troca o modo para `plan`).
    pub fn set_pre_plan_mode(&self, mode: Option<crate::types::PermissionMode>) {
        self.slots().pre_plan_mode = mode;
    }

    /// Tira o modo de antes do plan mode (consumido ao sair do plano).
    pub fn take_pre_plan_mode(&self) -> Option<crate::types::PermissionMode> {
        self.slots().pre_plan_mode.take()
    }

    /// O slug do arquivo de plano, gerado uma vez por sessão.
    pub fn plan_slug(&self, generate: impl FnOnce() -> String) -> String {
        let mut slots = self.slots();
        slots.plan_slug.get_or_insert_with(generate).clone()
    }

    pub fn worktree_session(&self) -> Option<WorktreeSession> {
        self.slots().worktree.clone()
    }

    pub fn set_worktree_session(&self, session: Option<WorktreeSession>) {
        self.slots().worktree = session;
    }

    /// O cwd efetivo da sessão: o da worktree ativa, quando há. As tools que
    /// dependem do cwd devem preferir este ao `working_directory` estático.
    pub fn effective_cwd(&self) -> Option<PathBuf> {
        self.slots()
            .worktree
            .as_ref()
            .map(|w| w.worktree_path.clone())
    }

    /// Estado + output atual de uma task de background. Faz o poll do
    /// processo (try_wait) e devolve (existe, terminou, exit_code, output_path).
    pub async fn background_status(&self, id: &str) -> Option<(bool, Option<i32>, PathBuf)> {
        let mut map = self.background.lock().await;
        let task = map.get_mut(id)?;
        if !task.finished {
            if let Some(child) = task.child.as_mut() {
                if let Ok(Some(status)) = child.try_wait() {
                    task.finished = true;
                    task.exit_code = status.code();
                    task.child = None;
                }
            }
        }
        Some((task.finished, task.exit_code, task.output_path.clone()))
    }

    /// Mata a task de background. Devolve false se não existe.
    pub async fn stop_background(&self, id: &str) -> bool {
        let mut map = self.background.lock().await;
        let Some(task) = map.get_mut(id) else {
            return false;
        };
        if let Some(child) = task.child.as_mut() {
            let _ = child.kill().await;
            task.finished = true;
            task.exit_code = None;
            task.child = None;
            task.killed = true;
        }
        true
    }
}

fn poll_task(task: &mut BackgroundTask) {
    if task.finished {
        return;
    }
    if let Some(child) = task.child.as_mut() {
        if let Ok(Some(status)) = child.try_wait() {
            task.finished = true;
            task.exit_code = status.code();
            task.child = None;
        }
    }
}

fn snapshot_of(task: &BackgroundTask) -> BackgroundSnapshot {
    let status = if task.killed {
        "killed"
    } else if !task.finished {
        "running"
    } else if task.exit_code == Some(0) {
        "completed"
    } else {
        "failed"
    };
    BackgroundSnapshot {
        id: task.id.clone(),
        task_type: "local_bash".to_string(),
        status: status.to_string(),
        description: task.description.clone(),
        command: task.command.clone(),
        exit_code: task.exit_code,
        output_path: task.output_path.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn todo_v2_crud_roundtrip() {
        let store = TaskStore::new();
        let t = store.create_task("estudar".into(), Some("ler docs".into()), None);
        assert_eq!(t.status, "pending");
        let got = store.get_task(&t.id).unwrap();
        assert_eq!(got.subject, "estudar");
        let updated = store
            .update_task(&t.id, None, None, Some("completed".into()), None, None)
            .unwrap();
        assert_eq!(updated.status, "completed");
        assert_eq!(store.list_tasks().len(), 1);
        assert!(store.get_task("nope").is_none());
    }

    #[tokio::test]
    async fn background_lifecycle() {
        let store = TaskStore::new();
        let dir = tempfile::tempdir().unwrap();
        let out = dir.path().join("out.txt");
        let file = std::fs::File::create(&out).unwrap();
        let child = tokio::process::Command::new("sh")
            .args(["-c", "echo oi; sleep 30"])
            .stdout(std::process::Stdio::from(file))
            .spawn()
            .unwrap();
        let id = store
            .register_background("teste".into(), out.clone(), child)
            .await;
        let (finished, _, path) = store.background_status(&id).await.unwrap();
        assert!(!finished);
        assert_eq!(path, out);
        assert!(store.stop_background(&id).await);
        let (finished, _, _) = store.background_status(&id).await.unwrap();
        assert!(finished);
    }
}
