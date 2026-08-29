// Original: src/components/sandbox/SandboxConfigTab.tsx
function SandboxConfigTab() {
  let $3 = import_compiler_runtime267.c(3), isEnabled2 = SandboxManager2.isSandboxingEnabled(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel")) {
    let depCheck = SandboxManager2.checkDependencies();
    t0 = depCheck.warnings.length > 0 ? /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: depCheck.warnings.map(_temp163)
    }, void 0, !1, void 0, this) : null, $3[0] = t0;
  } else
    t0 = $3[0];
  let warningsNote = t0;
  if (!isEnabled2) {
    let t12;
    if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingY: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
            color: "subtle",
            children: "Sandbox is not enabled"
          }, void 0, !1, void 0, this),
          warningsNote
        ]
      }, void 0, !0, void 0, this), $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel")) {
    let fsReadConfig = SandboxManager2.getFsReadConfig(), fsWriteConfig = SandboxManager2.getFsWriteConfig(), networkConfig = SandboxManager2.getNetworkRestrictionConfig(), allowUnixSockets = SandboxManager2.getAllowUnixSockets(), excludedCommands = SandboxManager2.getExcludedCommands(), globPatternWarnings = SandboxManager2.getLinuxGlobPatternWarnings();
    t1 = /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "permission",
              children: "Excluded Commands:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: excludedCommands.length > 0 ? excludedCommands.join(", ") : "None"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        fsReadConfig.denyOnly.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "permission",
              children: "Filesystem Read Restrictions:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Denied: ",
                fsReadConfig.denyOnly.join(", ")
              ]
            }, void 0, !0, void 0, this),
            fsReadConfig.allowWithinDeny && fsReadConfig.allowWithinDeny.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Allowed within denied: ",
                fsReadConfig.allowWithinDeny.join(", ")
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        fsWriteConfig.allowOnly.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "permission",
              children: "Filesystem Write Restrictions:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Allowed: ",
                fsWriteConfig.allowOnly.join(", ")
              ]
            }, void 0, !0, void 0, this),
            fsWriteConfig.denyWithinAllow.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Denied within allowed: ",
                fsWriteConfig.denyWithinAllow.join(", ")
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        (networkConfig.allowedHosts && networkConfig.allowedHosts.length > 0 || networkConfig.deniedHosts && networkConfig.deniedHosts.length > 0) && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "permission",
              children: [
                "Network Restrictions",
                shouldAllowManagedSandboxDomainsOnly() ? " (Managed)" : "",
                ":"
              ]
            }, void 0, !0, void 0, this),
            networkConfig.allowedHosts && networkConfig.allowedHosts.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Allowed: ",
                networkConfig.allowedHosts.join(", ")
              ]
            }, void 0, !0, void 0, this),
            networkConfig.deniedHosts && networkConfig.deniedHosts.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Denied: ",
                networkConfig.deniedHosts.join(", ")
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        allowUnixSockets && allowUnixSockets.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "permission",
              children: "Allowed Unix Sockets:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: allowUnixSockets.join(", ")
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        globPatternWarnings.length > 0 && /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              bold: !0,
              color: "warning",
              children: "\u26A0 Warning: Glob patterns not fully supported on Linux"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "The following patterns will be ignored:",
                " ",
                globPatternWarnings.slice(0, 3).join(", "),
                globPatternWarnings.length > 3 && ` (${globPatternWarnings.length - 3} more)`
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        warningsNote
      ]
    }, void 0, !0, void 0, this), $3[2] = t1;
  } else
    t1 = $3[2];
  return t1;
}
function _temp163(w2, i5) {
  return /* @__PURE__ */ jsx_dev_runtime340.jsxDEV(ThemedText, {
    dimColor: !0,
    children: w2
  }, i5, !1, void 0, this);
}
var import_compiler_runtime267, jsx_dev_runtime340;
var init_SandboxConfigTab = __esm(() => {
  init_ink2();
  init_sandbox_adapter();
  import_compiler_runtime267 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime340 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
