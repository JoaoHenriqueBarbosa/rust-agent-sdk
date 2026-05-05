use std::future::Future;
use std::sync::{Arc, Mutex};
use tokio::task::{AbortHandle, JoinHandle};

type DoneCallback = Box<dyn FnOnce(&TaskHandle) + Send>;

/// Shared state between the TaskHandle and the watcher task.
struct SharedState {
    callbacks: Vec<DoneCallback>,
}

/// Handle to a spawned detached task.
///
/// Safe to `.cancel()` from any task — no task affinity constraints.
pub struct TaskHandle {
    join_handle: Option<JoinHandle<()>>,
    abort_handle: AbortHandle,
    state: Arc<Mutex<SharedState>>,
}

impl TaskHandle {
    /// Request cancellation of the wrapped task.
    pub fn cancel(&mut self) {
        self.abort_handle.abort();
    }

    /// Return `true` if the wrapped task has finished.
    pub fn done(&self) -> bool {
        self.abort_handle.is_finished()
    }

    /// Register a callback to run when the task finishes.
    ///
    /// If the task is already done, the callback fires immediately.
    /// Otherwise it fires from the watcher task after completion.
    pub fn add_done_callback<F: FnOnce(&TaskHandle) + Send + 'static>(&mut self, callback: F) {
        if self.done() {
            callback(self);
        } else {
            self.state.lock().unwrap().callbacks.push(Box::new(callback));
        }
    }

    /// Wait for the task to finish.
    ///
    /// Suppresses cancellation errors (the task was cancelled by us) but
    /// re-raises any panic the task raised.
    pub async fn wait(&mut self) -> Result<(), Box<dyn std::error::Error + Send>> {
        if let Some(handle) = self.join_handle.take() {
            match handle.await {
                Ok(()) => Ok(()),
                Err(join_error) if join_error.is_cancelled() => Ok(()),
                Err(join_error) => {
                    let panic_payload = join_error.into_panic();
                    let msg = if let Some(s) = panic_payload.downcast_ref::<&str>() {
                        s.to_string()
                    } else if let Some(s) = panic_payload.downcast_ref::<String>() {
                        s.clone()
                    } else {
                        "task panicked".to_string()
                    };
                    Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, msg)))
                }
            }
        } else {
            Ok(())
        }
    }
}

/// Spawn a detached async task, returning a [`TaskHandle`].
///
/// Uses `tokio::spawn` under the hood. Context propagation is automatic
/// (tokio tasks inherit the runtime context at spawn time).
pub fn spawn_detached<F>(future: F) -> TaskHandle
where
    F: Future<Output = ()> + Send + 'static,
{
    let state = Arc::new(Mutex::new(SharedState {
        callbacks: Vec::new(),
    }));

    let watcher_state = state.clone();

    // Wrap the user future so that callbacks fire after completion,
    // regardless of success/panic/cancellation.
    let wrapped = async move {
        future.await;
    };

    let join_handle = tokio::spawn(wrapped);
    let abort_handle = join_handle.abort_handle();

    // Spawn a watcher that polls for completion and fires callbacks.
    let watcher_abort = abort_handle.clone();
    tokio::spawn(async move {
        // Poll until the inner task finishes.
        while !watcher_abort.is_finished() {
            tokio::task::yield_now().await;
        }
        // Fire all registered callbacks.
        let cbs: Vec<DoneCallback> = {
            std::mem::take(&mut watcher_state.lock().unwrap().callbacks)
        };
        // Build a proxy handle for the callback signature.
        let proxy = TaskHandle {
            join_handle: None,
            abort_handle: watcher_abort,
            state: Arc::new(Mutex::new(SharedState {
                callbacks: Vec::new(),
            })),
        };
        for cb in cbs {
            cb(&proxy);
        }
    });

    TaskHandle {
        join_handle: Some(join_handle),
        abort_handle,
        state,
    }
}
