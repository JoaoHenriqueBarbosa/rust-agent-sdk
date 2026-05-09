// Original: src/commands/install.tsx
var exports_install = {};
__export(exports_install, {
  install: () => install
});
import { homedir as homedir40 } from "os";
import { join as join152 } from "path";
function getInstallationPath2() {
  let isWindows3 = env3.platform === "win32", homeDir = homedir40();
  if (isWindows3)
    return join152(homeDir, ".local", "bin", "claude.exe").replace(/\//g, "\\");
  return "~/.local/bin/claude";
}
function SetupNotes(t0) {
  let $3 = import_compiler_runtime380.c(5), {
    messages
  } = t0;
  if (messages.length === 0)
    return null;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
        color: "warning",
        children: [
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(StatusIcon, {
            status: "warning",
            withSpace: !0
          }, void 0, !1, void 0, this),
          "Setup notes:"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== messages)
    t2 = messages.map(_temp308), $3[1] = messages, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 0,
      marginBottom: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function _temp308(message, index2) {
  return /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
    marginLeft: 2,
    children: /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "\u2022 ",
        message
      ]
    }, void 0, !0, void 0, this)
  }, index2, !1, void 0, this);
}
function Install({
  onDone,
  force,
  target
}) {
  let [state4, setState] = import_react318.useState({
    type: "checking"
  });
  return import_react318.useEffect(() => {
    async function run() {
      try {
        logForDebugging(`Install: Starting installation process (force=${force}, target=${target})`);
        let channelOrVersion = target || getInitialSettings()?.autoUpdatesChannel || "latest";
        setState({
          type: "installing",
          version: channelOrVersion
        }), logForDebugging(`Install: Calling installLatest(channelOrVersion=${channelOrVersion}, forceReinstall=${force})`);
        let result = await installLatest(channelOrVersion, force);
        if (logForDebugging(`Install: installLatest returned version=${result.latestVersion}, wasUpdated=${result.wasUpdated}, lockFailed=${result.lockFailed}`), result.lockFailed)
          throw Error("Could not install - another process is currently installing Claude. Please try again in a moment.");
        if (!result.latestVersion)
          logForDebugging("Install: Failed to retrieve version information during install", {
            level: "error"
          });
        if (!result.wasUpdated)
          logForDebugging("Install: Already up to date");
        setState({
          type: "setting-up"
        });
        let setupMessages = await checkInstall(!0);
        if (logForDebugging(`Install: Setup launcher completed with ${setupMessages.length} messages`), setupMessages.length > 0)
          setupMessages.forEach((msg) => logForDebugging(`Install: Setup message: ${msg.message}`));
        logForDebugging("Install: Cleaning up npm installations after successful install");
        let {
          removed,
          errors: errors8,
          warnings
        } = await cleanupNpmInstallations();
        if (removed > 0)
          logForDebugging(`Cleaned up ${removed} npm installation(s)`);
        if (errors8.length > 0)
          logForDebugging(`Cleanup errors: ${errors8.join(", ")}`);
        let aliasMessages = await cleanupShellAliases();
        if (aliasMessages.length > 0)
          logForDebugging(`Shell alias cleanup: ${aliasMessages.map((m4) => m4.message).join("; ")}`);
        if (logEvent("tengu_claude_install_command", {
          has_version: result.latestVersion ? 1 : 0,
          forced: force ? 1 : 0
        }), target === "latest" || target === "stable")
          updateSettingsForSource("userSettings", {
            autoUpdatesChannel: target
          }), logForDebugging(`Install: Saved autoUpdatesChannel=${target} to user settings`);
        let allWarnings = [...warnings, ...aliasMessages.map((m_0) => m_0.message)];
        if (setupMessages.length > 0)
          setState({
            type: "set-up",
            messages: setupMessages.map((m_1) => m_1.message)
          }), setTimeout(setState, 2000, {
            type: "success",
            version: result.latestVersion || "current",
            setupMessages: [...setupMessages.map((m_2) => m_2.message), ...allWarnings]
          });
        else
          logForDebugging("Install: Shell PATH already configured"), setState({
            type: "success",
            version: result.latestVersion || "current",
            setupMessages: allWarnings.length > 0 ? allWarnings : void 0
          });
      } catch (error44) {
        logForDebugging(`Install command failed: ${error44}`, {
          level: "error"
        }), setState({
          type: "error",
          message: errorMessage(error44)
        });
      }
    }
    run();
  }, [force, target]), import_react318.useEffect(() => {
    if (state4.type === "success")
      setTimeout(onDone, 2000, "Claude Code installation completed successfully", {
        display: "system"
      });
    else if (state4.type === "error")
      setTimeout(onDone, 3000, "Claude Code installation failed", {
        display: "system"
      });
  }, [state4, onDone]), /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      state4.type === "checking" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
        color: "claude",
        children: "Checking installation status..."
      }, void 0, !1, void 0, this),
      state4.type === "cleaning-npm" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
        color: "warning",
        children: "Cleaning up old npm installations..."
      }, void 0, !1, void 0, this),
      state4.type === "installing" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
        color: "claude",
        children: [
          "Installing Claude Code native build ",
          state4.version,
          "..."
        ]
      }, void 0, !0, void 0, this),
      state4.type === "setting-up" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
        color: "claude",
        children: "Setting up launcher and shell integration..."
      }, void 0, !1, void 0, this),
      state4.type === "set-up" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(SetupNotes, {
        messages: state4.messages
      }, void 0, !1, void 0, this),
      state4.type === "success" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(StatusIcon, {
                status: "success",
                withSpace: !0
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                color: "success",
                bold: !0,
                children: "Claude Code successfully installed!"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
            marginLeft: 2,
            flexDirection: "column",
            gap: 1,
            children: [
              state4.version !== "current" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: "Version: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                    color: "claude",
                    children: state4.version
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: "Location: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                    color: "text",
                    children: getInstallationPath2()
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
            marginLeft: 2,
            flexDirection: "column",
            gap: 1,
            children: /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: [
                /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: "Next: Run "
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                  color: "claude",
                  bold: !0,
                  children: "claude --help"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " to get started"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          state4.setupMessages && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(SetupNotes, {
            messages: state4.setupMessages
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      state4.type === "error" && /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(StatusIcon, {
                status: "error",
                withSpace: !0
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
                color: "error",
                children: "Installation failed"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
            color: "error",
            children: state4.message
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime483.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Try running with --force to override checks"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_compiler_runtime380, import_react318, jsx_dev_runtime483, install;
var init_install = __esm(() => {
  init_StatusIcon();
  init_ink2();
  init_debug();
  init_env();
  init_errors();
  init_nativeInstaller();
  init_settings2();
  import_compiler_runtime380 = __toESM(require_react_compiler_runtime_development(), 1), import_react318 = __toESM(require_react_development(), 1), jsx_dev_runtime483 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  install = {
    type: "local-jsx",
    name: "install",
    description: "Install Claude Code native build",
    argumentHint: "[options]",
    async call(onDone, _context, args) {
      let force = args.includes("--force"), target = args.filter((arg) => !arg.startsWith("--"))[0], {
        unmount
      } = await render(/* @__PURE__ */ jsx_dev_runtime483.jsxDEV(Install, {
        onDone: (result, options2) => {
          unmount(), onDone(result, options2);
        },
        force,
        target
      }, void 0, !1, void 0, this));
    }
  };
});
