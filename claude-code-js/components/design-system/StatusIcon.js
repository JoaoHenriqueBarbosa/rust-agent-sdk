// Original: src/components/design-system/StatusIcon.tsx
function StatusIcon(t0) {
  let $3 = import_compiler_runtime146.c(5), {
    status,
    withSpace: t1
  } = t0, withSpace = t1 === void 0 ? !1 : t1, config11 = STATUS_CONFIG[status], t2 = !config11.color, t3 = withSpace && " ", t4;
  if ($3[0] !== config11.color || $3[1] !== config11.icon || $3[2] !== t2 || $3[3] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime184.jsxDEV(ThemedText, {
      color: config11.color,
      dimColor: t2,
      children: [
        config11.icon,
        t3
      ]
    }, void 0, !0, void 0, this), $3[0] = config11.color, $3[1] = config11.icon, $3[2] = t2, $3[3] = t3, $3[4] = t4;
  else
    t4 = $3[4];
  return t4;
}
var import_compiler_runtime146, jsx_dev_runtime184, STATUS_CONFIG;
var init_StatusIcon = __esm(() => {
  init_figures();
  init_ink2();
  import_compiler_runtime146 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime184 = __toESM(require_react_jsx_dev_runtime_development(), 1), STATUS_CONFIG = {
    success: {
      icon: figures_default.tick,
      color: "success"
    },
    error: {
      icon: figures_default.cross,
      color: "error"
    },
    warning: {
      icon: figures_default.warning,
      color: "warning"
    },
    info: {
      icon: figures_default.info,
      color: "suggestion"
    },
    pending: {
      icon: figures_default.circle,
      color: void 0
    },
    loading: {
      icon: "\u2026",
      color: void 0
    }
  };
});
