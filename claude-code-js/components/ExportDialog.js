// Original: src/components/ExportDialog.tsx
import { join as join128 } from "path";
function ExportDialog({
  content,
  defaultFilename,
  onDone
}) {
  let [, setSelectedOption] = import_react188.useState(null), [filename, setFilename] = import_react188.useState(defaultFilename), [cursorOffset, setCursorOffset] = import_react188.useState(defaultFilename.length), [showFilenameInput, setShowFilenameInput] = import_react188.useState(!1), {
    columns
  } = useTerminalSize(), handleGoBack = import_react188.useCallback(() => {
    setShowFilenameInput(!1), setSelectedOption(null);
  }, []), handleSelectOption = async (value) => {
    if (value === "clipboard") {
      let raw = await setClipboard(content);
      if (raw)
        process.stdout.write(raw);
      onDone({
        success: !0,
        message: "Conversation copied to clipboard"
      });
    } else if (value === "file")
      setSelectedOption("file"), setShowFilenameInput(!0);
  }, handleFilenameSubmit = () => {
    let finalFilename = filename.endsWith(".txt") ? filename : filename.replace(/\.[^.]+$/, "") + ".txt", filepath = join128(getCwd(), finalFilename);
    try {
      writeFileSync_DEPRECATED(filepath, content, {
        encoding: "utf-8",
        flush: !0
      }), onDone({
        success: !0,
        message: `Conversation exported to: ${filepath}`
      });
    } catch (error44) {
      onDone({
        success: !1,
        message: `Failed to export conversation: ${error44 instanceof Error ? error44.message : "Unknown error"}`
      });
    }
  }, handleCancel = import_react188.useCallback(() => {
    if (showFilenameInput)
      handleGoBack();
    else
      onDone({
        success: !1,
        message: "Export cancelled"
      });
  }, [showFilenameInput, handleGoBack, onDone]), options2 = [{
    label: "Copy to clipboard",
    value: "clipboard",
    description: "Copy the conversation to your system clipboard"
  }, {
    label: "Save to file",
    value: "file",
    description: "Save the conversation to a file in the current directory"
  }];
  function renderInputGuide2(exitState) {
    if (showFilenameInput)
      return /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "save"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    if (exitState.pending)
      return /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ThemedText, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ConfigurableShortcutHint, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "cancel"
    }, void 0, !1, void 0, this);
  }
  return useKeybinding("confirm:no", handleCancel, {
    context: "Settings",
    isActive: showFilenameInput
  }), /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(Dialog, {
    title: "Export Conversation",
    subtitle: "Select export method:",
    color: "permission",
    onCancel: handleCancel,
    inputGuide: renderInputGuide2,
    isCancelActive: !showFilenameInput,
    children: !showFilenameInput ? /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(Select, {
      options: options2,
      onChange: handleSelectOption,
      onCancel: handleCancel
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ThemedText, {
          children: "Enter filename:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          gap: 1,
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(ThemedText, {
              children: ">"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime349.jsxDEV(TextInput, {
              value: filename,
              onChange: setFilename,
              onSubmit: handleFilenameSubmit,
              focus: !0,
              showCursor: !0,
              columns,
              cursorOffset,
              onChangeCursorOffset: setCursorOffset
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react188, jsx_dev_runtime349;
var init_ExportDialog = __esm(() => {
  init_useTerminalSize();
  init_osc();
  init_ink2();
  init_useKeybinding();
  init_cwd2();
  init_slowOperations();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_TextInput();
  import_react188 = __toESM(require_react_development(), 1), jsx_dev_runtime349 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
