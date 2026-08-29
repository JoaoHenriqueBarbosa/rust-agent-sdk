// function: renderToolUseTag
function renderToolUseTag(input) {
  let tags = [];
  if (input.model) {
    let mainModel = getMainLoopModel(), agentModel = parseUserSpecifiedModel(input.model);
    if (agentModel !== mainModel)
      tags.push(/* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
        flexWrap: "nowrap",
        marginLeft: 1,
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
          dimColor: !0,
          children: renderModelName(agentModel)
        }, void 0, !1, void 0, this)
      }, "model", !1, void 0, this));
  }
  if (tags.length === 0)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(jsx_dev_runtime116.Fragment, {
    children: tags
  }, void 0, !1, void 0, this);
}
