// Original: src/utils/permissions/pathValidation.ts
import { homedir as homedir16 } from "os";
import { dirname as dirname21, isAbsolute as isAbsolute7, resolve as resolve18 } from "path";
function formatDirectoryList(directories) {
  let dirCount = directories.length;
  if (dirCount <= MAX_DIRS_TO_LIST)
    return directories.map((dir) => `'${dir}'`).join(", ");
  return `${directories.slice(0, MAX_DIRS_TO_LIST).map((dir) => `'${dir}'`).join(", ")}, and ${dirCount - MAX_DIRS_TO_LIST} more`;
}
function getGlobBaseDirectory(path16) {
  let globMatch = path16.match(GLOB_PATTERN_REGEX);
  if (!globMatch || globMatch.index === void 0)
    return path16;
  let beforeGlob = path16.substring(0, globMatch.index), lastSepIndex = getPlatform() === "windows" ? Math.max(beforeGlob.lastIndexOf("/"), beforeGlob.lastIndexOf("\\")) : beforeGlob.lastIndexOf("/");
  if (lastSepIndex === -1)
    return ".";
  return beforeGlob.substring(0, lastSepIndex) || "/";
}
function expandTilde(path16) {
  if (path16 === "~" || path16.startsWith("~/") || process.platform === "win32" && path16.startsWith("~\\"))
    return homedir16() + path16.slice(1);
  return path16;
}
function isPathInSandboxWriteAllowlist(resolvedPath5) {
  if (!SandboxManager2.isSandboxingEnabled())
    return !1;
  let { allowOnly, denyWithinAllow } = SandboxManager2.getFsWriteConfig(), pathsToCheck = getPathsForPermissionCheck(resolvedPath5), resolvedAllow = allowOnly.flatMap(getResolvedSandboxConfigPath), resolvedDeny = denyWithinAllow.flatMap(getResolvedSandboxConfigPath);
  return pathsToCheck.every((p4) => {
    for (let denyPath of resolvedDeny)
      if (pathInWorkingPath(p4, denyPath))
        return !1;
    return resolvedAllow.some((allowPath) => pathInWorkingPath(p4, allowPath));
  });
}
function isPathAllowed(resolvedPath5, context3, operationType, precomputedPathsToCheck) {
  let permissionType = operationType === "read" ? "read" : "edit", denyRule = matchingRuleForInput(resolvedPath5, context3, permissionType, "deny");
  if (denyRule !== null)
    return {
      allowed: !1,
      decisionReason: { type: "rule", rule: denyRule }
    };
  if (operationType !== "read") {
    let internalEditResult = checkEditableInternalPath(resolvedPath5, {});
    if (internalEditResult.behavior === "allow")
      return {
        allowed: !0,
        decisionReason: internalEditResult.decisionReason
      };
  }
  if (operationType !== "read") {
    let safetyCheck = checkPathSafetyForAutoEdit(resolvedPath5, precomputedPathsToCheck);
    if (!safetyCheck.safe)
      return {
        allowed: !1,
        decisionReason: {
          type: "safetyCheck",
          reason: safetyCheck.message,
          classifierApprovable: safetyCheck.classifierApprovable
        }
      };
  }
  let isInWorkingDir = pathInAllowedWorkingPath(resolvedPath5, context3, precomputedPathsToCheck);
  if (isInWorkingDir) {
    if (operationType === "read" || context3.mode === "acceptEdits")
      return { allowed: !0 };
  }
  if (operationType === "read") {
    let internalReadResult = checkReadableInternalPath(resolvedPath5, {});
    if (internalReadResult.behavior === "allow")
      return {
        allowed: !0,
        decisionReason: internalReadResult.decisionReason
      };
  }
  if (operationType !== "read" && !isInWorkingDir && isPathInSandboxWriteAllowlist(resolvedPath5))
    return {
      allowed: !0,
      decisionReason: {
        type: "other",
        reason: "Path is in sandbox write allowlist"
      }
    };
  let allowRule = matchingRuleForInput(resolvedPath5, context3, permissionType, "allow");
  if (allowRule !== null)
    return {
      allowed: !0,
      decisionReason: { type: "rule", rule: allowRule }
    };
  return { allowed: !1 };
}
function validateGlobPattern(cleanPath, cwd2, toolPermissionContext, operationType) {
  if (containsPathTraversal(cleanPath)) {
    let absolutePath = isAbsolute7(cleanPath) ? cleanPath : resolve18(cwd2, cleanPath), { resolvedPath: resolvedPath6, isCanonical: isCanonical2 } = safeResolvePath(getFsImplementation(), absolutePath), result2 = isPathAllowed(resolvedPath6, toolPermissionContext, operationType, isCanonical2 ? [resolvedPath6] : void 0);
    return {
      allowed: result2.allowed,
      resolvedPath: resolvedPath6,
      decisionReason: result2.decisionReason
    };
  }
  let basePath = getGlobBaseDirectory(cleanPath), absoluteBasePath = isAbsolute7(basePath) ? basePath : resolve18(cwd2, basePath), { resolvedPath: resolvedPath5, isCanonical } = safeResolvePath(getFsImplementation(), absoluteBasePath), result = isPathAllowed(resolvedPath5, toolPermissionContext, operationType, isCanonical ? [resolvedPath5] : void 0);
  return {
    allowed: result.allowed,
    resolvedPath: resolvedPath5,
    decisionReason: result.decisionReason
  };
}
function isDangerousRemovalPath(resolvedPath5) {
  let forwardSlashed = resolvedPath5.replace(/[\\/]+/g, "/");
  if (forwardSlashed === "*" || forwardSlashed.endsWith("/*"))
    return !0;
  let normalizedPath = forwardSlashed === "/" ? forwardSlashed : forwardSlashed.replace(/\/$/, "");
  if (normalizedPath === "/")
    return !0;
  if (WINDOWS_DRIVE_ROOT_REGEX.test(normalizedPath))
    return !0;
  let normalizedHome = homedir16().replace(/[\\/]+/g, "/");
  if (normalizedPath === normalizedHome)
    return !0;
  if (dirname21(normalizedPath) === "/")
    return !0;
  if (WINDOWS_DRIVE_CHILD_REGEX.test(normalizedPath))
    return !0;
  return !1;
}
function validatePath(path16, cwd2, toolPermissionContext, operationType) {
  let cleanPath = expandTilde(path16.replace(/^['"]|['"]$/g, ""));
  if (containsVulnerableUncPath(cleanPath))
    return {
      allowed: !1,
      resolvedPath: cleanPath,
      decisionReason: {
        type: "other",
        reason: "UNC network paths require manual approval"
      }
    };
  if (cleanPath.startsWith("~"))
    return {
      allowed: !1,
      resolvedPath: cleanPath,
      decisionReason: {
        type: "other",
        reason: "Tilde expansion variants (~user, ~+, ~-) in paths require manual approval"
      }
    };
  if (cleanPath.includes("$") || cleanPath.includes("%") || cleanPath.startsWith("="))
    return {
      allowed: !1,
      resolvedPath: cleanPath,
      decisionReason: {
        type: "other",
        reason: "Shell expansion syntax in paths requires manual approval"
      }
    };
  if (GLOB_PATTERN_REGEX.test(cleanPath)) {
    if (operationType === "write" || operationType === "create")
      return {
        allowed: !1,
        resolvedPath: cleanPath,
        decisionReason: {
          type: "other",
          reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
        }
      };
    return validateGlobPattern(cleanPath, cwd2, toolPermissionContext, operationType);
  }
  let absolutePath = isAbsolute7(cleanPath) ? cleanPath : resolve18(cwd2, cleanPath), { resolvedPath: resolvedPath5, isCanonical } = safeResolvePath(getFsImplementation(), absolutePath), result = isPathAllowed(resolvedPath5, toolPermissionContext, operationType, isCanonical ? [resolvedPath5] : void 0);
  return {
    allowed: result.allowed,
    resolvedPath: resolvedPath5,
    decisionReason: result.decisionReason
  };
}
var MAX_DIRS_TO_LIST = 5, GLOB_PATTERN_REGEX, getResolvedSandboxConfigPath, WINDOWS_DRIVE_ROOT_REGEX, WINDOWS_DRIVE_CHILD_REGEX;
var init_pathValidation = __esm(() => {
  init_memoize();
  init_platform();
  init_fsOperations();
  init_path2();
  init_sandbox_adapter();
  init_readOnlyCommandValidation();
  init_filesystem();
  GLOB_PATTERN_REGEX = /[*?[\]{}]/;
  getResolvedSandboxConfigPath = memoize_default(getPathsForPermissionCheck);
  WINDOWS_DRIVE_ROOT_REGEX = /^[A-Za-z]:\/?$/, WINDOWS_DRIVE_CHILD_REGEX = /^[A-Za-z]:\/[^/]+$/;
});
