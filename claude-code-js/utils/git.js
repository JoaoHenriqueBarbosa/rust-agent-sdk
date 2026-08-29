// Original: src/utils/git.ts
import { readFileSync as readFileSync5, realpathSync as realpathSync3, statSync as statSync3 } from "fs";
import { basename as basename3, dirname as dirname8, join as join12, resolve as resolve6, sep as sep3 } from "path";
function createFindGitRoot() {
  function wrapper(startPath) {
    let result = findGitRootImpl(startPath);
    return result === GIT_ROOT_NOT_FOUND ? null : result;
  }
  return wrapper.cache = findGitRootImpl.cache, wrapper;
}
function createFindCanonicalGitRoot() {
  function wrapper(startPath) {
    let root2 = findGitRoot(startPath);
    if (!root2)
      return null;
    return resolveCanonicalRoot(root2);
  }
  return wrapper.cache = resolveCanonicalRoot.cache, wrapper;
}
function getGitDir(cwd2) {
  return resolveGitDir(cwd2);
}
async function getGitState() {
  try {
    let [
      commitHash,
      branchName,
      remoteUrl,
      isHeadOnRemote,
      isClean,
      worktreeCount
    ] = await Promise.all([
      getHead(),
      getBranch(),
      getRemoteUrl(),
      getIsHeadOnRemote(),
      getIsClean(),
      getWorktreeCount()
    ]);
    return {
      commitHash,
      branchName,
      remoteUrl,
      isHeadOnRemote,
      isClean,
      worktreeCount
    };
  } catch (_) {
    return null;
  }
}
async function getGithubRepo() {
  let { parseGitRemote: parseGitRemote2 } = await Promise.resolve().then(() => (init_detectRepository(), exports_detectRepository)), remoteUrl = await getRemoteUrl();
  if (!remoteUrl)
    return logForDebugging("Local GitHub repo: unknown"), null;
  let parsed = parseGitRemote2(remoteUrl);
  if (parsed && parsed.host === "github.com") {
    let result = `${parsed.owner}/${parsed.name}`;
    return logForDebugging(`Local GitHub repo: ${result}`), result;
  }
  return logForDebugging("Local GitHub repo: unknown"), null;
}
function isCurrentDirectoryBareGitRepo() {
  let fs2 = getFsImplementation(), cwd2 = getCwd(), gitPath = join12(cwd2, ".git");
  try {
    let stats = fs2.statSync(gitPath);
    if (stats.isFile())
      return !1;
    if (stats.isDirectory()) {
      let gitHeadPath = join12(gitPath, "HEAD");
      try {
        if (fs2.statSync(gitHeadPath).isFile())
          return !1;
      } catch {}
    }
  } catch {}
  try {
    if (fs2.statSync(join12(cwd2, "HEAD")).isFile())
      return !0;
  } catch {}
  try {
    if (fs2.statSync(join12(cwd2, "objects")).isDirectory())
      return !0;
  } catch {}
  try {
    if (fs2.statSync(join12(cwd2, "refs")).isDirectory())
      return !0;
  } catch {}
  return !1;
}
var GIT_ROOT_NOT_FOUND, findGitRootImpl, findGitRoot, resolveCanonicalRoot, findCanonicalGitRoot, gitExe, getIsGit, dirIsInGitRepo = async (cwd2) => {
  return findGitRoot(cwd2) !== null;
}, getHead = async () => {
  return getCachedHead();
}, getBranch = async () => {
  return getCachedBranch();
}, getDefaultBranch = async () => {
  return getCachedDefaultBranch();
}, getRemoteUrl = async () => {
  return getCachedRemoteUrl();
}, getIsHeadOnRemote = async () => {
  let { code } = await execFileNoThrow(gitExe(), ["rev-parse", "@{u}"], {
    preserveOutputOnError: !1
  });
  return code === 0;
}, getIsClean = async (options) => {
  let args = ["--no-optional-locks", "status", "--porcelain"];
  if (options?.ignoreUntracked)
    args.push("-uno");
  let { stdout } = await execFileNoThrow(gitExe(), args, {
    preserveOutputOnError: !1
  });
  return stdout.trim().length === 0;
}, getFileStatus = async () => {
  let { stdout } = await execFileNoThrow(gitExe(), ["--no-optional-locks", "status", "--porcelain"], {
    preserveOutputOnError: !1
  }), tracked = [], untracked = [];
  return stdout.trim().split(`
`).filter((line) => line.length > 0).forEach((line) => {
    let status = line.substring(0, 2), filename = line.substring(2).trim();
    if (status === "??")
      untracked.push(filename);
    else if (filename)
      tracked.push(filename);
  }), { tracked, untracked };
}, getWorktreeCount = async () => {
  return getWorktreeCountFromFs();
}, stashToCleanState = async (message) => {
  try {
    let stashMessage = message || `Claude Code auto-stash - ${(/* @__PURE__ */ new Date()).toISOString()}`, { untracked } = await getFileStatus();
    if (untracked.length > 0) {
      let { code: addCode } = await execFileNoThrow(gitExe(), ["add", ...untracked], { preserveOutputOnError: !1 });
      if (addCode !== 0)
        return !1;
    }
    let { code } = await execFileNoThrow(gitExe(), ["stash", "push", "--message", stashMessage], { preserveOutputOnError: !1 });
    return code === 0;
  } catch (_) {
    return !1;
  }
};
var init_git = __esm(() => {
  init_memoize();
  init_files2();
  init_cwd2();
  init_debug();
  init_diagLogs();
  init_execFileNoThrow();
  init_fsOperations();
  init_gitFilesystem();
  init_log3();
  init_memoize2();
  init_which();
  GIT_ROOT_NOT_FOUND = Symbol("git-root-not-found"), findGitRootImpl = memoizeWithLRU((startPath) => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "find_git_root_started");
    let current = resolve6(startPath), root2 = current.substring(0, current.indexOf(sep3) + 1) || sep3, statCount = 0;
    while (current !== root2) {
      try {
        let gitPath = join12(current, ".git");
        statCount++;
        let stat4 = statSync3(gitPath);
        if (stat4.isDirectory() || stat4.isFile())
          return logForDiagnosticsNoPII("info", "find_git_root_completed", {
            duration_ms: Date.now() - startTime,
            stat_count: statCount,
            found: !0
          }), current.normalize("NFC");
      } catch {}
      let parent = dirname8(current);
      if (parent === current)
        break;
      current = parent;
    }
    try {
      let gitPath = join12(root2, ".git");
      statCount++;
      let stat4 = statSync3(gitPath);
      if (stat4.isDirectory() || stat4.isFile())
        return logForDiagnosticsNoPII("info", "find_git_root_completed", {
          duration_ms: Date.now() - startTime,
          stat_count: statCount,
          found: !0
        }), root2.normalize("NFC");
    } catch {}
    return logForDiagnosticsNoPII("info", "find_git_root_completed", {
      duration_ms: Date.now() - startTime,
      stat_count: statCount,
      found: !1
    }), GIT_ROOT_NOT_FOUND;
  }, (path9) => path9, 50), findGitRoot = createFindGitRoot();
  resolveCanonicalRoot = memoizeWithLRU((gitRoot) => {
    try {
      let gitContent = readFileSync5(join12(gitRoot, ".git"), "utf-8").trim();
      if (!gitContent.startsWith("gitdir:"))
        return gitRoot;
      let worktreeGitDir = resolve6(gitRoot, gitContent.slice(7).trim()), commonDir = resolve6(worktreeGitDir, readFileSync5(join12(worktreeGitDir, "commondir"), "utf-8").trim());
      if (resolve6(dirname8(worktreeGitDir)) !== join12(commonDir, "worktrees"))
        return gitRoot;
      if (realpathSync3(readFileSync5(join12(worktreeGitDir, "gitdir"), "utf-8").trim()) !== join12(realpathSync3(gitRoot), ".git"))
        return gitRoot;
      if (basename3(commonDir) !== ".git")
        return commonDir.normalize("NFC");
      return dirname8(commonDir).normalize("NFC");
    } catch {
      return gitRoot;
    }
  }, (root2) => root2, 50), findCanonicalGitRoot = createFindCanonicalGitRoot();
  gitExe = memoize_default(() => {
    return whichSync("git") || "git";
  }), getIsGit = memoize_default(async () => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "is_git_check_started");
    let isGit = findGitRoot(getCwd()) !== null;
    return logForDiagnosticsNoPII("info", "is_git_check_completed", {
      duration_ms: Date.now() - startTime,
      is_git: isGit
    }), isGit;
  });
});
