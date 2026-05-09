// function: _temp45
function _temp45(pm_1) {
  if (!hasProgressMessage(pm_1.data))
    return !1;
  let msg = pm_1.data.message;
  if (msg.type === "user" && msg.toolUseResult === void 0)
    return !1;
  return !0;
}
