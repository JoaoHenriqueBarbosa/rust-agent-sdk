// Original: src/utils/git/gitFilesystem.ts
import { unwatchFile, watchFile } from "fs";
import { readdir as readdir3, readFile as readFile3, stat as stat3 } from "fs/promises";
import { join as join11, resolve as resolve5 } from "path";
function clearResolveGitDirCache() {
  resolveGitDirCache.clear();
}
async function resolveGitDir(startPath) {
  let cwd2 = resolve5(startPath ?? getCwd()), cached2 = resolveGitDirCache.get(cwd2);
  if (cached2 !== void 0)
    return cached2;
  let root2 = findGitRoot(cwd2);
  if (!root2)
    return resolveGitDirCache.set(cwd2, null), null;
  let gitPath = join11(root2, ".git");
  try {
    if ((await stat3(gitPath)).isFile()) {
      let content = (await readFile3(gitPath, "utf-8")).trim();
      if (content.startsWith("gitdir:")) {
        let rawDir = content.slice(7).trim(), resolved = resolve5(root2, rawDir);
        return resolveGitDirCache.set(cwd2, resolved), resolved;
      }
    }
    return resolveGitDirCache.set(cwd2, gitPath), gitPath;
  } catch {
    return resolveGitDirCache.set(cwd2, null), null;
  }
}
function isSafeRefName(name) {
  if (!name || name.startsWith("-") || name.startsWith("/"))
    return !1;
  if (name.includes(".."))
    return !1;
  if (name.split("/").some((c3) => c3 === "." || c3 === ""))
    return !1;
  if (!/^[a-zA-Z0-9/._+@-]+$/.test(name))
    return !1;
  return !0;
}
function isValidGitSha(s) {
  return /^[0-9a-f]{40}$/.test(s) || /^[0-9a-f]{64}$/.test(s);
}
async function readGitHead(gitDir) {
  try {
    let content = (await readFile3(join11(gitDir, "HEAD"), "utf-8")).trim();
    if (content.startsWith("ref:")) {
      let ref = content.slice(4).trim();
      if (ref.startsWith("refs/heads/")) {
        let name = ref.slice(11);
        if (!isSafeRefName(name))
          return null;
        return { type: "branch", name };
      }
      if (!isSafeRefName(ref))
        return null;
      let sha = await resolveRef(gitDir, ref);
      return sha ? { type: "detached", sha } : { type: "detached", sha: "" };
    }
    if (!isValidGitSha(content))
      return null;
    return { type: "detached", sha: content };
  } catch {
    return null;
  }
}
async function resolveRef(gitDir, ref) {
  let result = await resolveRefInDir(gitDir, ref);
  if (result)
    return result;
  let commonDir = await getCommonDir(gitDir);
  if (commonDir && commonDir !== gitDir)
    return resolveRefInDir(commonDir, ref);
  return null;
}
async function resolveRefInDir(dir, ref) {
  try {
    let content = (await readFile3(join11(dir, ref), "utf-8")).trim();
    if (content.startsWith("ref:")) {
      let target = content.slice(4).trim();
      if (!isSafeRefName(target))
        return null;
      return resolveRef(dir, target);
    }
    if (!isValidGitSha(content))
      return null;
    return content;
  } catch {}
  try {
    let packed = await readFile3(join11(dir, "packed-refs"), "utf-8");
    for (let line of packed.split(`
`)) {
      if (line.startsWith("#") || line.startsWith("^"))
        continue;
      let spaceIdx = line.indexOf(" ");
      if (spaceIdx === -1)
        continue;
      if (line.slice(spaceIdx + 1) === ref) {
        let sha = line.slice(0, spaceIdx);
        return isValidGitSha(sha) ? sha : null;
      }
    }
  } catch {}
  return null;
}
async function getCommonDir(gitDir) {
  try {
    let content = (await readFile3(join11(gitDir, "commondir"), "utf-8")).trim();
    return resolve5(gitDir, content);
  } catch {
    return null;
  }
}
async function readRawSymref(gitDir, refPath, branchPrefix) {
  try {
    let content = (await readFile3(join11(gitDir, refPath), "utf-8")).trim();
    if (content.startsWith("ref:")) {
      let target = content.slice(4).trim();
      if (target.startsWith(branchPrefix)) {
        let name = target.slice(branchPrefix.length);
        if (!isSafeRefName(name))
          return null;
        return name;
      }
    }
  } catch {}
  return null;
}

