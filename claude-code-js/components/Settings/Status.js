// Original: src/components/Settings/Status.tsx
function buildPrimarySection() {
  let sessionId = getSessionId(), nameValue = getCurrentSessionTitle(sessionId) ?? /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
    dimColor: !0,
    children: "/rename to add a name"
  }, void 0, !1, void 0, this);
  return [{
    label: "Version",
    value: "2.1.90"
  }, {
    label: "Session name",
    value: nameValue
  }, {
    label: "Session ID",
    value: sessionId
  }, {
    label: "cwd",
    value: getCwd()
  }, ...buildAccountProperties(), ...buildAPIProviderProperties()];
}
function buildSecondarySection({
  mainLoopModel,
  mcp,
  theme,
  context: context6
}) {
  return [{
    label: "Model",
    value: getModelDisplayLabel(mainLoopModel)
  }, ...buildIDEProperties(mcp.clients, context6.options.ideInstallationStatus, theme), ...buildMcpProperties(mcp.clients, theme), ...buildSandboxProperties(), ...buildSettingSourcesProperties()];
}
async function buildDiagnostics() {
  return [...await buildInstallationDiagnostics(), ...await buildInstallationHealthDiagnostics(), ...await buildMemoryDiagnostics()];
}
function PropertyValue(t0) {
  let $3 = import_compiler_runtime134.c(8), {
    value
  } = t0;
  if (Array.isArray(value)) {
    let t1;
    if ($3[0] !== value) {
      let t22;
      if ($3[2] !== value.length)
        t22 = (item, i5) => /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
          children: [
            item,
            i5 < value.length - 1 ? "," : ""
          ]
        }, i5, !0, void 0, this), $3[2] = value.length, $3[3] = t22;
      else
        t22 = $3[3];
      t1 = value.map(t22), $3[0] = value, $3[1] = t1;
    } else
      t1 = $3[1];
    let t2;
    if ($3[4] !== t1)
      t2 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
        flexWrap: "wrap",
        columnGap: 1,
        flexShrink: 99,
        children: t1
      }, void 0, !1, void 0, this), $3[4] = t1, $3[5] = t2;
    else
      t2 = $3[5];
    return t2;
  }
  if (typeof value === "string") {
    let t1;
    if ($3[6] !== value)
      t1 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
        children: value
      }, void 0, !1, void 0, this), $3[6] = value, $3[7] = t1;
    else
      t1 = $3[7];
    return t1;
  }
  return value;
}
function Status2(t0) {
  let $3 = import_compiler_runtime134.c(20), {
    context: context6,
    diagnosticsPromise
  } = t0, mainLoopModel = useAppState(_temp67), mcp = useAppState(_temp216), [theme] = useTheme(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = buildPrimarySection(), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== context6 || $3[2] !== mainLoopModel || $3[3] !== mcp || $3[4] !== theme)
    t2 = buildSecondarySection({
      mainLoopModel,
      mcp,
      theme,
      context: context6
    }), $3[1] = context6, $3[2] = mainLoopModel, $3[3] = mcp, $3[4] = theme, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== t2)
    t3 = [t1, t2], $3[6] = t2, $3[7] = t3;
  else
    t3 = $3[7];
  let sections = t3, grow = useIsInsideModal() ? 1 : void 0, t4;
  if ($3[8] !== sections)
    t4 = sections.map(_temp412), $3[8] = sections, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== diagnosticsPromise)
    t5 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(import_react98.Suspense, {
      fallback: null,
      children: /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(Diagnostics, {
        promise: diagnosticsPromise
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = diagnosticsPromise, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== grow || $3[13] !== t4 || $3[14] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      flexGrow: grow,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[12] = grow, $3[13] = t4, $3[14] = t5, $3[15] = t6;
  else
    t6 = $3[15];
  let t7;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== grow || $3[18] !== t6)
    t8 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      flexGrow: grow,
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[17] = grow, $3[18] = t6, $3[19] = t8;
  else
    t8 = $3[19];
  return t8;
}
function _temp412(properties, i5) {
  return properties.length > 0 && /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: properties.map(_temp313)
  }, i5, !1, void 0, this);
}
function _temp313(t0, j4) {
  let {
    label,
    value
  } = t0;
  return /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    flexShrink: 0,
    children: [
      label !== void 0 && /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
        bold: !0,
        children: [
          label,
          ":"
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(PropertyValue, {
        value
      }, void 0, !1, void 0, this)
    ]
  }, j4, !0, void 0, this);
}
function _temp216(s_0) {
  return s_0.mcp;
}
function _temp67(s2) {
  return s2.mainLoopModel;
}
function Diagnostics(t0) {
  let $3 = import_compiler_runtime134.c(5), {
    promise: promise3
  } = t0, diagnostics = import_react98.use(promise3);
  if (diagnostics.length === 0)
    return null;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
      bold: !0,
      children: "System Diagnostics"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== diagnostics)
    t2 = diagnostics.map(_temp56), $3[1] = diagnostics, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingBottom: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function _temp56(diagnostic, i5) {
  return /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    gap: 1,
    paddingX: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
        color: "error",
        children: figures_default.warning
      }, void 0, !1, void 0, this),
      typeof diagnostic === "string" ? /* @__PURE__ */ jsx_dev_runtime171.jsxDEV(ThemedText, {
        wrap: "wrap",
        children: diagnostic
      }, void 0, !1, void 0, this) : diagnostic
    ]
  }, i5, !0, void 0, this);
}
var import_compiler_runtime134, import_react98, jsx_dev_runtime171;
var init_Status = __esm(() => {
  init_figures();
  init_state();
  init_modalContext();
  init_ink2();
  init_AppState();
  init_cwd2();
  init_sessionStorage();
  init_status();
  init_ConfigurableShortcutHint();
  import_compiler_runtime134 = __toESM(require_react_compiler_runtime_development(), 1), import_react98 = __toESM(require_react_development(), 1), jsx_dev_runtime171 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
