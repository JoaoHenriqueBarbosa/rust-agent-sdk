// Original: src/components/messages/UserToolResultMessage/utils.tsx
function useGetToolFromMessages(toolUseID, tools, lookups) {
  let $3 = import_compiler_runtime101.c(7), t0;
  if ($3[0] !== lookups.toolUseByToolUseID || $3[1] !== toolUseID || $3[2] !== tools) {
    bb0: {
      let toolUse = lookups.toolUseByToolUseID.get(toolUseID);
      if (!toolUse) {
        t0 = null;
        break bb0;
      }
      let tool = findToolByName(tools, toolUse.name);
      if (!tool) {
        t0 = null;
        break bb0;
      }
      let t1;
      if ($3[4] !== tool || $3[5] !== toolUse)
        t1 = {
          tool,
          toolUse
        }, $3[4] = tool, $3[5] = toolUse, $3[6] = t1;
      else
        t1 = $3[6];
      t0 = t1;
    }
    $3[0] = lookups.toolUseByToolUseID, $3[1] = toolUseID, $3[2] = tools, $3[3] = t0;
  } else
    t0 = $3[3];
  return t0;
}
var import_compiler_runtime101;
var init_utils11 = __esm(() => {
  init_Tool();
  import_compiler_runtime101 = __toESM(require_react_compiler_runtime_development(), 1);
});
