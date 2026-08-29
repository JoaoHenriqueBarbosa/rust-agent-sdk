// Original: src/components/TeleportRepoMismatchDialog.tsx
var exports_TeleportRepoMismatchDialog = {};
__export(exports_TeleportRepoMismatchDialog, {
  TeleportRepoMismatchDialog: () => TeleportRepoMismatchDialog
});
function TeleportRepoMismatchDialog(t0) {
  let $3 = import_compiler_runtime376.c(18), {
    targetRepo,
    initialPaths,
    onSelectPath,
    onCancel
  } = t0, [availablePaths, setAvailablePaths] = import_react314.useState(initialPaths), [errorMessage4, setErrorMessage] = import_react314.useState(null), [validating, setValidating] = import_react314.useState(!1), t1;
  if ($3[0] !== availablePaths || $3[1] !== onCancel || $3[2] !== onSelectPath || $3[3] !== targetRepo)
    t1 = async (value) => {
      if (value === "cancel") {
        onCancel();
        return;
      }
      if (setValidating(!0), setErrorMessage(null), await validateRepoAtPath(value, targetRepo)) {
        onSelectPath(value);
        return;
      }
      removePathFromRepo(targetRepo, value);
      let updatedPaths = availablePaths.filter((p4) => p4 !== value);
      setAvailablePaths(updatedPaths), setValidating(!1), setErrorMessage(`${getDisplayPath(value)} no longer contains the correct repository. Select another path.`);
    }, $3[0] = availablePaths, $3[1] = onCancel, $3[2] = onSelectPath, $3[3] = targetRepo, $3[4] = t1;
  else
    t1 = $3[4];
  let handleChange5 = t1, t2;
  if ($3[5] !== availablePaths) {
    let t32;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t32 = {
        label: "Cancel",
        value: "cancel"
      }, $3[7] = t32;
    else
      t32 = $3[7];
    t2 = [...availablePaths.map(_temp306), t32], $3[5] = availablePaths, $3[6] = t2;
  } else
    t2 = $3[6];
  let options2 = t2, t3;
  if ($3[8] !== availablePaths.length || $3[9] !== errorMessage4 || $3[10] !== handleChange5 || $3[11] !== options2 || $3[12] !== targetRepo || $3[13] !== validating)
    t3 = availablePaths.length > 0 ? /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(jsx_dev_runtime477.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            errorMessage4 && /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
              color: "error",
              children: errorMessage4
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
              children: [
                "Open Claude Code in ",
                /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
                  bold: !0,
                  children: targetRepo
                }, void 0, !1, void 0, this),
                ":"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        validating ? /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
              children: " Validating repository\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(Select, {
          options: options2,
          onChange: (value_0) => void handleChange5(value_0)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        errorMessage4 && /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
          color: "error",
          children: errorMessage4
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Run claude --teleport from a checkout of ",
            targetRepo
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = availablePaths.length, $3[9] = errorMessage4, $3[10] = handleChange5, $3[11] = options2, $3[12] = targetRepo, $3[13] = validating, $3[14] = t3;
  else
    t3 = $3[14];
  let t4;
  if ($3[15] !== onCancel || $3[16] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(Dialog, {
      title: "Teleport to Repo",
      onCancel,
      color: "background",
      children: t3
    }, void 0, !1, void 0, this), $3[15] = onCancel, $3[16] = t3, $3[17] = t4;
  else
    t4 = $3[17];
  return t4;
}
function _temp306(path27) {
  return {
    label: /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
      children: [
        "Use ",
        /* @__PURE__ */ jsx_dev_runtime477.jsxDEV(ThemedText, {
          bold: !0,
          children: getDisplayPath(path27)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    value: path27
  };
}
var import_compiler_runtime376, import_react314, jsx_dev_runtime477;
var init_TeleportRepoMismatchDialog = __esm(() => {
  init_ink2();
  init_file();
  init_githubRepoPathMapping();
  init_CustomSelect();
  init_Dialog();
  init_Spinner2();
  import_compiler_runtime376 = __toESM(require_react_compiler_runtime_development(), 1), import_react314 = __toESM(require_react_development(), 1), jsx_dev_runtime477 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