class GitFileWatcher {
  gitDir = null;
  commonDir = null;
  initialized = !1;
  initPromise = null;
  watchedPaths = [];
  branchRefPath = null;
  cache = /* @__PURE__ */ new Map;
  async ensureStarted() {
    if (this.initialized)
      return;
    if (this.initPromise)
      return this.initPromise;
    return this.initPromise = this.start(), this.initPromise;
  }
  async start() {
    if (this.gitDir = await resolveGitDir(), this.initialized = !0, !this.gitDir)
      return;
    this.commonDir = await getCommonDir(this.gitDir), this.watchPath(join11(this.gitDir, "HEAD"), () => {
      this.onHeadChanged();
    }), this.watchPath(join11(this.commonDir ?? this.gitDir, "config"), () => {
      this.invalidate();
    }), await this.watchCurrentBranchRef(), registerCleanup(async () => {
      this.stopWatching();
    });
  }
  watchPath(path9, callback) {
    this.watchedPaths.push(path9), watchFile(path9, { interval: WATCH_INTERVAL_MS }, callback);
  }
  async watchCurrentBranchRef() {
    if (!this.gitDir)
      return;
    let head = await readGitHead(this.gitDir), refsDir = this.commonDir ?? this.gitDir, refPath = head?.type === "branch" ? join11(refsDir, "refs", "heads", head.name) : null;
    if (refPath === this.branchRefPath)
      return;
    if (this.branchRefPath)
      unwatchFile(this.branchRefPath), this.watchedPaths = this.watchedPaths.filter((p) => p !== this.branchRefPath);
    if (this.branchRefPath = refPath, !refPath)
      return;
    this.watchPath(refPath, () => {
      this.invalidate();
    });
  }
  async onHeadChanged() {
    this.invalidate(), await waitForScrollIdle(), await this.watchCurrentBranchRef();
  }
  invalidate() {
    for (let entry of this.cache.values())
      entry.dirty = !0;
  }
  stopWatching() {
    for (let path9 of this.watchedPaths)
      unwatchFile(path9);
    this.watchedPaths = [], this.branchRefPath = null;
  }
  async get(key, compute) {
    await this.ensureStarted();
    let existing = this.cache.get(key);
    if (existing && !existing.dirty)
      return existing.value;
    if (existing)
      existing.dirty = !1;
    let value = await compute(), entry = this.cache.get(key);
    if (entry && !entry.dirty)
      entry.value = value;
    if (!entry)
      this.cache.set(key, { value, dirty: !1, compute });
    return value;
  }
  reset() {
    this.stopWatching(), this.cache.clear(), this.initialized = !1, this.initPromise = null, this.gitDir = null, this.commonDir = null;
  }
}
async function computeBranch() {
  let gitDir = await resolveGitDir();
  if (!gitDir)
    return "HEAD";
  let head = await readGitHead(gitDir);
  if (!head)
    return "HEAD";
  return head.type === "branch" ? head.name : "HEAD";
}
async function computeHead() {
  let gitDir = await resolveGitDir();
  if (!gitDir)
    return "";
  let head = await readGitHead(gitDir);
  if (!head)
    return "";
  if (head.type === "branch")
    return await resolveRef(gitDir, `refs/heads/${head.name}`) ?? "";
  return head.sha;
}
async function computeRemoteUrl() {
  let gitDir = await resolveGitDir();
  if (!gitDir)
    return null;
  let url2 = await parseGitConfigValue(gitDir, "remote", "origin", "url");
  if (url2)
    return url2;
  let commonDir = await getCommonDir(gitDir);
  if (commonDir && commonDir !== gitDir)
    return parseGitConfigValue(commonDir, "remote", "origin", "url");
  return null;
}
async function computeDefaultBranch() {
  let gitDir = await resolveGitDir();
  if (!gitDir)
    return "main";
  let commonDir = await getCommonDir(gitDir) ?? gitDir, branchFromSymref = await readRawSymref(commonDir, "refs/remotes/origin/HEAD", "refs/remotes/origin/");
  if (branchFromSymref)
    return branchFromSymref;
  for (let candidate of ["main", "master"])
    if (await resolveRef(commonDir, `refs/remotes/origin/${candidate}`))
      return candidate;
  return "main";
}
function getCachedBranch() {
  return gitWatcher.get("branch", computeBranch);
}
function getCachedHead() {
  return gitWatcher.get("head", computeHead);
}
function getCachedRemoteUrl() {
  return gitWatcher.get("remoteUrl", computeRemoteUrl);
}
function getCachedDefaultBranch() {
  return gitWatcher.get("defaultBranch", computeDefaultBranch);
}
async function getHeadForDir(cwd2) {
  let gitDir = await resolveGitDir(cwd2);
  if (!gitDir)
    return null;
  let head = await readGitHead(gitDir);
  if (!head)
    return null;
  if (head.type === "branch")
    return resolveRef(gitDir, `refs/heads/${head.name}`);
  return head.sha;
}
async function readWorktreeHeadSha(worktreePath) {
  let gitDir;
  try {
    let ptr = (await readFile3(join11(worktreePath, ".git"), "utf-8")).trim();
    if (!ptr.startsWith("gitdir:"))
      return null;
    gitDir = resolve5(worktreePath, ptr.slice(7).trim());
  } catch {
    return null;
  }
  let head = await readGitHead(gitDir);
  if (!head)
    return null;
  if (head.type === "branch")
    return resolveRef(gitDir, `refs/heads/${head.name}`);
  return head.sha;
}
async function getRemoteUrlForDir(cwd2) {
  let gitDir = await resolveGitDir(cwd2);
  if (!gitDir)
    return null;
  let url2 = await parseGitConfigValue(gitDir, "remote", "origin", "url");
  if (url2)
    return url2;
  let commonDir = await getCommonDir(gitDir);
  if (commonDir && commonDir !== gitDir)
    return parseGitConfigValue(commonDir, "remote", "origin", "url");
  return null;
}
async function getWorktreeCountFromFs() {
  try {
    let gitDir = await resolveGitDir();
    if (!gitDir)
      return 0;
    let commonDir = await getCommonDir(gitDir) ?? gitDir;
    return (await readdir3(join11(commonDir, "worktrees"))).length + 1;
  } catch {
    return 1;
  }
}
var resolveGitDirCache, WATCH_INTERVAL_MS = 1000, gitWatcher;
var init_gitFilesystem = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_cwd2();
  init_git();
  init_gitConfigParser();
  resolveGitDirCache = /* @__PURE__ */ new Map;
  gitWatcher = new GitFileWatcher;
});
