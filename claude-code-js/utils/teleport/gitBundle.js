// Original: src/utils/teleport/gitBundle.ts
import { stat as stat21, unlink as unlink9 } from "fs/promises";
async function _bundleWithFallback(gitRoot, bundlePath, maxBytes, hasStash, signal) {
  let extra = hasStash ? ["refs/seed/stash"] : [], mkBundle = (base2) => execFileNoThrowWithCwd(gitExe(), ["bundle", "create", bundlePath, base2, ...extra], { cwd: gitRoot, abortSignal: signal }), allResult = await mkBundle("--all");
  if (allResult.code !== 0)
    return {
      ok: !1,
      error: `git bundle create --all failed (${allResult.code}): ${allResult.stderr.slice(0, 200)}`,
      failReason: "git_error"
    };
  let { size: allSize } = await stat21(bundlePath);
  if (allSize <= maxBytes)
    return { ok: !0, size: allSize, scope: "all" };
  logForDebugging(`[gitBundle] --all bundle is ${(allSize / 1024 / 1024).toFixed(1)}MB (> ${(maxBytes / 1024 / 1024).toFixed(0)}MB), retrying HEAD-only`);
  let headResult = await mkBundle("HEAD");
  if (headResult.code !== 0)
    return {
      ok: !1,
      error: `git bundle create HEAD failed (${headResult.code}): ${headResult.stderr.slice(0, 200)}`,
      failReason: "git_error"
    };
  let { size: headSize } = await stat21(bundlePath);
  if (headSize <= maxBytes)
    return { ok: !0, size: headSize, scope: "head" };
  logForDebugging(`[gitBundle] HEAD bundle is ${(headSize / 1024 / 1024).toFixed(1)}MB, retrying squashed-root`);
  let treeRef = hasStash ? "refs/seed/stash^{tree}" : "HEAD^{tree}", commitTree = await execFileNoThrowWithCwd(gitExe(), ["commit-tree", treeRef, "-m", "seed"], { cwd: gitRoot, abortSignal: signal });
  if (commitTree.code !== 0)
    return {
      ok: !1,
      error: `git commit-tree failed (${commitTree.code}): ${commitTree.stderr.slice(0, 200)}`,
      failReason: "git_error"
    };
  let squashedSha = commitTree.stdout.trim();
  await execFileNoThrowWithCwd(gitExe(), ["update-ref", "refs/seed/root", squashedSha], { cwd: gitRoot });
  let squashResult = await execFileNoThrowWithCwd(gitExe(), ["bundle", "create", bundlePath, "refs/seed/root"], { cwd: gitRoot, abortSignal: signal });
  if (squashResult.code !== 0)
    return {
      ok: !1,
      error: `git bundle create refs/seed/root failed (${squashResult.code}): ${squashResult.stderr.slice(0, 200)}`,
      failReason: "git_error"
    };
  let { size: squashSize } = await stat21(bundlePath);
  if (squashSize <= maxBytes)
    return { ok: !0, size: squashSize, scope: "squashed" };
  return {
    ok: !1,
    error: "Repo is too large to bundle. Please setup GitHub on https://claude.ai/code",
    failReason: "too_large"
  };
}
async function createAndUploadGitBundle(config10, opts) {
  let workdir = opts?.cwd ?? getCwd(), gitRoot = findGitRoot(workdir);
  if (!gitRoot)
    return { success: !1, error: "Not in a git repository" };
  for (let ref of ["refs/seed/stash", "refs/seed/root"])
    await execFileNoThrowWithCwd(gitExe(), ["update-ref", "-d", ref], {
      cwd: gitRoot
    });
  let refCheck = await execFileNoThrowWithCwd(gitExe(), ["for-each-ref", "--count=1", "refs/"], { cwd: gitRoot });
  if (refCheck.code === 0 && refCheck.stdout.trim() === "")
    return logEvent("tengu_ccr_bundle_upload", {
      outcome: "empty_repo"
    }), {
      success: !1,
      error: "Repository has no commits yet",
      failReason: "empty_repo"
    };
  let stashResult = await execFileNoThrowWithCwd(gitExe(), ["stash", "create"], { cwd: gitRoot, abortSignal: opts?.signal }), wipStashSha = stashResult.code === 0 ? stashResult.stdout.trim() : "", hasWip = wipStashSha !== "";
  if (stashResult.code !== 0)
    logForDebugging(`[gitBundle] git stash create failed (${stashResult.code}), proceeding without WIP: ${stashResult.stderr.slice(0, 200)}`);
  else if (hasWip)
    logForDebugging(`[gitBundle] Captured WIP as stash ${wipStashSha}`), await execFileNoThrowWithCwd(gitExe(), ["update-ref", "refs/seed/stash", wipStashSha], { cwd: gitRoot });
  let bundlePath = generateTempFilePath("ccr-seed", ".bundle");
  try {
    let maxBytes = DEFAULT_BUNDLE_MAX_BYTES, bundle = await _bundleWithFallback(gitRoot, bundlePath, maxBytes, hasWip, opts?.signal);
    if (!bundle.ok)
      return logForDebugging(`[gitBundle] ${bundle.error}`), logEvent("tengu_ccr_bundle_upload", {
        outcome: bundle.failReason,
        max_bytes: maxBytes
      }), {
        success: !1,
        error: bundle.error,
        failReason: bundle.failReason
      };
    let upload = await uploadFile(bundlePath, "_source_seed.bundle", config10, {
      signal: opts?.signal
    });
    if (!upload.success)
      return logEvent("tengu_ccr_bundle_upload", {
        outcome: "failed"
      }), { success: !1, error: upload.error };
    return logForDebugging(`[gitBundle] Uploaded ${upload.size} bytes as file_id ${upload.fileId}`), logEvent("tengu_ccr_bundle_upload", {
      outcome: "success",
      size_bytes: upload.size,
      scope: bundle.scope,
      has_wip: hasWip
    }), {
      success: !0,
      fileId: upload.fileId,
      bundleSizeBytes: upload.size,
      scope: bundle.scope,
      hasWip
    };
  } finally {
    try {
      await unlink9(bundlePath);
    } catch {
      logForDebugging(`[gitBundle] Could not delete ${bundlePath} (non-fatal)`);
    }
    for (let ref of ["refs/seed/stash", "refs/seed/root"])
      await execFileNoThrowWithCwd(gitExe(), ["update-ref", "-d", ref], {
        cwd: gitRoot
      });
  }
}
var DEFAULT_BUNDLE_MAX_BYTES = 104857600;
var init_gitBundle = __esm(() => {
  init_filesApi();
  init_cwd2();
  init_debug();
  init_execFileNoThrow();
  init_git();
  init_tempfile();
});
