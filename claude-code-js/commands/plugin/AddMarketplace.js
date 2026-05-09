// Original: src/commands/plugin/AddMarketplace.tsx
function AddMarketplace({
  inputValue,
  setInputValue,
  cursorOffset,
  setCursorOffset,
  error: error44,
  setError,
  result,
  setResult,
  setViewState,
  onAddComplete,
  cliMode = !1
}) {
  let hasAttemptedAutoAdd = import_react131.useRef(!1), [isLoading, setLoading] = import_react131.useState(!1), [progressMessage, setProgressMessage] = import_react131.useState(""), handleAdd2 = async () => {
    let input = inputValue.trim();
    if (!input) {
      setError("Please enter a marketplace source");
      return;
    }
    let parsed = await parseMarketplaceInput(input);
    if (!parsed) {
      setError("Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
      return;
    }
    if ("error" in parsed) {
      setError(parsed.error);
      return;
    }
    setError(null);
    try {
      setLoading(!0), setProgressMessage("");
      let {
        name: name3,
        resolvedSource
      } = await addMarketplaceSource(parsed, (message) => {
        setProgressMessage(message);
      });
      saveMarketplaceToSettings(name3, {
        source: resolvedSource
      }), clearAllCaches();
      let sourceType = parsed.source;
      if (parsed.source === "github")
        sourceType = parsed.repo;
      if (logEvent("tengu_marketplace_added", {
        source_type: sourceType
      }), onAddComplete)
        await onAddComplete();
      if (setProgressMessage(""), setLoading(!1), cliMode)
        setResult(`Successfully added marketplace: ${name3}`);
      else
        setViewState({
          type: "browse-marketplace",
          targetMarketplace: name3
        });
    } catch (err2) {
      let error45 = toError(err2);
      if (logError2(error45), setError(error45.message), setProgressMessage(""), setLoading(!1), cliMode)
        setResult(`Error: ${error45.message}`);
      else
        setResult(null);
    }
  };
  return import_react131.useEffect(() => {
    if (inputValue && !hasAttemptedAutoAdd.current && !error44 && !result)
      hasAttemptedAutoAdd.current = !0, handleAdd2();
  }, []), /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: "round",
        children: [
          /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
              bold: !0,
              children: "Add Marketplace"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                children: "Enter marketplace source:"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Examples:"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 owner/repo (GitHub)"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 git@github.com:owner/repo.git (SSH)"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 https://example.com/marketplace.json"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 ./path/to/marketplace"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
                marginTop: 1,
                children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(TextInput, {
                  value: inputValue,
                  onChange: setInputValue,
                  onSubmit: handleAdd2,
                  columns: 80,
                  cursorOffset,
                  onChangeCursorOffset: setCursorOffset,
                  focus: !0,
                  showCursor: !0
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          isLoading && /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
                children: progressMessage || "Adding marketplace to configuration\u2026"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          error44 && /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
              color: "error",
              children: error44
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          result && /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
              children: result
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedBox_default, {
        marginLeft: 3,
        children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "add"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime233.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react131, jsx_dev_runtime233;
var init_AddMarketplace = __esm(() => {
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Spinner2();
  init_TextInput();
  init_ink2();
  init_errors();
  init_log3();
  init_cacheUtils();
  init_marketplaceManager();
  init_parseMarketplaceInput();
  import_react131 = __toESM(require_react_development(), 1), jsx_dev_runtime233 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
