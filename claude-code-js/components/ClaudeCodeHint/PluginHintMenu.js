// Original: src/components/ClaudeCodeHint/PluginHintMenu.tsx
function PluginHintMenu({
  pluginName,
  pluginDescription,
  marketplaceName,
  sourceCommand,
  onResponse
}) {
  let onResponseRef = React146.useRef(onResponse);
  onResponseRef.current = onResponse, React146.useEffect(() => {
    let timeoutId = setTimeout((ref) => ref.current("no"), AUTO_DISMISS_MS3, onResponseRef);
    return () => clearTimeout(timeoutId);
  }, []);
  function onSelect(value) {
    switch (value) {
      case "yes":
        onResponse("yes");
        break;
      case "disable":
        onResponse("disable");
        break;
      default:
        onResponse("no");
    }
  }
  return /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(PermissionDialog, {
    title: "Plugin Recommendation",
    children: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "The ",
              /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
                bold: !0,
                children: sourceCommand
              }, void 0, !1, void 0, this),
              " command suggests installing a plugin."
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Plugin:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
              children: [
                " ",
                pluginName
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Marketplace:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
              children: [
                " ",
                marketplaceName
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        pluginDescription && /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
            dimColor: !0,
            children: pluginDescription
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
            children: "Would you like to install it?"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(Select, {
            options: [{
              label: /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
                children: [
                  "Yes, install ",
                  /* @__PURE__ */ jsx_dev_runtime448.jsxDEV(ThemedText, {
                    bold: !0,
                    children: pluginName
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              value: "yes"
            }, {
              label: "No",
              value: "no"
            }, {
              label: "No, and don't show plugin installation hints again",
              value: "disable"
            }],
            onChange: onSelect,
            onCancel: () => onResponse("no")
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var React146, jsx_dev_runtime448, AUTO_DISMISS_MS3 = 30000;
var init_PluginHintMenu = __esm(() => {
  init_ink2();
  init_select();
  init_PermissionDialog();
  React146 = __toESM(require_react_development(), 1), jsx_dev_runtime448 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
