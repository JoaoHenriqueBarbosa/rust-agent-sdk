// Original: src/components/permissions/rules/AddWorkspaceDirectory.tsx
function PermissionDescription() {
  let $3 = import_compiler_runtime127.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on."
    }, void 0, !1, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  return t0;
}
function DirectoryDisplay(t0) {
  let $3 = import_compiler_runtime127.c(5), {
    path: path21
  } = t0, t1;
  if ($3[0] !== path21)
    t1 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedText, {
      color: "permission",
      children: path21
    }, void 0, !1, void 0, this), $3[0] = path21, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(PermissionDescription, {}, void 0, !1, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t1)
    t3 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      gap: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[3] = t1, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function DirectoryInput(t0) {
  let $3 = import_compiler_runtime127.c(14), {
    value,
    onChange,
    onSubmit,
    error: error44,
    suggestions,
    selectedSuggestion
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedText, {
      children: "Enter the path to the directory:"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== onChange || $3[2] !== onSubmit || $3[3] !== value)
    t2 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      borderDimColor: !0,
      borderStyle: "round",
      marginY: 1,
      paddingLeft: 1,
      children: /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(TextInput, {
        showCursor: !0,
        placeholder: `Directory path${figures_default.ellipsis}`,
        value,
        onChange,
        onSubmit,
        columns: 80,
        cursorOffset: value.length,
        onChangeCursorOffset: _temp59
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = onChange, $3[2] = onSubmit, $3[3] = value, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== selectedSuggestion || $3[6] !== suggestions)
    t3 = suggestions.length > 0 && /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(PromptInputFooterSuggestions, {
        suggestions,
        selectedSuggestion
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = selectedSuggestion, $3[6] = suggestions, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== error44)
    t4 = error44 && /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedText, {
      color: "error",
      children: error44
    }, void 0, !1, void 0, this), $3[8] = error44, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== t2 || $3[11] !== t3 || $3[12] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t1,
        t2,
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[10] = t2, $3[11] = t3, $3[12] = t4, $3[13] = t5;
  else
    t5 = $3[13];
  return t5;
}
function _temp59() {}
function AddWorkspaceDirectory(t0) {
  let $3 = import_compiler_runtime127.c(34), {
    onAddDirectory,
    onCancel,
    permissionContext,
    directoryPath
  } = t0, [directoryInput, setDirectoryInput] = import_react90.useState(""), [error44, setError] = import_react90.useState(null), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  let [suggestions, setSuggestions] = import_react90.useState(t1), [selectedSuggestion, setSelectedSuggestion] = import_react90.useState(0), t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = async (path21) => {
      if (!path21) {
        setSuggestions([]), setSelectedSuggestion(0);
        return;
      }
      let completions = await getDirectoryCompletions(path21);
      setSuggestions(completions), setSelectedSuggestion(0);
    }, $3[1] = t2;
  else
    t2 = $3[1];
  let debouncedFetchSuggestions = useDebounceCallback(t2, 100), t3, t4;
  if ($3[2] !== debouncedFetchSuggestions || $3[3] !== directoryInput)
    t3 = () => {
      debouncedFetchSuggestions(directoryInput);
    }, t4 = [directoryInput, debouncedFetchSuggestions], $3[2] = debouncedFetchSuggestions, $3[3] = directoryInput, $3[4] = t3, $3[5] = t4;
  else
    t3 = $3[4], t4 = $3[5];
  import_react90.useEffect(t3, t4);
  let t5;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t5 = (suggestion) => {
      let newPath = suggestion.id + "/";
      setDirectoryInput(newPath), setError(null);
    }, $3[6] = t5;
  else
    t5 = $3[6];
  let applySuggestion = t5, t6;
  if ($3[7] !== onAddDirectory || $3[8] !== permissionContext)
    t6 = async (newPath_0) => {
      let result = await validateDirectoryForWorkspace(newPath_0, permissionContext);
      if (result.resultType === "success")
        onAddDirectory(result.absolutePath, !1);
      else
        setError(addDirHelpMessage(result));
    }, $3[7] = onAddDirectory, $3[8] = permissionContext, $3[9] = t6;
  else
    t6 = $3[9];
  let handleSubmit = t6, t7;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      context: "Settings"
    }, $3[10] = t7;
  else
    t7 = $3[10];
  useKeybinding("confirm:no", onCancel, t7);
  let t8;
  if ($3[11] !== handleSubmit || $3[12] !== selectedSuggestion || $3[13] !== suggestions)
    t8 = (e) => {
      if (suggestions.length > 0) {
        if (e.key === "tab") {
          e.preventDefault();
          let suggestion_0 = suggestions[selectedSuggestion];
          if (suggestion_0)
            applySuggestion(suggestion_0);
          return;
        }
        if (e.key === "return") {
          e.preventDefault();
          let suggestion_1 = suggestions[selectedSuggestion];
          if (suggestion_1)
            handleSubmit(suggestion_1.id + "/");
          return;
        }
        if (e.key === "up" || e.ctrl && e.key === "p") {
          e.preventDefault(), setSelectedSuggestion((prev) => prev <= 0 ? suggestions.length - 1 : prev - 1);
          return;
        }
        if (e.key === "down" || e.ctrl && e.key === "n") {
          e.preventDefault(), setSelectedSuggestion((prev_0) => prev_0 >= suggestions.length - 1 ? 0 : prev_0 + 1);
          return;
        }
      }
    }, $3[11] = handleSubmit, $3[12] = selectedSuggestion, $3[13] = suggestions, $3[14] = t8;
  else
    t8 = $3[14];
  let handleKeyDown = t8, t9;
  if ($3[15] !== directoryPath || $3[16] !== onAddDirectory || $3[17] !== onCancel)
    t9 = (value) => {
      if (!directoryPath)
        return;
      let selectionValue = value;
      bb64:
        switch (selectionValue) {
          case "yes-session": {
            onAddDirectory(directoryPath, !1);
            break bb64;
          }
          case "yes-remember": {
            onAddDirectory(directoryPath, !0);
            break bb64;
          }
          case "no":
            onCancel();
        }
    }, $3[15] = directoryPath, $3[16] = onAddDirectory, $3[17] = onCancel, $3[18] = t9;
  else
    t9 = $3[18];
  let handleSelect = t9, t10 = directoryPath ? void 0 : _temp212, t11;
  if ($3[19] !== directoryInput || $3[20] !== directoryPath || $3[21] !== error44 || $3[22] !== handleSelect || $3[23] !== handleSubmit || $3[24] !== selectedSuggestion || $3[25] !== suggestions)
    t11 = directoryPath ? /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(DirectoryDisplay, {
          path: directoryPath
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(Select, {
          options: REMEMBER_DIRECTORY_OPTIONS,
          onChange: handleSelect,
          onCancel: () => handleSelect("no")
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      marginX: 2,
      children: [
        /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(PermissionDescription, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(DirectoryInput, {
          value: directoryInput,
          onChange: setDirectoryInput,
          onSubmit: handleSubmit,
          error: error44,
          suggestions,
          selectedSuggestion
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[19] = directoryInput, $3[20] = directoryPath, $3[21] = error44, $3[22] = handleSelect, $3[23] = handleSubmit, $3[24] = selectedSuggestion, $3[25] = suggestions, $3[26] = t11;
  else
    t11 = $3[26];
  let t12;
  if ($3[27] !== onCancel || $3[28] !== t10 || $3[29] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(Dialog, {
      title: "Add directory to workspace",
      onCancel,
      color: "permission",
      isCancelActive: !1,
      inputGuide: t10,
      children: t11
    }, void 0, !1, void 0, this), $3[27] = onCancel, $3[28] = t10, $3[29] = t11, $3[30] = t12;
  else
    t12 = $3[30];
  let t13;
  if ($3[31] !== handleKeyDown || $3[32] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: t12
    }, void 0, !1, void 0, this), $3[31] = handleKeyDown, $3[32] = t12, $3[33] = t13;
  else
    t13 = $3[33];
  return t13;
}
function _temp212(exitState) {
  return exitState.pending ? /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ThemedText, {
    children: [
      "Press ",
      exitState.keyName,
      " again to exit"
    ]
  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(Byline, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Tab",
        action: "complete"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "add"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime160.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_compiler_runtime127, import_react90, jsx_dev_runtime160, REMEMBER_DIRECTORY_OPTIONS;
var init_AddWorkspaceDirectory = __esm(() => {
  init_figures();
  init_dist4();
  init_validation3();
  init_TextInput();
  init_ink2();
  init_useKeybinding();
  init_directoryCompletion();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_PromptInputFooterSuggestions();
  import_compiler_runtime127 = __toESM(require_react_compiler_runtime_development(), 1), import_react90 = __toESM(require_react_development(), 1), jsx_dev_runtime160 = __toESM(require_react_jsx_dev_runtime_development(), 1), REMEMBER_DIRECTORY_OPTIONS = [{
    value: "yes-session",
    label: "Yes, for this session"
  }, {
    value: "yes-remember",
    label: "Yes, and remember this directory"
  }, {
    value: "no",
    label: "No"
  }];
});
