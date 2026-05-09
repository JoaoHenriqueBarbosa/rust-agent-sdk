// function: hasComplexColonValue
function hasComplexColonValue(rawValue) {
  return rawValue.includes(",") || rawValue.startsWith("(") || rawValue.startsWith("[") || rawValue.includes("`") || rawValue.includes("@(") || rawValue.startsWith("@{") || rawValue.includes("$");
}
function formatDirectoryList2(directories) {
  let dirCount = directories.length;
  if (dirCount <= MAX_DIRS_TO_LIST2)
    return directories.map((dir) => `'${dir}'`).join(", ");
  return `${directories.slice(0, MAX_DIRS_TO_LIST2).map((dir) => `'${dir}'`).join(", ")}, and ${dirCount - MAX_DIRS_TO_LIST2} more`;
}
function expandTilde2(filePath) {
  if (filePath === "~" || filePath.startsWith("~/") || filePath.startsWith("~\\"))
    return homedir26() + filePath.slice(1);
  return filePath;
}
function isDangerousRemovalRawPath(filePath) {
  let expanded = expandTilde2(filePath.replace(/^['"]|['"]$/g, "")).replace(/\\/g, "/");
  return isDangerousRemovalPath(expanded);
}
function dangerousRemovalDeny(path19) {
  return {
    behavior: "deny",
    message: `Remove-Item on system path '${path19}' is blocked. This path is protected from removal.`,
    decisionReason: {
      type: "other",
      reason: "Removal targets a protected system path"
    }
  };
}
function isPathAllowed2(resolvedPath5, context6, operationType, precomputedPathsToCheck) {
  let permissionType = operationType === "read" ? "read" : "edit", denyRule = matchingRuleForInput(resolvedPath5, context6, permissionType, "deny");
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
  let isInWorkingDir = pathInAllowedWorkingPath(resolvedPath5, context6, precomputedPathsToCheck);
  if (isInWorkingDir) {
    if (operationType === "read" || context6.mode === "acceptEdits")
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
  let allowRule = matchingRuleForInput(resolvedPath5, context6, permissionType, "allow");
  if (allowRule !== null)
    return {
      allowed: !0,
      decisionReason: { type: "rule", rule: allowRule }
    };
  return { allowed: !1 };
}
function checkDenyRuleForGuessedPath(strippedPath, cwd2, toolPermissionContext, operationType) {
  if (!strippedPath || strippedPath.includes("\x00"))
    return null;
  let tildeExpanded = expandTilde2(strippedPath), abs = isAbsolute17(tildeExpanded) ? tildeExpanded : resolve31(cwd2, tildeExpanded), { resolvedPath: resolvedPath5 } = safeResolvePath(getFsImplementation(), abs), denyRule = matchingRuleForInput(resolvedPath5, toolPermissionContext, operationType === "read" ? "read" : "edit", "deny");
  return denyRule ? { resolvedPath: resolvedPath5, rule: denyRule } : null;
}
function validatePath2(filePath, cwd2, toolPermissionContext, operationType) {
  let normalizedPath = expandTilde2(filePath.replace(/^['"]|['"]$/g, "")).replace(/\\/g, "/");
  if (normalizedPath.includes("`")) {
    let backtickStripped = normalizedPath.replace(/`/g, ""), denyHit = checkDenyRuleForGuessedPath(backtickStripped, cwd2, toolPermissionContext, operationType);
    if (denyHit)
      return {
        allowed: !1,
        resolvedPath: denyHit.resolvedPath,
        decisionReason: { type: "rule", rule: denyHit.rule }
      };
    return {
      allowed: !1,
      resolvedPath: normalizedPath,
      decisionReason: {
        type: "other",
        reason: "Backtick escape characters in paths cannot be statically validated and require manual approval"
      }
    };
  }
  if (normalizedPath.includes("::")) {
    let afterProvider = normalizedPath.slice(normalizedPath.indexOf("::") + 2), denyHit = checkDenyRuleForGuessedPath(afterProvider, cwd2, toolPermissionContext, operationType);
    if (denyHit)
      return {
        allowed: !1,
        resolvedPath: denyHit.resolvedPath,
        decisionReason: { type: "rule", rule: denyHit.rule }
      };
    return {
      allowed: !1,
      resolvedPath: normalizedPath,
      decisionReason: {
        type: "other",
        reason: "Module-qualified provider paths (::) cannot be statically validated and require manual approval"
      }
    };
  }
  if (normalizedPath.startsWith("//") || /DavWWWRoot/i.test(normalizedPath) || /@SSL@/i.test(normalizedPath))
    return {
      allowed: !1,
      resolvedPath: normalizedPath,
      decisionReason: {
        type: "other",
        reason: "UNC paths are blocked because they can trigger network requests and credential leakage"
      }
    };
  if (normalizedPath.includes("$") || normalizedPath.includes("%"))
    return {
      allowed: !1,
      resolvedPath: normalizedPath,
      decisionReason: {
        type: "other",
        reason: "Variable expansion syntax in paths requires manual approval"
      }
    };
  if ((getPlatform() === "windows" ? /^[a-z0-9]{2,}:/i : /^[a-z0-9]+:/i).test(normalizedPath))
    return {
      allowed: !1,
      resolvedPath: normalizedPath,
      decisionReason: {
        type: "other",
        reason: `Path '${normalizedPath}' uses a non-filesystem provider and requires manual approval`
      }
    };
  if (GLOB_PATTERN_REGEX2.test(normalizedPath)) {
    if (operationType === "write" || operationType === "create")
      return {
        allowed: !1,
        resolvedPath: normalizedPath,
        decisionReason: {
          type: "other",
          reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
        }
      };
    if (containsPathTraversal(normalizedPath)) {
      let absolutePath2 = isAbsolute17(normalizedPath) ? normalizedPath : resolve31(cwd2, normalizedPath), { resolvedPath: resolvedPath7, isCanonical: isCanonical2 } = safeResolvePath(getFsImplementation(), absolutePath2), result2 = isPathAllowed2(resolvedPath7, toolPermissionContext, operationType, isCanonical2 ? [resolvedPath7] : void 0);
      return {
        allowed: result2.allowed,
        resolvedPath: resolvedPath7,
        decisionReason: result2.decisionReason
      };
    }
    let basePath = getGlobBaseDirectory2(normalizedPath), absoluteBasePath = isAbsolute17(basePath) ? basePath : resolve31(cwd2, basePath), { resolvedPath: resolvedPath6 } = safeResolvePath(getFsImplementation(), absoluteBasePath), denyRule = matchingRuleForInput(resolvedPath6, toolPermissionContext, operationType === "read" ? "read" : "edit", "deny");
    if (denyRule !== null)
      return {
        allowed: !1,
        resolvedPath: resolvedPath6,
        decisionReason: { type: "rule", rule: denyRule }
      };
    return {
      allowed: !1,
      resolvedPath: resolvedPath6,
      decisionReason: {
        type: "other",
        reason: "Glob patterns in paths cannot be statically validated \u2014 symlinks inside the glob expansion are not examined. Requires manual approval."
      }
    };
  }
  let absolutePath = isAbsolute17(normalizedPath) ? normalizedPath : resolve31(cwd2, normalizedPath), { resolvedPath: resolvedPath5, isCanonical } = safeResolvePath(getFsImplementation(), absolutePath), result = isPathAllowed2(resolvedPath5, toolPermissionContext, operationType, isCanonical ? [resolvedPath5] : void 0);
  return {
    allowed: result.allowed,
    resolvedPath: resolvedPath5,
    decisionReason: result.decisionReason
  };
}
function getGlobBaseDirectory2(filePath) {
  let globMatch = filePath.match(GLOB_PATTERN_REGEX2);
  if (!globMatch || globMatch.index === void 0)
    return filePath;
  let beforeGlob = filePath.substring(0, globMatch.index), lastSepIndex = Math.max(beforeGlob.lastIndexOf("/"), beforeGlob.lastIndexOf("\\"));
  if (lastSepIndex === -1)
    return ".";
  return beforeGlob.substring(0, lastSepIndex + 1) || "/";
}
function extractPathsFromCommand(cmd) {
  let canonical = resolveToCanonical(cmd.name), config10 = CMDLET_PATH_CONFIG[canonical];
  if (!config10)
    return {
      paths: [],
      operationType: "read",
      hasUnvalidatablePathArg: !1,
      optionalWrite: !1
    };
  let switchParams = [...config10.knownSwitches, ...COMMON_SWITCHES], valueParams = [...config10.knownValueParams, ...COMMON_VALUE_PARAMS], paths2 = [], args = cmd.args, elementTypes = cmd.elementTypes, hasUnvalidatablePathArg = !1, positionalsSeen = 0, positionalSkip = config10.positionalSkip ?? 0;
  function checkArgElementType(argIdx) {
    if (!elementTypes)
      return;
    let et2 = elementTypes[argIdx + 1];
    if (et2 && !SAFE_PATH_ELEMENT_TYPES.has(et2))
      hasUnvalidatablePathArg = !0;
  }
  for (let i5 = 0;i5 < args.length; i5++) {
    let arg = args[i5];
    if (!arg)
      continue;
    let argElementType = elementTypes ? elementTypes[i5 + 1] : void 0;
    if (isPowerShellParameter(arg, argElementType)) {
      let normalized = "-" + arg.slice(1), colonIdx = normalized.indexOf(":", 1), paramLower = (colonIdx > 0 ? normalized.substring(0, colonIdx) : normalized).toLowerCase();
      if (matchesParam(paramLower, config10.pathParams)) {
        let value;
        if (colonIdx > 0) {
          let rawValue = arg.substring(colonIdx + 1);
          if (hasComplexColonValue(rawValue))
            hasUnvalidatablePathArg = !0;
          else
            value = rawValue;
        } else {
          let nextVal = args[i5 + 1], nextType = elementTypes ? elementTypes[i5 + 2] : void 0;
          if (nextVal && !isPowerShellParameter(nextVal, nextType))
            value = nextVal, checkArgElementType(i5 + 1), i5++;
        }
        if (value)
          paths2.push(value);
      } else if (config10.leafOnlyPathParams && matchesParam(paramLower, config10.leafOnlyPathParams)) {
        let value;
        if (colonIdx > 0) {
          let rawValue = arg.substring(colonIdx + 1);
          if (hasComplexColonValue(rawValue))
            hasUnvalidatablePathArg = !0;
          else
            value = rawValue;
        } else {
          let nextVal = args[i5 + 1], nextType = elementTypes ? elementTypes[i5 + 2] : void 0;
          if (nextVal && !isPowerShellParameter(nextVal, nextType))
            value = nextVal, checkArgElementType(i5 + 1), i5++;
        }
        if (value !== void 0)
          if (value.includes("/") || value.includes("\\") || value === "." || value === "..")
            hasUnvalidatablePathArg = !0;
          else
            paths2.push(value);
      } else if (matchesParam(paramLower, switchParams))
        ;
      else if (matchesParam(paramLower, valueParams))
        if (colonIdx > 0) {
          let rawValue = arg.substring(colonIdx + 1);
          if (hasComplexColonValue(rawValue))
            hasUnvalidatablePathArg = !0;
        } else {
          let nextArg = args[i5 + 1], nextArgType = elementTypes ? elementTypes[i5 + 2] : void 0;
          if (nextArg && !isPowerShellParameter(nextArg, nextArgType))
            checkArgElementType(i5 + 1), i5++;
        }
      else if (hasUnvalidatablePathArg = !0, colonIdx > 0) {
        let rawValue = arg.substring(colonIdx + 1);
        if (!hasComplexColonValue(rawValue))
          paths2.push(rawValue);
      }
      continue;
    }
    if (positionalsSeen < positionalSkip) {
      positionalsSeen++;
      continue;
    }
    positionalsSeen++, checkArgElementType(i5), paths2.push(arg);
  }
  return {
    paths: paths2,
    operationType: config10.operationType,
    hasUnvalidatablePathArg,
    optionalWrite: config10.optionalWrite ?? !1
  };
}
function checkPathConstraints2(input, parsed, toolPermissionContext, compoundCommandHasCd = !1) {
  if (!parsed.valid)
    return {
      behavior: "passthrough",
      message: "Cannot validate paths for unparsed command"
    };
  let firstAsk;
  for (let statement of parsed.statements) {
    let result = checkPathConstraintsForStatement(statement, toolPermissionContext, compoundCommandHasCd);
    if (result.behavior === "deny")
      return result;
    if (result.behavior === "ask" && !firstAsk)
      firstAsk = result;
  }
  return firstAsk ?? {
    behavior: "passthrough",
    message: "All path constraints validated successfully"
  };
}
function checkPathConstraintsForStatement(statement, toolPermissionContext, compoundCommandHasCd = !1) {
  let cwd2 = getCwd(), firstAsk;
  if (compoundCommandHasCd)
    firstAsk = {
      behavior: "ask",
      message: "Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) \u2014 relative paths cannot be validated against the original cwd and require manual approval",
      decisionReason: {
        type: "other",
        reason: "Compound command contains cd with path operation \u2014 manual approval required to prevent path resolution bypass"
      }
    };
  let hasExpressionPipelineSource = !1, pipelineSourceText;
  for (let cmd of statement.commands) {
    if (cmd.elementType !== "CommandAst") {
      hasExpressionPipelineSource = !0, pipelineSourceText = cmd.text;
      continue;
    }
    let { paths: paths2, operationType, hasUnvalidatablePathArg, optionalWrite } = extractPathsFromCommand(cmd);
    if (hasExpressionPipelineSource) {
      let canonical = resolveToCanonical(cmd.name);
      if (pipelineSourceText !== void 0) {
        let stripped = pipelineSourceText.replace(/^['"]|['"]$/g, ""), denyHit = checkDenyRuleForGuessedPath(stripped, cwd2, toolPermissionContext, operationType);
        if (denyHit)
          return {
            behavior: "deny",
            message: `${canonical} targeting '${denyHit.resolvedPath}' was blocked by a deny rule`,
            decisionReason: { type: "rule", rule: denyHit.rule }
          };
      }
      firstAsk ??= {
        behavior: "ask",
        message: `${canonical} receives its path from a pipeline expression source that cannot be statically validated and requires manual approval`
      };
    }
    if (hasUnvalidatablePathArg) {
      let canonical = resolveToCanonical(cmd.name);
      firstAsk ??= {
        behavior: "ask",
        message: `${canonical} uses a parameter or complex path expression (array literal, subexpression, unknown parameter, etc.) that cannot be statically validated and requires manual approval`
      };
    }
    if (operationType !== "read" && !optionalWrite && paths2.length === 0 && CMDLET_PATH_CONFIG[resolveToCanonical(cmd.name)]) {
      let canonical = resolveToCanonical(cmd.name);
      firstAsk ??= {
        behavior: "ask",
        message: `${canonical} is a write operation but no target path could be determined; requires manual approval`
      };
      continue;
    }
    let isRemoval = resolveToCanonical(cmd.name) === "remove-item";
    for (let filePath of paths2) {
      if (isRemoval && isDangerousRemovalRawPath(filePath))
        return dangerousRemovalDeny(filePath);
      let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath2(filePath, cwd2, toolPermissionContext, operationType);
      if (isRemoval && isDangerousRemovalPath(resolvedPath5))
        return dangerousRemovalDeny(resolvedPath5);
      if (!allowed) {
        let canonical = resolveToCanonical(cmd.name), workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList2(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : `${canonical} targeting '${resolvedPath5}' was blocked. For security, Claude Code may only access files in the allowed working directories for this session: ${dirListStr}.`;
        if (decisionReason?.type === "rule")
          return {
            behavior: "deny",
            message,
            decisionReason
          };
        let suggestions = [];
        if (resolvedPath5)
          if (operationType === "read") {
            let suggestion = createReadRuleSuggestion(getDirectoryForPath(resolvedPath5), "session");
            if (suggestion)
              suggestions.push(suggestion);
          } else
            suggestions.push({
              type: "addDirectories",
              directories: [getDirectoryForPath(resolvedPath5)],
              destination: "session"
            });
        if (operationType === "write" || operationType === "create")
          suggestions.push({
            type: "setMode",
            mode: "acceptEdits",
            destination: "session"
          });
        firstAsk ??= {
          behavior: "ask",
          message,
          blockedPath: resolvedPath5,
          decisionReason,
          suggestions
        };
      }
    }
  }
  if (statement.nestedCommands)
    for (let cmd of statement.nestedCommands) {
      let { paths: paths2, operationType, hasUnvalidatablePathArg, optionalWrite } = extractPathsFromCommand(cmd);
      if (hasUnvalidatablePathArg) {
        let canonical = resolveToCanonical(cmd.name);
        firstAsk ??= {
          behavior: "ask",
          message: `${canonical} uses a parameter or complex path expression (array literal, subexpression, unknown parameter, etc.) that cannot be statically validated and requires manual approval`
        };
      }
      if (operationType !== "read" && !optionalWrite && paths2.length === 0 && CMDLET_PATH_CONFIG[resolveToCanonical(cmd.name)]) {
        let canonical = resolveToCanonical(cmd.name);
        firstAsk ??= {
          behavior: "ask",
          message: `${canonical} is a write operation but no target path could be determined; requires manual approval`
        };
        continue;
      }
      let isRemoval = resolveToCanonical(cmd.name) === "remove-item";
      for (let filePath of paths2) {
        if (isRemoval && isDangerousRemovalRawPath(filePath))
          return dangerousRemovalDeny(filePath);
        let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath2(filePath, cwd2, toolPermissionContext, operationType);
        if (isRemoval && isDangerousRemovalPath(resolvedPath5))
          return dangerousRemovalDeny(resolvedPath5);
        if (!allowed) {
          let canonical = resolveToCanonical(cmd.name), workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList2(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : `${canonical} targeting '${resolvedPath5}' was blocked. For security, Claude Code may only access files in the allowed working directories for this session: ${dirListStr}.`;
          if (decisionReason?.type === "rule")
            return {
              behavior: "deny",
              message,
              decisionReason
            };
          let suggestions = [];
          if (resolvedPath5)
            if (operationType === "read") {
              let suggestion = createReadRuleSuggestion(getDirectoryForPath(resolvedPath5), "session");
              if (suggestion)
                suggestions.push(suggestion);
            } else
              suggestions.push({
                type: "addDirectories",
                directories: [getDirectoryForPath(resolvedPath5)],
                destination: "session"
              });
          if (operationType === "write" || operationType === "create")
            suggestions.push({
              type: "setMode",
              mode: "acceptEdits",
              destination: "session"
            });
          firstAsk ??= {
            behavior: "ask",
            message,
            blockedPath: resolvedPath5,
            decisionReason,
            suggestions
          };
        }
      }
      if (hasExpressionPipelineSource)
        firstAsk ??= {
          behavior: "ask",
          message: `${resolveToCanonical(cmd.name)} appears inside a control-flow or chain statement where piped expression sources cannot be statically validated and requires manual approval`
        };
    }
  if (statement.nestedCommands) {
    for (let cmd of statement.nestedCommands)
      if (cmd.redirections)
        for (let redir of cmd.redirections) {
          if (redir.isMerging)
            continue;
          if (!redir.target)
            continue;
          if (isNullRedirectionTarget(redir.target))
            continue;
          let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath2(redir.target, cwd2, toolPermissionContext, "create");
          if (!allowed) {
            let workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList2(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : `Output redirection to '${resolvedPath5}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${dirListStr}.`;
            if (decisionReason?.type === "rule")
              return {
                behavior: "deny",
                message,
                decisionReason
              };
            firstAsk ??= {
              behavior: "ask",
              message,
              blockedPath: resolvedPath5,
              decisionReason,
              suggestions: [
                {
                  type: "addDirectories",
                  directories: [getDirectoryForPath(resolvedPath5)],
                  destination: "session"
                }
              ]
            };
          }
        }
  }
  if (statement.redirections)
    for (let redir of statement.redirections) {
      if (redir.isMerging)
        continue;
      if (!redir.target)
        continue;
      if (isNullRedirectionTarget(redir.target))
        continue;
      let { allowed, resolvedPath: resolvedPath5, decisionReason } = validatePath2(redir.target, cwd2, toolPermissionContext, "create");
      if (!allowed) {
        let workingDirs = Array.from(allWorkingDirectories(toolPermissionContext)), dirListStr = formatDirectoryList2(workingDirs), message = decisionReason?.type === "other" || decisionReason?.type === "safetyCheck" ? decisionReason.reason : `Output redirection to '${resolvedPath5}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${dirListStr}.`;
        if (decisionReason?.type === "rule")
          return {
            behavior: "deny",
            message,
            decisionReason
          };
        firstAsk ??= {
          behavior: "ask",
          message,
          blockedPath: resolvedPath5,
          decisionReason,
          suggestions: [
            {
              type: "addDirectories",
              directories: [getDirectoryForPath(resolvedPath5)],
              destination: "session"
            }
          ]
        };
      }
    }
  return firstAsk ?? {
    behavior: "passthrough",
    message: "All path constraints validated successfully"
  };
}
var MAX_DIRS_TO_LIST2 = 5, GLOB_PATTERN_REGEX2, CMDLET_PATH_CONFIG, SAFE_PATH_ELEMENT_TYPES;
var init_pathValidation3 = __esm(() => {
  init_cwd2();
  init_fsOperations();
  init_path2();
  init_filesystem();
  init_PermissionUpdate();
  init_pathValidation();
  init_platform();
  init_parser5();
  init_commonParameters();
  init_readOnlyValidation2();
  GLOB_PATTERN_REGEX2 = /[*?[\]]/, CMDLET_PATH_CONFIG = {
    "set-content": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-passthru",
        "-force",
        "-whatif",
        "-confirm",
        "-usetransaction",
        "-nonewline",
        "-asbytestream"
      ],
      knownValueParams: [
        "-value",
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-encoding",
        "-stream"
      ]
    },
    "add-content": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-passthru",
        "-force",
        "-whatif",
        "-confirm",
        "-usetransaction",
        "-nonewline",
        "-asbytestream"
      ],
      knownValueParams: [
        "-value",
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-encoding",
        "-stream"
      ]
    },
    "remove-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-recurse",
        "-force",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-stream"
      ]
    },
    "clear-content": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-stream"
      ]
    },
    "out-file": {
      operationType: "write",
      pathParams: ["-filepath", "-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-append",
        "-force",
        "-noclobber",
        "-nonewline",
        "-whatif",
        "-confirm"
      ],
      knownValueParams: ["-inputobject", "-encoding", "-width"]
    },
    "tee-object": {
      operationType: "write",
      pathParams: ["-filepath", "-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-append"],
      knownValueParams: ["-inputobject", "-variable", "-encoding"]
    },
    "export-csv": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-append",
        "-force",
        "-noclobber",
        "-notypeinformation",
        "-includetypeinformation",
        "-useculture",
        "-noheader",
        "-whatif",
        "-confirm"
      ],
      knownValueParams: [
        "-inputobject",
        "-delimiter",
        "-encoding",
        "-quotefields",
        "-usequotes"
      ]
    },
    "export-clixml": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-noclobber", "-whatif", "-confirm"],
      knownValueParams: ["-inputobject", "-depth", "-encoding"]
    },
    "new-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      leafOnlyPathParams: ["-name"],
      knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
      knownValueParams: ["-itemtype", "-value", "-credential", "-type"]
    },
    "copy-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destination"],
      knownSwitches: [
        "-container",
        "-force",
        "-passthru",
        "-recurse",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-fromsession",
        "-tosession"
      ]
    },
    "move-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destination"],
      knownSwitches: [
        "-force",
        "-passthru",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: ["-filter", "-include", "-exclude", "-credential"]
    },
    "rename-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-force",
        "-passthru",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: [
        "-newname",
        "-credential",
        "-filter",
        "-include",
        "-exclude"
      ]
    },
    "set-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-force",
        "-passthru",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: [
        "-value",
        "-credential",
        "-filter",
        "-include",
        "-exclude"
      ]
    },
    "get-content": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-force",
        "-usetransaction",
        "-wait",
        "-raw",
        "-asbytestream"
      ],
      knownValueParams: [
        "-readcount",
        "-totalcount",
        "-tail",
        "-first",
        "-head",
        "-last",
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-delimiter",
        "-encoding",
        "-stream"
      ]
    },
    "get-childitem": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-recurse",
        "-force",
        "-name",
        "-usetransaction",
        "-followsymlink",
        "-directory",
        "-file",
        "-hidden",
        "-readonly",
        "-system"
      ],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-depth",
        "-attributes",
        "-credential"
      ]
    },
    "get-item": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-usetransaction"],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-stream"
      ]
    },
    "get-itemproperty": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-usetransaction"],
      knownValueParams: [
        "-name",
        "-filter",
        "-include",
        "-exclude",
        "-credential"
      ]
    },
    "get-itempropertyvalue": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-usetransaction"],
      knownValueParams: [
        "-name",
        "-filter",
        "-include",
        "-exclude",
        "-credential"
      ]
    },
    "get-filehash": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [],
      knownValueParams: ["-algorithm", "-inputstream"]
    },
    "get-acl": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-audit", "-allcentralaccesspolicies", "-usetransaction"],
      knownValueParams: ["-inputobject", "-filter", "-include", "-exclude"]
    },
    "format-hex": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-raw"],
      knownValueParams: [
        "-inputobject",
        "-encoding",
        "-count",
        "-offset"
      ]
    },
    "test-path": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-isvalid", "-usetransaction"],
      knownValueParams: [
        "-filter",
        "-include",
        "-exclude",
        "-pathtype",
        "-credential",
        "-olderthan",
        "-newerthan"
      ]
    },
    "resolve-path": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-relative", "-usetransaction", "-force"],
      knownValueParams: ["-credential", "-relativebasepath"]
    },
    "convert-path": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-usetransaction"],
      knownValueParams: []
    },
    "select-string": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-simplematch",
        "-casesensitive",
        "-quiet",
        "-list",
        "-notmatch",
        "-allmatches",
        "-noemphasis",
        "-raw"
      ],
      knownValueParams: [
        "-inputobject",
        "-pattern",
        "-include",
        "-exclude",
        "-encoding",
        "-context",
        "-culture"
      ]
    },
    "set-location": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-passthru", "-usetransaction"],
      knownValueParams: ["-stackname"]
    },
    "push-location": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-passthru", "-usetransaction"],
      knownValueParams: ["-stackname"]
    },
    "pop-location": {
      operationType: "read",
      pathParams: [],
      knownSwitches: ["-passthru", "-usetransaction"],
      knownValueParams: ["-stackname"]
    },
    "select-xml": {
      operationType: "read",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [],
      knownValueParams: ["-xml", "-content", "-xpath", "-namespace"]
    },
    "get-winevent": {
      operationType: "read",
      pathParams: ["-path"],
      knownSwitches: ["-force", "-oldest"],
      knownValueParams: [
        "-listlog",
        "-logname",
        "-listprovider",
        "-providername",
        "-maxevents",
        "-computername",
        "-credential",
        "-filterxpath",
        "-filterxml",
        "-filterhashtable"
      ]
    },
    "invoke-webrequest": {
      operationType: "write",
      pathParams: ["-outfile", "-infile"],
      positionalSkip: 1,
      optionalWrite: !0,
      knownSwitches: [
        "-allowinsecureredirect",
        "-allowunencryptedauthentication",
        "-disablekeepalive",
        "-nobodyprogress",
        "-passthru",
        "-preservefileauthorizationmetadata",
        "-resume",
        "-skipcertificatecheck",
        "-skipheadervalidation",
        "-skiphttperrorcheck",
        "-usebasicparsing",
        "-usedefaultcredentials"
      ],
      knownValueParams: [
        "-uri",
        "-method",
        "-body",
        "-contenttype",
        "-headers",
        "-maximumredirection",
        "-maximumretrycount",
        "-proxy",
        "-proxycredential",
        "-retryintervalsec",
        "-sessionvariable",
        "-timeoutsec",
        "-token",
        "-transferencoding",
        "-useragent",
        "-websession",
        "-credential",
        "-authentication",
        "-certificate",
        "-certificatethumbprint",
        "-form",
        "-httpversion"
      ]
    },
    "invoke-restmethod": {
      operationType: "write",
      pathParams: ["-outfile", "-infile"],
      positionalSkip: 1,
      optionalWrite: !0,
      knownSwitches: [
        "-allowinsecureredirect",
        "-allowunencryptedauthentication",
        "-disablekeepalive",
        "-followrellink",
        "-nobodyprogress",
        "-passthru",
        "-preservefileauthorizationmetadata",
        "-resume",
        "-skipcertificatecheck",
        "-skipheadervalidation",
        "-skiphttperrorcheck",
        "-usebasicparsing",
        "-usedefaultcredentials"
      ],
      knownValueParams: [
        "-uri",
        "-method",
        "-body",
        "-contenttype",
        "-headers",
        "-maximumfollowrellink",
        "-maximumredirection",
        "-maximumretrycount",
        "-proxy",
        "-proxycredential",
        "-responseheaderstvariable",
        "-retryintervalsec",
        "-sessionvariable",
        "-statuscodevariable",
        "-timeoutsec",
        "-token",
        "-transferencoding",
        "-useragent",
        "-websession",
        "-credential",
        "-authentication",
        "-certificate",
        "-certificatethumbprint",
        "-form",
        "-httpversion"
      ]
    },
    "expand-archive": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destinationpath"],
      knownSwitches: ["-force", "-passthru", "-whatif", "-confirm"],
      knownValueParams: []
    },
    "compress-archive": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destinationpath"],
      knownSwitches: ["-force", "-update", "-passthru", "-whatif", "-confirm"],
      knownValueParams: ["-compressionlevel"]
    },
    "set-itemproperty": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-passthru",
        "-force",
        "-whatif",
        "-confirm",
        "-usetransaction"
      ],
      knownValueParams: [
        "-name",
        "-value",
        "-type",
        "-filter",
        "-include",
        "-exclude",
        "-credential",
        "-inputobject"
      ]
    },
    "new-itemproperty": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
      knownValueParams: [
        "-name",
        "-value",
        "-propertytype",
        "-type",
        "-filter",
        "-include",
        "-exclude",
        "-credential"
      ]
    },
    "remove-itemproperty": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
      knownValueParams: [
        "-name",
        "-filter",
        "-include",
        "-exclude",
        "-credential"
      ]
    },
    "clear-item": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
      knownValueParams: ["-filter", "-include", "-exclude", "-credential"]
    },
    "export-alias": {
      operationType: "write",
      pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
      knownSwitches: [
        "-append",
        "-force",
        "-noclobber",
        "-passthru",
        "-whatif",
        "-confirm"
      ],
      knownValueParams: ["-name", "-description", "-scope", "-as"]
    }
  };
  SAFE_PATH_ELEMENT_TYPES = /* @__PURE__ */ new Set(["StringConstant", "Parameter"]);
});

