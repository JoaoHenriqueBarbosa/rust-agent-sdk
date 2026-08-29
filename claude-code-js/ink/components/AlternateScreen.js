// Original: src/ink/components/AlternateScreen.tsx
function AlternateScreen(t0) {
  let $3 = import_compiler_runtime359.c(7), {
    children,
    mouseTracking: t1
  } = t0, mouseTracking = t1 === void 0 ? !0 : t1, size = import_react299.useContext(TerminalSizeContext), writeRaw = import_react299.useContext(TerminalWriteContext), t2, t3;
  if ($3[0] !== mouseTracking || $3[1] !== writeRaw)
    t2 = () => {
      let ink = instances_default.get(process.stdout);
      if (!writeRaw)
        return;
      return writeRaw(ENTER_ALT_SCREEN + "\x1B[2J\x1B[H" + (mouseTracking ? ENABLE_MOUSE_TRACKING : "")), ink?.setAltScreenActive(!0, mouseTracking), () => {
        ink?.setAltScreenActive(!1), ink?.clearTextSelection(), writeRaw((mouseTracking ? DISABLE_MOUSE_TRACKING : "") + EXIT_ALT_SCREEN);
      };
    }, t3 = [writeRaw, mouseTracking], $3[0] = mouseTracking, $3[1] = writeRaw, $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  import_react299.useInsertionEffect(t2, t3);
  let t4 = size?.rows ?? 24, t5;
  if ($3[4] !== children || $3[5] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime457.jsxDEV(Box_default, {
      flexDirection: "column",
      height: t4,
      width: "100%",
      flexShrink: 0,
      children
    }, void 0, !1, void 0, this), $3[4] = children, $3[5] = t4, $3[6] = t5;
  else
    t5 = $3[6];
  return t5;
}
var import_compiler_runtime359, import_react299, jsx_dev_runtime457;
var init_AlternateScreen = __esm(() => {
  init_instances();
  init_dec();
  init_useTerminalNotification();
  init_Box();
  init_TerminalSizeContext();
  import_compiler_runtime359 = __toESM(require_react_compiler_runtime_development(), 1), import_react299 = __toESM(require_react_development(), 1), jsx_dev_runtime457 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
