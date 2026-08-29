// function: Doctor
function Doctor(t0) {
  let $3 = import_compiler_runtime159.c(84), {
    onDone
  } = t0, agentDefinitions = useAppState(_temp88), mcpTools = useAppState(_temp229), toolPermissionContext = useAppState(_temp321), pluginsErrors = useAppState(_temp418);
  useExitOnCtrlCDWithKeybindings();
  let t1;
  if ($3[0] !== mcpTools)
    t1 = mcpTools || [], $3[0] = mcpTools, $3[1] = t1;
  else
    t1 = $3[1];
  let tools = t1, [diagnostic, setDiagnostic] = import_react113.useState(null), [agentInfo, setAgentInfo] = import_react113.useState(null), [contextWarnings, setContextWarnings] = import_react113.useState(null), [versionLockInfo, setVersionLockInfo] = import_react113.useState(null), validationErrors = useSettingsErrors(), t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getDoctorDiagnostic().then(_temp610), $3[2] = t2;
  else
    t2 = $3[2];
  let distTagsPromise = t2, autoUpdatesChannel = getInitialSettings()?.autoUpdatesChannel ?? "latest", t3;
  if ($3[3] !== validationErrors)
    t3 = validationErrors.filter(_temp710), $3[3] = validationErrors, $3[4] = t3;
  else
    t3 = $3[4];
  let errorsExcludingMcp = t3, t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      name: "BASH_MAX_OUTPUT_LENGTH",
      default: BASH_MAX_OUTPUT_DEFAULT,
      upperLimit: BASH_MAX_OUTPUT_UPPER_LIMIT
    }, {
      name: "TASK_MAX_OUTPUT_LENGTH",
      default: TASK_MAX_OUTPUT_DEFAULT,
      upperLimit: TASK_MAX_OUTPUT_UPPER_LIMIT
    }, {
      name: "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
      ...getModelMaxOutputTokens("claude-opus-4-6")
    }].map(_temp86).filter(_temp93), $3[5] = t4;
  else
    t4 = $3[5];
  let envValidationErrors = t4, t5, t6;
  if ($3[6] !== agentDefinitions || $3[7] !== toolPermissionContext || $3[8] !== tools)
    t5 = () => {
      getDoctorDiagnostic().then(setDiagnostic), (async () => {
        let userAgentsDir = join113(getClaudeConfigHomeDir(), "agents"), projectAgentsDir = join113(getOriginalCwd(), ".claude", "agents"), {
          activeAgents,
          allAgents,
          failedFiles
        } = agentDefinitions, [userDirExists, projectDirExists] = await Promise.all([pathExists(userAgentsDir), pathExists(projectAgentsDir)]), agentInfoData = {
          activeAgents: activeAgents.map(_temp02),
          userAgentsDir,
          projectAgentsDir,
          userDirExists,
          projectDirExists,
          failedFiles
        };
        setAgentInfo(agentInfoData);
        let warnings = await checkContextWarnings(tools, {
          activeAgents,
          allAgents,
          failedFiles
        }, async () => toolPermissionContext);
        if (setContextWarnings(warnings), isPidBasedLockingEnabled()) {
          let locksDir = join113(getXDGStateHome(), "claude", "locks"), staleLocksCleaned = cleanupStaleLocks(locksDir), locks = getAllLockInfo(locksDir);
          setVersionLockInfo({
            enabled: !0,
            locks,
            locksDir,
            staleLocksCleaned
          });
        } else
          setVersionLockInfo({
            enabled: !1,
            locks: [],
            locksDir: "",
            staleLocksCleaned: 0
          });
      })();
    }, t6 = [toolPermissionContext, tools, agentDefinitions], $3[6] = agentDefinitions, $3[7] = toolPermissionContext, $3[8] = tools, $3[9] = t5, $3[10] = t6;
  else
    t5 = $3[9], t6 = $3[10];
  import_react113.useEffect(t5, t6);
  let t7;
  if ($3[11] !== onDone)
    t7 = () => {
      onDone("Claude Code diagnostics dismissed", {
        display: "system"
      });
    }, $3[11] = onDone, $3[12] = t7;
  else
    t7 = $3[12];
  let handleDismiss = t7, t8;
  if ($3[13] !== handleDismiss)
    t8 = {
      "confirm:yes": handleDismiss,
      "confirm:no": handleDismiss
    }, $3[13] = handleDismiss, $3[14] = t8;
  else
    t8 = $3[14];
  let t9;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t9 = {
      context: "Confirmation"
    }, $3[15] = t9;
  else
    t9 = $3[15];
  if (useKeybindings(t8, t9), !diagnostic) {
    let t102;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t102 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(Pane, {
        children: /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Checking installation status\u2026"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[16] = t102;
    else
      t102 = $3[16];
    return t102;
  }
  let t10;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      bold: !0,
      children: "Diagnostics"
    }, void 0, !1, void 0, this), $3[17] = t10;
  else
    t10 = $3[17];
  let t11;
  if ($3[18] !== diagnostic.installationType || $3[19] !== diagnostic.version)
    t11 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Currently running: ",
        diagnostic.installationType,
        " (",
        diagnostic.version,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[18] = diagnostic.installationType, $3[19] = diagnostic.version, $3[20] = t11;
  else
    t11 = $3[20];
  let t12;
  if ($3[21] !== diagnostic.packageManager)
    t12 = diagnostic.packageManager && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Package manager: ",
        diagnostic.packageManager
      ]
    }, void 0, !0, void 0, this), $3[21] = diagnostic.packageManager, $3[22] = t12;
  else
    t12 = $3[22];
  let t13;
  if ($3[23] !== diagnostic.installationPath)
    t13 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Path: ",
        diagnostic.installationPath
      ]
    }, void 0, !0, void 0, this), $3[23] = diagnostic.installationPath, $3[24] = t13;
  else
    t13 = $3[24];
  let t14;
  if ($3[25] !== diagnostic.invokedBinary)
    t14 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Invoked: ",
        diagnostic.invokedBinary
      ]
    }, void 0, !0, void 0, this), $3[25] = diagnostic.invokedBinary, $3[26] = t14;
  else
    t14 = $3[26];
  let t15;
  if ($3[27] !== diagnostic.configInstallMethod)
    t15 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Config install method: ",
        diagnostic.configInstallMethod
      ]
    }, void 0, !0, void 0, this), $3[27] = diagnostic.configInstallMethod, $3[28] = t15;
  else
    t15 = $3[28];
  let t16 = diagnostic.ripgrepStatus.working ? "OK" : "Not working", t17 = diagnostic.ripgrepStatus.mode === "embedded" ? "bundled" : diagnostic.ripgrepStatus.mode === "builtin" ? "vendor" : diagnostic.ripgrepStatus.systemPath || "system", t18;
  if ($3[29] !== t16 || $3[30] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Search: ",
        t16,
        " (",
        t17,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[29] = t16, $3[30] = t17, $3[31] = t18;
  else
    t18 = $3[31];
  let t19;
  if ($3[32] !== diagnostic.recommendation)
    t19 = diagnostic.recommendation && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          color: "warning",
          children: [
            "Recommendation: ",
            diagnostic.recommendation.split(`
`)[0]
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          dimColor: !0,
          children: diagnostic.recommendation.split(`
`)[1]
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[32] = diagnostic.recommendation, $3[33] = t19;
  else
    t19 = $3[33];
  let t20;
  if ($3[34] !== diagnostic.multipleInstallations)
    t20 = diagnostic.multipleInstallations.length > 1 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          color: "warning",
          children: "Warning: Multiple installations found"
        }, void 0, !1, void 0, this),
        diagnostic.multipleInstallations.map(_temp110)
      ]
    }, void 0, !0, void 0, this), $3[34] = diagnostic.multipleInstallations, $3[35] = t20;
  else
    t20 = $3[35];
  let t21;
  if ($3[36] !== diagnostic.warnings)
    t21 = diagnostic.warnings.length > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {}, void 0, !1, void 0, this),
        diagnostic.warnings.map(_temp103)
      ]
    }, void 0, !0, void 0, this), $3[36] = diagnostic.warnings, $3[37] = t21;
  else
    t21 = $3[37];
  let t22;
  if ($3[38] !== errorsExcludingMcp)
    t22 = errorsExcludingMcp.length > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          children: "Invalid Settings"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ValidationErrorsList, {
          errors: errorsExcludingMcp
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[38] = errorsExcludingMcp, $3[39] = t22;
  else
    t22 = $3[39];
  let t23;
  if ($3[40] !== t11 || $3[41] !== t12 || $3[42] !== t13 || $3[43] !== t14 || $3[44] !== t15 || $3[45] !== t18 || $3[46] !== t19 || $3[47] !== t20 || $3[48] !== t21 || $3[49] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t10,
        t11,
        t12,
        t13,
        t14,
        t15,
        t18,
        t19,
        t20,
        t21,
        t22
      ]
    }, void 0, !0, void 0, this), $3[40] = t11, $3[41] = t12, $3[42] = t13, $3[43] = t14, $3[44] = t15, $3[45] = t18, $3[46] = t19, $3[47] = t20, $3[48] = t21, $3[49] = t22, $3[50] = t23;
  else
    t23 = $3[50];
  let t24;
  if ($3[51] === Symbol.for("react.memo_cache_sentinel"))
    t24 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      bold: !0,
      children: "Updates"
    }, void 0, !1, void 0, this), $3[51] = t24;
  else
    t24 = $3[51];
  let t25 = diagnostic.packageManager ? "Managed by package manager" : diagnostic.autoUpdates, t26;
  if ($3[52] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Auto-updates:",
        " ",
        t25
      ]
    }, void 0, !0, void 0, this), $3[52] = t25, $3[53] = t26;
  else
    t26 = $3[53];
  let t27;
  if ($3[54] !== diagnostic.hasUpdatePermissions)
    t27 = diagnostic.hasUpdatePermissions !== null && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Update permissions:",
        " ",
        diagnostic.hasUpdatePermissions ? "Yes" : "No (requires sudo)"
      ]
    }, void 0, !0, void 0, this), $3[54] = diagnostic.hasUpdatePermissions, $3[55] = t27;
  else
    t27 = $3[55];
  let t28;
  if ($3[56] === Symbol.for("react.memo_cache_sentinel"))
    t28 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Auto-update channel: ",
        autoUpdatesChannel
      ]
    }, void 0, !0, void 0, this), $3[56] = t28;
  else
    t28 = $3[56];
  let t29;
  if ($3[57] === Symbol.for("react.memo_cache_sentinel"))
    t29 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(import_react113.Suspense, {
      fallback: null,
      children: /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(DistTagsDisplay, {
        promise: distTagsPromise
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[57] = t29;
  else
    t29 = $3[57];
  let t30;
  if ($3[58] !== t26 || $3[59] !== t27)
    t30 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t24,
        t26,
        t27,
        t28,
        t29
      ]
    }, void 0, !0, void 0, this), $3[58] = t26, $3[59] = t27, $3[60] = t30;
  else
    t30 = $3[60];
  let t31, t32, t33, t34;
  if ($3[61] === Symbol.for("react.memo_cache_sentinel"))
    t31 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(SandboxDoctorSection, {}, void 0, !1, void 0, this), t32 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(McpParsingWarnings, {}, void 0, !1, void 0, this), t33 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(KeybindingWarnings, {}, void 0, !1, void 0, this), t34 = envValidationErrors.length > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          children: "Environment Variables"
        }, void 0, !1, void 0, this),
        envValidationErrors.map(_temp112)
      ]
    }, void 0, !0, void 0, this), $3[61] = t31, $3[62] = t32, $3[63] = t33, $3[64] = t34;
  else
    t31 = $3[61], t32 = $3[62], t33 = $3[63], t34 = $3[64];
  let t35;
  if ($3[65] !== versionLockInfo)
    t35 = versionLockInfo?.enabled && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          children: "Version Locks"
        }, void 0, !1, void 0, this),
        versionLockInfo.staleLocksCleaned > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "\u2514 Cleaned ",
            versionLockInfo.staleLocksCleaned,
            " stale lock(s)"
          ]
        }, void 0, !0, void 0, this),
        versionLockInfo.locks.length === 0 ? /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u2514 No active version locks"
        }, void 0, !1, void 0, this) : versionLockInfo.locks.map(_temp123)
      ]
    }, void 0, !0, void 0, this), $3[65] = versionLockInfo, $3[66] = t35;
  else
    t35 = $3[66];
  let t36;
  if ($3[67] !== agentInfo)
    t36 = agentInfo?.failedFiles && agentInfo.failedFiles.length > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: "Agent Parse Errors"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "\u2514 Failed to parse ",
            agentInfo.failedFiles.length,
            " agent file(s):"
          ]
        }, void 0, !0, void 0, this),
        agentInfo.failedFiles.map(_temp133)
      ]
    }, void 0, !0, void 0, this), $3[67] = agentInfo, $3[68] = t36;
  else
    t36 = $3[68];
  let t37;
  if ($3[69] !== pluginsErrors)
    t37 = pluginsErrors.length > 0 && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: "Plugin Errors"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "\u2514 ",
            pluginsErrors.length,
            " plugin error(s) detected:"
          ]
        }, void 0, !0, void 0, this),
        pluginsErrors.map(_temp142)
      ]
    }, void 0, !0, void 0, this), $3[69] = pluginsErrors, $3[70] = t37;
  else
    t37 = $3[70];
  let t38;
  if ($3[71] !== contextWarnings)
    t38 = contextWarnings?.unreachableRulesWarning && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          color: "warning",
          children: "Unreachable Permission Rules"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          children: [
            "\u2514",
            " ",
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              color: "warning",
              children: [
                figures_default.warning,
                " ",
                contextWarnings.unreachableRulesWarning.message
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        contextWarnings.unreachableRulesWarning.details.map(_temp152)
      ]
    }, void 0, !0, void 0, this), $3[71] = contextWarnings, $3[72] = t38;
  else
    t38 = $3[72];
  let t39;
  if ($3[73] !== contextWarnings)
    t39 = contextWarnings && (contextWarnings.claudeMdWarning || contextWarnings.agentWarning || contextWarnings.mcpWarning) && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
          bold: !0,
          children: "Context Usage Warnings"
        }, void 0, !1, void 0, this),
        contextWarnings.claudeMdWarning && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "\u2514",
                " ",
                /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
                  color: "warning",
                  children: [
                    figures_default.warning,
                    " ",
                    contextWarnings.claudeMdWarning.message
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "  ",
                "\u2514 Files:"
              ]
            }, void 0, !0, void 0, this),
            contextWarnings.claudeMdWarning.details.map(_temp162)
          ]
        }, void 0, !0, void 0, this),
        contextWarnings.agentWarning && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "\u2514",
                " ",
                /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
                  color: "warning",
                  children: [
                    figures_default.warning,
                    " ",
                    contextWarnings.agentWarning.message
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "  ",
                "\u2514 Top contributors:"
              ]
            }, void 0, !0, void 0, this),
            contextWarnings.agentWarning.details.map(_temp172)
          ]
        }, void 0, !0, void 0, this),
        contextWarnings.mcpWarning && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "\u2514",
                " ",
                /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
                  color: "warning",
                  children: [
                    figures_default.warning,
                    " ",
                    contextWarnings.mcpWarning.message
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
              children: [
                "  ",
                "\u2514 MCP servers:"
              ]
            }, void 0, !0, void 0, this),
            contextWarnings.mcpWarning.details.map(_temp182)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[73] = contextWarnings, $3[74] = t39;
  else
    t39 = $3[74];
  let t40;
  if ($3[75] === Symbol.for("react.memo_cache_sentinel"))
    t40 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(PressEnterToContinue, {}, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[75] = t40;
  else
    t40 = $3[75];
  let t41;
  if ($3[76] !== t23 || $3[77] !== t30 || $3[78] !== t35 || $3[79] !== t36 || $3[80] !== t37 || $3[81] !== t38 || $3[82] !== t39)
    t41 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(Pane, {
      children: [
        t23,
        t30,
        t31,
        t32,
        t33,
        t34,
        t35,
        t36,
        t37,
        t38,
        t39,
        t40
      ]
    }, void 0, !0, void 0, this), $3[76] = t23, $3[77] = t30, $3[78] = t35, $3[79] = t36, $3[80] = t37, $3[81] = t38, $3[82] = t39, $3[83] = t41;
  else
    t41 = $3[83];
  return t41;
}
