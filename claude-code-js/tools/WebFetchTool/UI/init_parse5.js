// var: init_parse5
var init_parse5 = __esm(() => {
  init_types21();
  reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/, reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi, actionTypes = /* @__PURE__ */ new Map([
    [126, AttributeAction.Element],
    [94, AttributeAction.Start],
    [36, AttributeAction.End],
    [42, AttributeAction.Any],
    [33, AttributeAction.Not],
    [124, AttributeAction.Hyphen]
  ]), unpackPseudos = /* @__PURE__ */ new Set([
    "has",
    "not",
    "matches",
    "is",
    "where",
    "host",
    "host-context"
  ]);
  stripQuotesFromPseudos = /* @__PURE__ */ new Set(["contains", "icontains"]);
});
