// Original: src/utils/swarm/It2SetupPrompt.tsx
function It2SetupPrompt(t0) {
  let $3 = import_compiler_runtime122.c(44), {
    onDone,
    tmuxAvailable: tmuxAvailable2
  } = t0, [step, setStep] = import_react81.useState("initial"), [packageManager, setPackageManager] = import_react81.useState(null), [error44, setError] = import_react81.useState(null), exitState = useExitOnCtrlCDWithKeybindings(), t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      detectPythonPackageManager().then((pm) => {
        setPackageManager(pm);
      });
    }, t2 = [], $3[0] = t1, $3[1] = t2;
  else
    t1 = $3[0], t2 = $3[1];
  import_react81.useEffect(t1, t2);
  let t3;
  if ($3[2] !== onDone)
    t3 = () => {
      onDone("cancelled");
    }, $3[2] = onDone, $3[3] = t3;
  else
    t3 = $3[3];
  let handleCancel = t3, t4 = step !== "installing" && step !== "verifying", t5;
  if ($3[4] !== t4)
    t5 = {
      context: "Confirmation",
      isActive: t4
    }, $3[4] = t4, $3[5] = t5;
  else
    t5 = $3[5];
  useKeybinding("confirm:no", handleCancel, t5);
  let t6;
  if ($3[6] !== onDone || $3[7] !== step)
    t6 = (_input, key3) => {
      if (step === "api-instructions" && key3.return)
        setStep("verifying"), verifyIt2Setup().then((result) => {
          if (result.success)
            markIt2SetupComplete(), setStep("success"), setTimeout(onDone, 1500, "installed");
          else
            setError(result.error || "Verification failed"), setStep("failed");
        });
    }, $3[6] = onDone, $3[7] = step, $3[8] = t6;
  else
    t6 = $3[8];
  use_input_default(t6);
  let t7;
  if ($3[9] !== packageManager)
    t7 = async function() {
      if (!packageManager) {
        setError("No Python package manager found (uvx, pipx, or pip)"), setStep("failed");
        return;
      }
      setStep("installing");
      let result_0 = await installIt2(packageManager);
      if (result_0.success)
        setStep("api-instructions");
      else
        setError(result_0.error || "Installation failed"), setStep("install-failed");
    }, $3[9] = packageManager, $3[10] = t7;
  else
    t7 = $3[10];
  let handleInstall = t7, t8;
  if ($3[11] !== onDone)
    t8 = function() {
      setPreferTmuxOverIterm2(!0), onDone("use-tmux");
    }, $3[11] = onDone, $3[12] = t8;
  else
    t8 = $3[12];
  let handleUseTmux = t8, T0, T1, t10, t11, t12, t13, t14, t9;
  if ($3[13] !== error44 || $3[14] !== handleInstall || $3[15] !== handleUseTmux || $3[16] !== onDone || $3[17] !== packageManager || $3[18] !== step || $3[19] !== tmuxAvailable2) {
    let renderInitialPrompt = function() {
      let options2 = [{
        label: "Install it2 now",
        value: "install",
        description: packageManager ? `Uses ${packageManager} to install the it2 CLI tool` : "Requires Python (uvx, pipx, or pip)"
      }];
      if (tmuxAvailable2)
        options2.push({
          label: "Use tmux instead",
          value: "tmux",
          description: "Opens teammates in a separate tmux session"
        });
      return options2.push({
        label: "Cancel",
        value: "cancel",
        description: "Skip teammate spawning for now"
      }), /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            children: [
              "To use native iTerm2 split panes for teammates, you need the",
              " ",
              /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
                bold: !0,
                children: "it2"
              }, void 0, !1, void 0, this),
              " CLI tool."
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "This enables teammates to appear as split panes within your current window."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(Select, {
              options: options2,
              onChange: (value) => {
                bb61:
                  switch (value) {
                    case "install": {
                      handleInstall();
                      break bb61;
                    }
                    case "tmux": {
                      handleUseTmux();
                      break bb61;
                    }
                    case "cancel":
                      onDone("cancelled");
                  }
              },
              onCancel: () => onDone("cancelled")
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderInstalling = function() {
      return /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
                children: [
                  " Installing it2 using ",
                  packageManager,
                  "\u2026"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "This may take a moment."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderInstallFailed = function() {
      let options_0 = [{
        label: "Try again",
        value: "retry",
        description: "Retry the installation"
      }];
      if (tmuxAvailable2)
        options_0.push({
          label: "Use tmux instead",
          value: "tmux",
          description: "Falls back to tmux for teammate panes"
        });
      return options_0.push({
        label: "Cancel",
        value: "cancel",
        description: "Skip teammate spawning for now"
      }), /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            color: "error",
            children: "Installation failed"
          }, void 0, !1, void 0, this),
          error44 && /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: error44
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "You can try installing manually:",
              " ",
              packageManager === "uvx" ? "uv tool install it2" : packageManager === "pipx" ? "pipx install it2" : "pip install --user it2"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(Select, {
              options: options_0,
              onChange: (value_0) => {
                bb89:
                  switch (value_0) {
                    case "retry": {
                      handleInstall();
                      break bb89;
                    }
                    case "tmux": {
                      handleUseTmux();
                      break bb89;
                    }
                    case "cancel":
                      onDone("cancelled");
                  }
              },
              onCancel: () => onDone("cancelled")
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderApiInstructions = function() {
      let instructions = getPythonApiInstructions();
      return /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            color: "success",
            children: "\u2713 it2 installed successfully"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: 1,
            children: instructions.map(_temp51)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Press Enter when ready to verify\u2026"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderVerifying = function() {
      return /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            children: " Verifying it2 can communicate with iTerm2\u2026"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderSuccess = function() {
      return /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            color: "success",
            children: "\u2713 iTerm2 split pane support is ready"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Teammates will now appear as split panes."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderFailed = function() {
      let options_1 = [{
        label: "Try again",
        value: "retry",
        description: "Verify the connection again"
      }];
      if (tmuxAvailable2)
        options_1.push({
          label: "Use tmux instead",
          value: "tmux",
          description: "Falls back to tmux for teammate panes"
        });
      return options_1.push({
        label: "Cancel",
        value: "cancel",
        description: "Skip teammate spawning for now"
      }), /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            color: "error",
            children: "Verification failed"
          }, void 0, !1, void 0, this),
          error44 && /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            dimColor: !0,
            children: error44
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
            children: "Make sure:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            paddingLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
                children: "\xB7 Python API is enabled in iTerm2 preferences"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
                children: "\xB7 You may need to restart iTerm2 after enabling"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(Select, {
              options: options_1,
              onChange: (value_1) => {
                bb115:
                  switch (value_1) {
                    case "retry": {
                      setStep("verifying"), verifyIt2Setup().then((result_1) => {
                        if (result_1.success)
                          markIt2SetupComplete(), setStep("success"), setTimeout(onDone, 1500, "installed");
                        else
                          setError(result_1.error || "Verification failed"), setStep("failed");
                      });
                      break bb115;
                    }
                    case "tmux": {
                      handleUseTmux();
                      break bb115;
                    }
                    case "cancel":
                      onDone("cancelled");
                  }
              },
              onCancel: () => onDone("cancelled")
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }, renderContent = () => {
      switch (step) {
        case "initial":
          return renderInitialPrompt();
        case "installing":
          return renderInstalling();
        case "install-failed":
          return renderInstallFailed();
        case "api-instructions":
          return renderApiInstructions();
        case "verifying":
          return renderVerifying();
        case "success":
          return renderSuccess();
        case "failed":
          return renderFailed();
        default:
          return null;
      }
    };
    if (T1 = Pane, t14 = "permission", T0 = ThemedBox_default, t9 = "column", t10 = 1, t11 = 1, $3[28] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
        bold: !0,
        color: "permission",
        children: "iTerm2 Split Pane Setup"
      }, void 0, !1, void 0, this), $3[28] = t12;
    else
      t12 = $3[28];
    t13 = renderContent(), $3[13] = error44, $3[14] = handleInstall, $3[15] = handleUseTmux, $3[16] = onDone, $3[17] = packageManager, $3[18] = step, $3[19] = tmuxAvailable2, $3[20] = T0, $3[21] = T1, $3[22] = t10, $3[23] = t11, $3[24] = t12, $3[25] = t13, $3[26] = t14, $3[27] = t9;
  } else
    T0 = $3[20], T1 = $3[21], t10 = $3[22], t11 = $3[23], t12 = $3[24], t13 = $3[25], t14 = $3[26], t9 = $3[27];
  let t15;
  if ($3[29] !== exitState || $3[30] !== step)
    t15 = step !== "installing" && step !== "verifying" && step !== "success" && /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(jsx_dev_runtime151.Fragment, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(jsx_dev_runtime151.Fragment, {
        children: "Esc to cancel"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = exitState, $3[30] = step, $3[31] = t15;
  else
    t15 = $3[31];
  let t16;
  if ($3[32] !== T0 || $3[33] !== t10 || $3[34] !== t11 || $3[35] !== t12 || $3[36] !== t13 || $3[37] !== t15 || $3[38] !== t9)
    t16 = /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(T0, {
      flexDirection: t9,
      gap: t10,
      paddingBottom: t11,
      children: [
        t12,
        t13,
        t15
      ]
    }, void 0, !0, void 0, this), $3[32] = T0, $3[33] = t10, $3[34] = t11, $3[35] = t12, $3[36] = t13, $3[37] = t15, $3[38] = t9, $3[39] = t16;
  else
    t16 = $3[39];
  let t17;
  if ($3[40] !== T1 || $3[41] !== t14 || $3[42] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(T1, {
      color: t14,
      children: t16
    }, void 0, !1, void 0, this), $3[40] = T1, $3[41] = t14, $3[42] = t16, $3[43] = t17;
  else
    t17 = $3[43];
  return t17;
}
function _temp51(line, i5) {
  return /* @__PURE__ */ jsx_dev_runtime151.jsxDEV(ThemedText, {
    children: line
  }, i5, !1, void 0, this);
}
var import_compiler_runtime122, import_react81, jsx_dev_runtime151;
var init_It2SetupPrompt = __esm(() => {
  init_CustomSelect();
  init_Pane();
  init_Spinner2();
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_useKeybinding();
  init_it2Setup();
  import_compiler_runtime122 = __toESM(require_react_compiler_runtime_development(), 1), import_react81 = __toESM(require_react_development(), 1), jsx_dev_runtime151 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
