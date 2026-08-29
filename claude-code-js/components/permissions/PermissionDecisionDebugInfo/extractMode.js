// function: extractMode
function extractMode(updates) {
  if (!updates)
    return;
  let update2 = updates.findLast((u5) => u5.type === "setMode");
  return update2?.type === "setMode" ? update2.mode : void 0;
}
