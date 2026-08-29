// Original: src/components/IdeStatusIndicator.tsx
import { basename as basename52 } from "path";
function IdeStatusIndicator(t0) {
  let $3 = import_compiler_runtime316.c(7), {
    ideSelection,
    mcpClients
  } = t0, {
    status: ideStatus
  } = useIdeConnectionStatus(mcpClients), shouldShowIdeSelection = ideStatus === "connected" && (ideSelection?.filePath || ideSelection?.text && ideSelection.lineCount > 0);
  if (ideStatus === null || !shouldShowIdeSelection || !ideSelection)
    return null;
  if (ideSelection.text && ideSelection.lineCount > 0) {
    let t1 = ideSelection.lineCount === 1 ? "line" : "lines", t2;
    if ($3[0] !== ideSelection.lineCount || $3[1] !== t1)
      t2 = /* @__PURE__ */ jsx_dev_runtime407.jsxDEV(ThemedText, {
        color: "ide",
        wrap: "truncate",
        children: [
          "\u29C9 ",
          ideSelection.lineCount,
          " ",
          t1,
          " selected"
        ]
      }, "selection-indicator", !0, void 0, this), $3[0] = ideSelection.lineCount, $3[1] = t1, $3[2] = t2;
    else
      t2 = $3[2];
    return t2;
  }
  if (ideSelection.filePath) {
    let t1;
    if ($3[3] !== ideSelection.filePath)
      t1 = basename52(ideSelection.filePath), $3[3] = ideSelection.filePath, $3[4] = t1;
    else
      t1 = $3[4];
    let t2;
    if ($3[5] !== t1)
      t2 = /* @__PURE__ */ jsx_dev_runtime407.jsxDEV(ThemedText, {
        color: "ide",
        wrap: "truncate",
        children: [
          "\u29C9 In ",
          t1
        ]
      }, "selection-indicator", !0, void 0, this), $3[5] = t1, $3[6] = t2;
    else
      t2 = $3[6];
    return t2;
  }
}
var import_compiler_runtime316, jsx_dev_runtime407;
var init_IdeStatusIndicator = __esm(() => {
  init_useIdeConnectionStatus();
  init_ink2();
  import_compiler_runtime316 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime407 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
