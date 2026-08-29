// Original: src/components/LspRecommendation/LspRecommendationMenu.tsx
function LspRecommendationMenu({
  pluginName,
  pluginDescription,
  fileExtension: fileExtension3,
  onResponse
}) {
  let onResponseRef = React144.useRef(onResponse);
  onResponseRef.current = onResponse, React144.useEffect(() => {
    let timeoutId = setTimeout((ref) => ref.current("no"), AUTO_DISMISS_MS2, onResponseRef);
    return () => clearTimeout(timeoutId);
  }, []);
  function onSelect(value) {
    switch (value) {
      case "yes":
        onResponse("yes");
        break;
      case "no":
        onResponse("no");
        break;
      case "never":
        onResponse("never");
        break;
      case "disable":
        onResponse("disable");
        break;
    }
  }
  return /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(PermissionDialog, {
    title: "LSP Plugin Recommendation",
    children: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "LSP provides code intelligence like go-to-definition and error checking"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Plugin:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
              children: [
                " ",
                pluginName
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        pluginDescription && /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
            dimColor: !0,
            children: pluginDescription
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Triggered by:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
              children: [
                " ",
                fileExtension3,
                " files"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
            children: "Would you like to install this LSP plugin?"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(Select, {
            options: [{
              label: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
                children: [
                  "Yes, install ",
                  /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
                    bold: !0,
                    children: pluginName
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              value: "yes"
            }, {
              label: "No, not now",
              value: "no"
            }, {
              label: /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
                children: [
                  "Never for ",
                  /* @__PURE__ */ jsx_dev_runtime447.jsxDEV(ThemedText, {
                    bold: !0,
                    children: pluginName
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              value: "never"
            }, {
              label: "Disable all LSP recommendations",
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
var React144, jsx_dev_runtime447, AUTO_DISMISS_MS2 = 30000;
var init_LspRecommendationMenu = __esm(() => {
  init_ink2();
  init_select();
  init_PermissionDialog();
  React144 = __toESM(require_react_development(), 1), jsx_dev_runtime447 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
