// Original: src/commands/install-github-app/ChooseRepoStep.tsx
function ChooseRepoStep(t0) {
  let $3 = import_compiler_runtime172.c(49), {
    currentRepo,
    useCurrentRepo,
    repoUrl,
    onRepoUrlChange,
    onSubmit,
    onToggleUseCurrentRepo
  } = t0, [cursorOffset, setCursorOffset] = import_react119.useState(0), [showEmptyError, setShowEmptyError] = import_react119.useState(!1), textInputColumns = useTerminalSize().columns, t1;
  if ($3[0] !== currentRepo || $3[1] !== onSubmit || $3[2] !== repoUrl || $3[3] !== useCurrentRepo)
    t1 = () => {
      if (!(useCurrentRepo ? currentRepo : repoUrl)?.trim()) {
        setShowEmptyError(!0);
        return;
      }
      onSubmit();
    }, $3[0] = currentRepo, $3[1] = onSubmit, $3[2] = repoUrl, $3[3] = useCurrentRepo, $3[4] = t1;
  else
    t1 = $3[4];
  let handleSubmit = t1, isTextInputVisible = !useCurrentRepo || !currentRepo, t2;
  if ($3[5] !== onToggleUseCurrentRepo)
    t2 = () => {
      onToggleUseCurrentRepo(!0), setShowEmptyError(!1);
    }, $3[5] = onToggleUseCurrentRepo, $3[6] = t2;
  else
    t2 = $3[6];
  let handlePrevious = t2, t3;
  if ($3[7] !== onToggleUseCurrentRepo)
    t3 = () => {
      onToggleUseCurrentRepo(!1), setShowEmptyError(!1);
    }, $3[7] = onToggleUseCurrentRepo, $3[8] = t3;
  else
    t3 = $3[8];
  let handleNext = t3, t4;
  if ($3[9] !== handleNext || $3[10] !== handlePrevious || $3[11] !== handleSubmit)
    t4 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext,
      "confirm:yes": handleSubmit
    }, $3[9] = handleNext, $3[10] = handlePrevious, $3[11] = handleSubmit, $3[12] = t4;
  else
    t4 = $3[12];
  let t5 = !isTextInputVisible, t6;
  if ($3[13] !== t5)
    t6 = {
      context: "Confirmation",
      isActive: t5
    }, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  useKeybindings(t4, t6);
  let t7;
  if ($3[15] !== handleNext || $3[16] !== handlePrevious)
    t7 = {
      "confirm:previous": handlePrevious,
      "confirm:next": handleNext
    }, $3[15] = handleNext, $3[16] = handlePrevious, $3[17] = t7;
  else
    t7 = $3[17];
  let t8;
  if ($3[18] !== isTextInputVisible)
    t8 = {
      context: "Confirmation",
      isActive: isTextInputVisible
    }, $3[18] = isTextInputVisible, $3[19] = t8;
  else
    t8 = $3[19];
  useKeybindings(t7, t8);
  let t9;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install GitHub App"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Select GitHub repository"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[20] = t9;
  else
    t9 = $3[20];
  let t10;
  if ($3[21] !== currentRepo || $3[22] !== useCurrentRepo)
    t10 = currentRepo && /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
        bold: useCurrentRepo,
        color: useCurrentRepo ? "permission" : void 0,
        children: [
          useCurrentRepo ? "> " : "  ",
          "Use current repository: ",
          currentRepo
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[21] = currentRepo, $3[22] = useCurrentRepo, $3[23] = t10;
  else
    t10 = $3[23];
  let t11 = !useCurrentRepo || !currentRepo, t12 = !useCurrentRepo || !currentRepo ? "permission" : void 0, t13 = !useCurrentRepo || !currentRepo ? "> " : "  ", t14 = currentRepo ? "Enter a different repository" : "Enter repository", t15;
  if ($3[24] !== t11 || $3[25] !== t12 || $3[26] !== t13 || $3[27] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
        bold: t11,
        color: t12,
        children: [
          t13,
          t14
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[24] = t11, $3[25] = t12, $3[26] = t13, $3[27] = t14, $3[28] = t15;
  else
    t15 = $3[28];
  let t16;
  if ($3[29] !== currentRepo || $3[30] !== cursorOffset || $3[31] !== handleSubmit || $3[32] !== onRepoUrlChange || $3[33] !== repoUrl || $3[34] !== textInputColumns || $3[35] !== useCurrentRepo)
    t16 = (!useCurrentRepo || !currentRepo) && /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      marginLeft: 2,
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(TextInput, {
        value: repoUrl,
        onChange: (value) => {
          onRepoUrlChange(value), setShowEmptyError(!1);
        },
        onSubmit: handleSubmit,
        focus: !0,
        placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo\u2026",
        columns: textInputColumns,
        cursorOffset,
        onChangeCursorOffset: setCursorOffset,
        showCursor: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = currentRepo, $3[30] = cursorOffset, $3[31] = handleSubmit, $3[32] = onRepoUrlChange, $3[33] = repoUrl, $3[34] = textInputColumns, $3[35] = useCurrentRepo, $3[36] = t16;
  else
    t16 = $3[36];
  let t17;
  if ($3[37] !== t10 || $3[38] !== t15 || $3[39] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      paddingX: 1,
      children: [
        t9,
        t10,
        t15,
        t16
      ]
    }, void 0, !0, void 0, this), $3[37] = t10, $3[38] = t15, $3[39] = t16, $3[40] = t17;
  else
    t17 = $3[40];
  let t18;
  if ($3[41] !== showEmptyError)
    t18 = showEmptyError && /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
        color: "error",
        children: "Please enter a repository name to continue"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[41] = showEmptyError, $3[42] = t18;
  else
    t18 = $3[42];
  let t19 = currentRepo ? "\u2191/\u2193 to select \xB7 " : "", t20;
  if ($3[43] !== t19)
    t20 = /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          t19,
          "Enter to continue"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[43] = t19, $3[44] = t20;
  else
    t20 = $3[44];
  let t21;
  if ($3[45] !== t17 || $3[46] !== t18 || $3[47] !== t20)
    t21 = /* @__PURE__ */ jsx_dev_runtime214.jsxDEV(jsx_dev_runtime214.Fragment, {
      children: [
        t17,
        t18,
        t20
      ]
    }, void 0, !0, void 0, this), $3[45] = t17, $3[46] = t18, $3[47] = t20, $3[48] = t21;
  else
    t21 = $3[48];
  return t21;
}
var import_compiler_runtime172, import_react119, jsx_dev_runtime214;
var init_ChooseRepoStep = __esm(() => {
  init_TextInput();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime172 = __toESM(require_react_compiler_runtime_development(), 1), import_react119 = __toESM(require_react_development(), 1), jsx_dev_runtime214 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
