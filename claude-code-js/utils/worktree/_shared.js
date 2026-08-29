// Shared module state and imports
// Original: src/utils/worktree.ts
__export(exports_worktree, {
  worktreeBranchName: () => worktreeBranchName,
  validateWorktreeSlug: () => validateWorktreeSlug,
  restoreWorktreeSession: () => restoreWorktreeSession,
  removeAgentWorktree: () => removeAgentWorktree,
  parsePRReference: () => parsePRReference,
  killTmuxSession: () => killTmuxSession,
  keepWorktree: () => keepWorktree,
  isTmuxAvailable: () => isTmuxAvailable2,
  hasWorktreeChanges: () => hasWorktreeChanges,
  getTmuxInstallInstructions: () => getTmuxInstallInstructions2,
  getCurrentWorktreeSession: () => getCurrentWorktreeSession,
  generateTmuxSessionName: () => generateTmuxSessionName,
  execIntoTmuxWorktree: () => execIntoTmuxWorktree,
  createWorktreeForSession: () => createWorktreeForSession,
  createTmuxSessionForWorktree: () => createTmuxSessionForWorktree,
  createAgentWorktree: () => createAgentWorktree,
  copyWorktreeIncludeFiles: () => copyWorktreeIncludeFiles,
  cleanupWorktree: () => cleanupWorktree,
  cleanupStaleAgentWorktrees: () => cleanupStaleAgentWorktrees
});
import { spawnSync as spawnSync6 } from "child_process";
import {
  copyFile as copyFile11,
  mkdir as mkdir39,
  readdir as readdir28,
  readFile as readFile52,
  stat as stat41,
  symlink as symlink5,
  utimes as utimes2
} from "fs/promises";
import { basename as basename42, dirname as dirname59, join as join138 } from "path";
var import_ignore6, VALID_WORKTREE_SLUG_SEGMENT, MAX_WORKTREE_SLUG_LENGTH = 64, currentWorktreeSession = null, GIT_NO_PROMPT_ENV2, EPHEMERAL_WORKTREE_PATTERNS;

