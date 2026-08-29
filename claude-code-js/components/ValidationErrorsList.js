// Original: src/components/ValidationErrorsList.tsx
function buildNestedTree(errors8) {
  let tree = {};
  return errors8.forEach((error44) => {
    if (!error44.path) {
      tree[""] = error44.message;
      return;
    }
    let pathParts = error44.path.split("."), modifiedPath = error44.path;
    if (error44.invalidValue !== null && error44.invalidValue !== void 0 && pathParts.length > 0) {
      let newPathParts = [];
      for (let i5 = 0;i5 < pathParts.length; i5++) {
        let part = pathParts[i5];
        if (!part)
          continue;
        let numericPart = parseInt(part, 10);
        if (!isNaN(numericPart) && i5 === pathParts.length - 1) {
          let displayValue;
          if (typeof error44.invalidValue === "string")
            displayValue = `"${error44.invalidValue}"`;
          else if (error44.invalidValue === null)
            displayValue = "null";
          else if (error44.invalidValue === void 0)
            displayValue = "undefined";
          else
            displayValue = String(error44.invalidValue);
          newPathParts.push(displayValue);
        } else
          newPathParts.push(part);
      }
      modifiedPath = newPathParts.join(".");
    }
    setWith_default(tree, modifiedPath, error44.message, Object);
  }), tree;
}
function ValidationErrorsList(t0) {
  let $3 = import_compiler_runtime157.c(9), {
    errors: errors8
  } = t0, [themeName] = useTheme();
  if (errors8.length === 0)
    return null;
  let T0, t1, t2;
  if ($3[0] !== errors8 || $3[1] !== themeName) {
    let errorsByFile = errors8.reduce(_temp85, {}), sortedFiles = Object.keys(errorsByFile).sort();
    T0 = ThemedBox_default, t1 = "column", t2 = sortedFiles.map((file_0) => {
      let fileErrors = errorsByFile[file_0] || [];
      fileErrors.sort(_temp228);
      let errorTree = buildNestedTree(fileErrors), suggestionPairs = /* @__PURE__ */ new Map;
      fileErrors.forEach((error_0) => {
        if (error_0.suggestion || error_0.docLink) {
          let key3 = `${error_0.suggestion || ""}|${error_0.docLink || ""}`;
          if (!suggestionPairs.has(key3))
            suggestionPairs.set(key3, {
              suggestion: error_0.suggestion,
              docLink: error_0.docLink
            });
        }
      });
      let treeOutput = treeify(errorTree, {
        showValues: !0,
        themeName,
        treeCharColors: {
          treeChar: "inactive",
          key: "text",
          value: "inactive"
        }
      });
      return /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedText, {
            children: file_0
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedBox_default, {
            marginLeft: 1,
            children: /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedText, {
              dimColor: !0,
              children: treeOutput
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          suggestionPairs.size > 0 && /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginTop: 1,
            children: Array.from(suggestionPairs.values()).map(_temp320)
          }, void 0, !1, void 0, this)
        ]
      }, file_0, !0, void 0, this);
    }), $3[0] = errors8, $3[1] = themeName, $3[2] = T0, $3[3] = t1, $3[4] = t2;
  } else
    T0 = $3[2], t1 = $3[3], t2 = $3[4];
  let t3;
  if ($3[5] !== T0 || $3[6] !== t1 || $3[7] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(T0, {
      flexDirection: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[5] = T0, $3[6] = t1, $3[7] = t2, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
function _temp320(pair, index) {
  return /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginBottom: 1,
    children: [
      pair.suggestion && /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedText, {
        dimColor: !0,
        wrap: "wrap",
        children: pair.suggestion
      }, void 0, !1, void 0, this),
      pair.docLink && /* @__PURE__ */ jsx_dev_runtime197.jsxDEV(ThemedText, {
        dimColor: !0,
        wrap: "wrap",
        children: [
          "Learn more: ",
          pair.docLink
        ]
      }, void 0, !0, void 0, this)
    ]
  }, `suggestion-pair-${index}`, !0, void 0, this);
}
function _temp228(a2, b) {
  if (!a2.path && b.path)
    return -1;
  if (a2.path && !b.path)
    return 1;
  return (a2.path || "").localeCompare(b.path || "");
}
function _temp85(acc, error44) {
  let file2 = error44.file || "(file not specified)";
  if (!acc[file2])
    acc[file2] = [];
  return acc[file2].push(error44), acc;
}
var import_compiler_runtime157, jsx_dev_runtime197;
var init_ValidationErrorsList = __esm(() => {
  init_setWith();
  init_ink2();
  init_treeify();
  import_compiler_runtime157 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime197 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
