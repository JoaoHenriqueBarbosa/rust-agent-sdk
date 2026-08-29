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
    pub output_path: PathBuf,
    /// Handle para matar o processo; `None` depois que terminou/foi morto.
    pub child: Option<tokio::process::Child>,
    pub finished: bool,
    pub exit_code: Option<i32>,
}

/// Store por sessão. As tools recebem um `Arc<TaskStore>` via `ToolContext`.
#[derive(Default)]
pub struct TaskStore {
    counter: AtomicU64,
    tasks: Mutex<Vec<TaskRecord>>,
    background: tokio::sync::Mutex<HashMap<String, BackgroundTask>>,
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
        self.tasks.lock().unwrap().iter().find(|t| t.id == id).cloned()
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
        let id = self.next_id("bash_");
        self.background.lock().await.insert(
            id.clone(),
            BackgroundTask {
                id: id.clone(),
                description,
                output_path,
                child: Some(child),
                finished: false,
                exit_code: None,
            },
        );
        id
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
        }
        true
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
