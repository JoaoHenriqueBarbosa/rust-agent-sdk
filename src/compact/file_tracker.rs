use std::collections::HashMap;
use std::path::PathBuf;
use std::time::Instant;

/// Maximum number of files to restore after compaction.
const POST_COMPACT_MAX_FILES_TO_RESTORE: usize = 10;

/// Maximum number of lines to read per file when restoring post-compact context.
pub const POST_COMPACT_MAX_LINES_PER_FILE: usize = 1000;

/// Tracks recently read files so their content can be re-attached after compaction.
///
/// Port of readFileState tracking from the TS compact module — the TS source
/// maintains a `readFileState: Record<string, { timestamp }>` that feeds into
/// `createPostCompactFileAttachments`.
#[derive(Debug)]
pub struct ReadFileTracker {
    files: HashMap<PathBuf, Instant>,
}

impl ReadFileTracker {
    pub fn new() -> Self {
        Self {
            files: HashMap::new(),
        }
    }

    /// Record that a file was read (or update its timestamp if already tracked).
    pub fn track_read(&mut self, path: impl Into<PathBuf>) {
        self.files.insert(path.into(), Instant::now());
    }

    /// Return up to `max_count` recently-read file paths, sorted most-recent first.
    /// Caps at POST_COMPACT_MAX_FILES_TO_RESTORE.
    pub fn get_recent_files(&self, max_count: usize) -> Vec<PathBuf> {
        let limit = max_count.min(POST_COMPACT_MAX_FILES_TO_RESTORE);
        let mut entries: Vec<_> = self.files.iter().collect();
        entries.sort_by(|a, b| b.1.cmp(a.1));
        entries.into_iter().take(limit).map(|(p, _)| p.clone()).collect()
    }

    /// Clear all tracked files (called after post-compact restoration).
    pub fn clear(&mut self) {
        self.files.clear();
    }
}

impl Default for ReadFileTracker {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;
    use std::time::Duration;

    #[test]
    fn test_track_and_get_recent() {
        let mut tracker = ReadFileTracker::new();
        tracker.track_read("/a.rs");
        thread::sleep(Duration::from_millis(10));
        tracker.track_read("/b.rs");
        thread::sleep(Duration::from_millis(10));
        tracker.track_read("/c.rs");

        let recent = tracker.get_recent_files(2);
        assert_eq!(recent.len(), 2);
        assert_eq!(recent[0], PathBuf::from("/c.rs"));
        assert_eq!(recent[1], PathBuf::from("/b.rs"));
    }

    #[test]
    fn test_get_recent_capped_at_max() {
        let mut tracker = ReadFileTracker::new();
        for i in 0..20 {
            tracker.track_read(format!("/file_{i}.rs"));
            thread::sleep(Duration::from_millis(1));
        }
        let recent = tracker.get_recent_files(100);
        assert_eq!(recent.len(), POST_COMPACT_MAX_FILES_TO_RESTORE);
    }

    #[test]
    fn test_update_timestamp() {
        let mut tracker = ReadFileTracker::new();
        tracker.track_read("/old.rs");
        thread::sleep(Duration::from_millis(10));
        tracker.track_read("/new.rs");
        thread::sleep(Duration::from_millis(10));
        // Re-read /old.rs — should now be most recent
        tracker.track_read("/old.rs");

        let recent = tracker.get_recent_files(1);
        assert_eq!(recent[0], PathBuf::from("/old.rs"));
    }

    #[test]
    fn test_clear() {
        let mut tracker = ReadFileTracker::new();
        tracker.track_read("/a.rs");
        tracker.clear();
        assert!(tracker.get_recent_files(10).is_empty());
    }

    #[test]
    fn test_empty_tracker() {
        let tracker = ReadFileTracker::new();
        assert!(tracker.get_recent_files(10).is_empty());
    }
}
