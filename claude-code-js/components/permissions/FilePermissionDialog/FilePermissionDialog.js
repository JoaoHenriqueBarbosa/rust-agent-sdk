// Original: src/components/permissions/FilePermissionDialog/FilePermissionDialog.tsx
import { relative as relative29 } from "path";
function FilePermissionDialog({
  toolUseConfirm,
  toolUseContext,
  onDone,
  onReject,
  title,
  subtitle,
  question = "Do you want to proceed?",
  content,
  completionType = "tool_use_single",
  path: path26,
  parseInput,
  operationType = "write",
  ideDiffSupport,
  workerBadge,
  languageName: languageNameOverride
}) {
  let languageName = import_react212.useMemo(() => languageNameOverride ?? (path26 ? getLanguageName(path26) : "none"), [languageNameOverride, path26]), unaryEvent = import_react212.useMemo(() => ({
    completion_type: completionType,
    language_name: languageName
  }), [completionType, languageName]);
  usePermissionRequestLogging(toolUseConfirm, unaryEvent);
  let symlinkTarget = import_react212.useMemo(() => {
    if (!path26 || operationType === "read")
      return null;
    let expandedPath = expandPath(path26), fs18 = getFsImplementation(), {
      resolvedPath: resolvedPath5,
      isSymlink
    } = safeResolvePath(fs18, expandedPath);
    if (isSymlink)
      return resolvedPath5;
    return null;
  }, [path26, operationType]), fileDialogResult = useFilePermissionDialog({
    filePath: path26 || "",
    completionType,
    languageName,
    toolUseConfirm,
    onDone,
    onReject,
    parseInput,
    operationType
  }), {
    options: options2,
    acceptFeedback,
    rejectFeedback,
    setFocusedOption,
    handleInputModeToggle,
    focusedOption,
    yesInputMode,
    noInputMode
  } = fileDialogResult, parsedInput = parseInput(toolUseConfirm.input), ideDiffConfig = import_react212.useMemo(() => ideDiffSupport ? ideDiffSupport.getConfig(parseInput(toolUseConfirm.input)) : null, [ideDiffSupport, toolUseConfirm.input]), diffParams = ideDiffConfig ? {
    onChange: (option, input) => {
      let transformedInput = ideDiffSupport.applyChanges(parsedInput, input.edits);
      fileDialogResult.onChange(option, transformedInput);
    },
    toolUseContext,
    filePath: ideDiffConfig.filePath,
    edits: (ideDiffConfig.edits || []).map((e) => ({
      old_string: e.old_string,
      new_string: e.new_string,
      replace_all: e.replace_all || !1
    })),
    editMode: ideDiffConfig.editMode || "single"
  } : {
    onChange: () => {},
    toolUseContext,
    filePath: "",
    edits: [],
    editMode: "single"
  }, {
    closeTabInIDE: closeTabInIDE2,
    showingDiffInIDE,
    ideName
  } = useDiffInIDE(diffParams), onChange = (option_0, feedback2) => {
    closeTabInIDE2?.(), fileDialogResult.onChange(option_0, parsedInput, feedback2?.trim());
  };
  if (showingDiffInIDE && ideDiffConfig && path26)
    return /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ShowInIDEPrompt, {
      onChange: (option_1, _input, feedback_0) => onChange(option_1, feedback_0),
      options: options2,
      filePath: path26,
      input: parsedInput,
      ideName,
      symlinkTarget,
      rejectFeedback,
      acceptFeedback,
      setFocusedOption,
      onInputModeToggle: handleInputModeToggle,
      focusedOption,
      yesInputMode,
      noInputMode
    }, void 0, !1, void 0, this);
  let isSymlinkOutsideCwd = symlinkTarget != null && relative29(getCwd(), symlinkTarget).startsWith(".."), symlinkWarning = symlinkTarget ? /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedBox_default, {
    paddingX: 1,
    marginBottom: 1,
    children: /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedText, {
      color: "warning",
      children: isSymlinkOutsideCwd ? `This will modify ${symlinkTarget} (outside working directory) via a symlink` : `Symlink target: ${symlinkTarget}`
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this) : null;
  return /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(jsx_dev_runtime383.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(PermissionDialog, {
        title,
        subtitle,
        innerPaddingX: 0,
        workerBadge,
        children: [
          symlinkWarning,
          content,
          /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            paddingX: 1,
            children: [
              typeof question === "string" ? /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedText, {
                children: question
              }, void 0, !1, void 0, this) : question,
              /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(Select, {
                options: options2,
                inlineDescriptions: !0,
                onChange: (value) => {
                  let selected = options2.find((opt) => opt.value === value);
                  if (selected) {
                    if (selected.option.type === "reject") {
                      let trimmedFeedback = rejectFeedback.trim();
                      onChange(selected.option, trimmedFeedback || void 0);
                      return;
                    }
                    if (selected.option.type === "accept-once") {
                      let trimmedFeedback_0 = acceptFeedback.trim();
                      onChange(selected.option, trimmedFeedback_0 || void 0);
                      return;
                    }
                    onChange(selected.option);
                  }
                },
                onCancel: () => onChange({
                  type: "reject"
                }),
                onFocus: (value_0) => setFocusedOption(value_0),
                onInputModeToggle: handleInputModeToggle
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedBox_default, {
        paddingX: 1,
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime383.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Esc to cancel",
            (focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) && " \xB7 Tab to amend"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react212, jsx_dev_runtime383;
var init_FilePermissionDialog = __esm(() => {
  init_useDiffInIDE();
  init_ink2();
  init_cliHighlight();
  init_cwd2();
  init_fsOperations();
  init_path2();
  init_CustomSelect();
  init_ShowInIDEPrompt();
  init_hooks6();
  init_PermissionDialog();
  init_useFilePermissionDialog();
  import_react212 = __toESM(require_react_development(), 1), jsx_dev_runtime383 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
