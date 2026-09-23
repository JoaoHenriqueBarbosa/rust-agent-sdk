//! Cache do estado de leitura dos arquivos da sessão, o `readFileState` do
//! CLI (`utils/fileStateCache.js`).
//!
//! O Read grava aqui o que leu (conteúdo, mtime e o recorte offset/limit); o
//! Edit e o Write consultam para recusar a escrita num arquivo que o modelo
//! não leu, ou que mudou no disco depois da leitura; e o próprio Read usa o
//! registro para devolver o stub de "arquivo inalterado" em vez de reenviar o
//! mesmo conteúdo.
//!
//! Como no JS, é um LRU com teto de entradas (100) e de bytes somados dos
//! conteúdos (25MB), com a chave normalizada.

use std::collections::VecDeque;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

/// `READ_FILE_STATE_CACHE_SIZE` do JS.
pub const READ_FILE_STATE_CACHE_SIZE: usize = 100;

/// `DEFAULT_MAX_CACHE_SIZE_BYTES` do JS (25MB).
pub const DEFAULT_MAX_CACHE_SIZE_BYTES: usize = 26_214_400;

/// Uma entrada do cache: a forma do objeto que o JS guarda.
#[derive(Debug, Clone, PartialEq)]
pub struct FileState {
    /// O conteúdo lido (para o Read: o arquivo inteiro com `\r\n` trocado por
    /// `\n`; para Edit/Write: o conteúdo gravado).
    pub content: String,
    /// mtime do arquivo em milissegundos desde a época, no momento da leitura.
    pub timestamp: i64,
    /// O `offset` pedido na leitura (`None` quando a entrada vem de escrita).
    pub offset: Option<u64>,
    /// O `limit` pedido na leitura.
    pub limit: Option<u64>,
    /// Leitura parcial (o JS marca assim leituras que não cobriram o arquivo).
    pub is_partial_view: bool,
}

#[derive(Debug, Default)]
struct Inner {
    /// Ordem de uso, do menos para o mais recente.
    order: VecDeque<PathBuf>,
    entries: std::collections::HashMap<PathBuf, FileState>,
    total_bytes: usize,
}

/// O cache em si, compartilhável entre as tools da sessão.
#[derive(Debug)]
pub struct FileStateCache {
    max_entries: usize,
    max_bytes: usize,
    inner: Mutex<Inner>,
}

impl Default for FileStateCache {
    fn default() -> Self {
        Self::new(READ_FILE_STATE_CACHE_SIZE, DEFAULT_MAX_CACHE_SIZE_BYTES)
    }
}

/// O `path.normalize` do Node: colapsa `.` e `a/..` sem tocar no disco.
pub fn normalize_path(path: &Path) -> PathBuf {
    use std::path::Component;
    let mut out = PathBuf::new();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                if !out.pop() {
                    out.push("..");
                }
            }
            other => out.push(other.as_os_str()),
        }
    }
    out
}

fn entry_size(state: &FileState) -> usize {
    state.content.len().max(1)
}

impl FileStateCache {
    pub fn new(max_entries: usize, max_bytes: usize) -> Self {
        Self {
            max_entries,
            max_bytes,
            inner: Mutex::new(Inner::default()),
        }
    }

    fn lock(&self) -> std::sync::MutexGuard<'_, Inner> {
        self.inner.lock().unwrap_or_else(|e| e.into_inner())
    }

    /// Lê a entrada e a marca como a mais recente (o `get` do lru-cache).
    pub fn get(&self, path: &Path) -> Option<FileState> {
        let key = normalize_path(path);
        let mut inner = self.lock();
        let found = inner.entries.get(&key).cloned();
        if found.is_some() {
            inner.order.retain(|p| p != &key);
            inner.order.push_back(key);
        }
        found
    }

    pub fn has(&self, path: &Path) -> bool {
        self.lock().entries.contains_key(&normalize_path(path))
    }

    pub fn set(&self, path: &Path, state: FileState) {
        let key = normalize_path(path);
        let size = entry_size(&state);
        let mut inner = self.lock();
        if let Some(old) = inner.entries.remove(&key) {
            inner.total_bytes -= entry_size(&old);
            inner.order.retain(|p| p != &key);
        }
        // Entrada maior que o teto inteiro não entra (o lru-cache recusa).
        if size > self.max_bytes {
            return;
        }
        inner.total_bytes += size;
        inner.entries.insert(key.clone(), state);
        inner.order.push_back(key);
        while inner.entries.len() > self.max_entries || inner.total_bytes > self.max_bytes {
            let Some(oldest) = inner.order.pop_front() else {
                break;
            };
            if let Some(evicted) = inner.entries.remove(&oldest) {
                inner.total_bytes -= entry_size(&evicted);
            }
        }
    }

    pub fn delete(&self, path: &Path) {
        let key = normalize_path(path);
        let mut inner = self.lock();
        if let Some(old) = inner.entries.remove(&key) {
            inner.total_bytes -= entry_size(&old);
            inner.order.retain(|p| p != &key);
        }
    }

    pub fn clear(&self) {
        let mut inner = self.lock();
        inner.entries.clear();
        inner.order.clear();
        inner.total_bytes = 0;
    }

    pub fn len(&self) -> usize {
        self.lock().entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }

    /// Cópia independente, o `cloneFileStateCache` que o JS usa ao abrir um
    /// subagente: ele começa sabendo o que o pai leu, mas o que ele ler não
    /// volta para o pai.
    pub fn snapshot(&self) -> Self {
        let inner = self.lock();
        let copy = Self::new(self.max_entries, self.max_bytes);
        {
            let mut target = copy.lock();
            target.order = inner.order.clone();
            target.entries = inner.entries.clone();
            target.total_bytes = inner.total_bytes;
        }
        copy
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn state(content: &str) -> FileState {
        FileState {
            content: content.to_string(),
            timestamp: 1,
            offset: None,
            limit: None,
            is_partial_view: false,
        }
    }

    #[test]
    fn key_is_normalized() {
        let cache = FileStateCache::default();
        cache.set(Path::new("/a/b/../c.txt"), state("x"));
        assert!(cache.has(Path::new("/a/./c.txt")));
    }

    #[test]
    fn evicts_least_recently_used_over_entry_limit() {
        let cache = FileStateCache::new(2, 1_000);
        cache.set(Path::new("/1"), state("a"));
        cache.set(Path::new("/2"), state("b"));
        // Usar /1 o torna o mais recente; /2 sai quando /3 entra.
        cache.get(Path::new("/1"));
        cache.set(Path::new("/3"), state("c"));
        assert!(cache.has(Path::new("/1")));
        assert!(!cache.has(Path::new("/2")));
        assert!(cache.has(Path::new("/3")));
    }

    #[test]
    fn evicts_over_byte_limit() {
        let cache = FileStateCache::new(10, 5);
        cache.set(Path::new("/1"), state("abc"));
        cache.set(Path::new("/2"), state("de"));
        cache.set(Path::new("/3"), state("f"));
        assert!(!cache.has(Path::new("/1")));
        assert_eq!(cache.len(), 2);
    }

    #[test]
    fn snapshot_is_independent() {
        let cache = FileStateCache::default();
        cache.set(Path::new("/1"), state("a"));
        let copy = cache.snapshot();
        copy.set(Path::new("/2"), state("b"));
        assert!(copy.has(Path::new("/1")));
        assert!(!cache.has(Path::new("/2")));
    }
}
