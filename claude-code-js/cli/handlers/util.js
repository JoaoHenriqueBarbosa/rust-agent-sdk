// Original: src/cli/handlers/util.tsx
var exports_util2 = {};
__export(exports_util2, {
  setupTokenHandler: () => setupTokenHandler,
  installHandler: () => installHandler,
  doctorHandler: () => doctorHandler
});
import { cwd as cwd4 } from "process";
async function setupTokenHandler(root3) {
  logEvent("tengu_setup_token_command", {});
  let showAuthWarning = !isAnthropicAuthEnabled(), {
    ConsoleOAuthFlow: ConsoleOAuthFlow2
  } = await Promise.resolve().then(() => (init_ConsoleOAuthFlow(), exports_ConsoleOAuthFlow));
  await new Promise((resolve47) => {
    root3.render(/* @__PURE__ */ jsx_dev_runtime484.jsxDEV(AppStateProvider, {
      onChangeAppState,
      children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(KeybindingSetup, {
        children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(WelcomeV2, {}, void 0, !1, void 0, this),
            showAuthWarning && /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: [
                /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(ThemedText, {
                  color: "warning",
                  children: "Warning: You already have authentication configured via environment variable or API key helper."
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(ThemedText, {
                  color: "warning",
                  children: "The setup-token command will create a new OAuth token which you can use instead."
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(ConsoleOAuthFlow2, {
              onDone: () => {
                resolve47();
              },
              mode: "setup-token",
              startingMessage: "This will guide you through long-lived (1-year) auth token setup for your Claude account. Claude subscription required."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this));
  }), root3.unmount(), process.exit(0);
}
function DoctorWithPlugins(t0) {
  let $3 = import_compiler_runtime381.c(2), {
    onDone
  } = t0;
  useManagePlugins();
  let t1;
  if ($3[0] !== onDone)
    t1 = /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(import_react319.default.Suspense, {
      fallback: null,
      children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(DoctorLazy, {
        onDone
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = onDone, $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
async function doctorHandler(root3) {
  logEvent("tengu_doctor_command", {}), await new Promise((resolve47) => {
    root3.render(/* @__PURE__ */ jsx_dev_runtime484.jsxDEV(AppStateProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(KeybindingSetup, {
        children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(MCPConnectionManager, {
          dynamicMcpConfig: void 0,
          isStrictMcpConfig: !1,
          children: /* @__PURE__ */ jsx_dev_runtime484.jsxDEV(DoctorWithPlugins, {
            onDone: () => {
              resolve47();
            }
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this));
  }), root3.unmount(), process.exit(0);
}
async function installHandler(target, options2) {
  let {
    setup: setup2
  } = await Promise.resolve().then(() => (init_setup3(), exports_setup));
  await setup2(cwd4(), "default", !1, !1, void 0, !1);
  let {
    install: install2
  } = await Promise.resolve().then(() => (init_install(), exports_install));
  await new Promise((resolve47) => {
    let args = [];
    if (target)
      args.push(target);
    if (options2.force)
      args.push("--force");
    install2.call((result) => {
      resolve47(), process.exit(result.includes("failed") ? 1 : 0);
    }, {}, args);
  });
}
var import_compiler_runtime381, import_react319, jsx_dev_runtime484, DoctorLazy;
var init_util10 = __esm(() => {
  init_WelcomeV2();
  init_useManagePlugins();
  init_ink2();
  init_KeybindingProviderSetup();
  init_MCPConnectionManager();
  init_AppState();
  init_onChangeAppState();
  init_auth14();
  import_compiler_runtime381 = __toESM(require_react_compiler_runtime_development(), 1), import_react319 = __toESM(require_react_development(), 1), jsx_dev_runtime484 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  DoctorLazy = import_react319.default.lazy(() => Promise.resolve().then(() => (init_Doctor(), exports_Doctor)).then((m4) => ({
    default: m4.Doctor
  })));
});
