// Original: src/components/sandbox/SandboxDependenciesTab.tsx
function SandboxDependenciesTab(t0) {
  let $3 = import_compiler_runtime268.c(24), {
    depCheck
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getPlatform(), $3[0] = t1;
  else
    t1 = $3[0];
  let isMac = t1 === "macos", t2;
  if ($3[1] !== depCheck.errors)
    t2 = depCheck.errors.some(_temp165), $3[1] = depCheck.errors, $3[2] = t2;
  else
    t2 = $3[2];
  let rgMissing = t2, t3;
  if ($3[3] !== depCheck.errors)
    t3 = depCheck.errors.some(_temp271), $3[3] = depCheck.errors, $3[4] = t3;
  else
    t3 = $3[4];
  let bwrapMissing = t3, t4;
  if ($3[5] !== depCheck.errors)
    t4 = depCheck.errors.some(_temp345), $3[5] = depCheck.errors, $3[6] = t4;
  else
    t4 = $3[6];
  let socatMissing = t4, seccompMissing = depCheck.warnings.length > 0, t5;
  if ($3[7] !== bwrapMissing || $3[8] !== depCheck.errors || $3[9] !== rgMissing || $3[10] !== seccompMissing || $3[11] !== socatMissing) {
    let otherErrors = depCheck.errors.filter(_temp434), rgInstallHint = isMac ? "brew install ripgrep" : "apt install ripgrep", t6;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t6 = isMac && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
          children: [
            "seatbelt: ",
            /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
              color: "success",
              children: "built-in (macOS)"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[13] = t6;
    else
      t6 = $3[13];
    let t7, t8;
    if ($3[14] !== rgMissing)
      t7 = /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
        children: [
          "ripgrep (rg):",
          " ",
          rgMissing ? /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
            color: "error",
            children: "not found"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
            color: "success",
            children: "found"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), t8 = rgMissing && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          "\xB7 ",
          rgInstallHint
        ]
      }, void 0, !0, void 0, this), $3[14] = rgMissing, $3[15] = t7, $3[16] = t8;
    else
      t7 = $3[15], t8 = $3[16];
    let t9;
    if ($3[17] !== t7 || $3[18] !== t8)
      t9 = /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t7,
          t8
        ]
      }, void 0, !0, void 0, this), $3[17] = t7, $3[18] = t8, $3[19] = t9;
    else
      t9 = $3[19];
    let t10;
    if ($3[20] !== bwrapMissing || $3[21] !== seccompMissing || $3[22] !== socatMissing)
      t10 = !isMac && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(jsx_dev_runtime341.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                children: [
                  "bubblewrap (bwrap):",
                  " ",
                  bwrapMissing ? /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "error",
                    children: "not installed"
                  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "success",
                    children: "installed"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              bwrapMissing && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "  ",
                  "\xB7 apt install bubblewrap"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                children: [
                  "socat:",
                  " ",
                  socatMissing ? /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "error",
                    children: "not installed"
                  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "success",
                    children: "installed"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              socatMissing && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "  ",
                  "\xB7 apt install socat"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                children: [
                  "seccomp filter:",
                  " ",
                  seccompMissing ? /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "warning",
                    children: "not installed"
                  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    color: "success",
                    children: "installed"
                  }, void 0, !1, void 0, this),
                  seccompMissing && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: " (required to block unix domain sockets)"
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              seccompMissing && /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                children: [
                  /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      "  ",
                      "\xB7 npm install -g @anthropic-ai/sandbox-runtime"
                    ]
                  }, void 0, !0, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      "  ",
                      "\xB7 or copy vendor/seccomp/* from sandbox-runtime and set"
                    ]
                  }, void 0, !0, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      "    ",
                      "sandbox.seccomp.bpfPath and applyPath in settings.json"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[20] = bwrapMissing, $3[21] = seccompMissing, $3[22] = socatMissing, $3[23] = t10;
    else
      t10 = $3[23];
    t5 = /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      gap: 1,
      children: [
        t6,
        t9,
        t10,
        otherErrors.map(_temp524)
      ]
    }, void 0, !0, void 0, this), $3[7] = bwrapMissing, $3[8] = depCheck.errors, $3[9] = rgMissing, $3[10] = seccompMissing, $3[11] = socatMissing, $3[12] = t5;
  } else
    t5 = $3[12];
  return t5;
}
function _temp524(err2) {
  return /* @__PURE__ */ jsx_dev_runtime341.jsxDEV(ThemedText, {
    color: "error",
    children: err2
  }, err2, !1, void 0, this);
}
function _temp434(e_2) {
  return !e_2.includes("ripgrep") && !e_2.includes("bwrap") && !e_2.includes("socat");
}
function _temp345(e_1) {
  return e_1.includes("socat");
}
function _temp271(e_0) {
  return e_0.includes("bwrap");
}
function _temp165(e) {
  return e.includes("ripgrep");
}
var import_compiler_runtime268, jsx_dev_runtime341;
var init_SandboxDependenciesTab = __esm(() => {
  init_ink2();
  init_platform();
  import_compiler_runtime268 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime341 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
