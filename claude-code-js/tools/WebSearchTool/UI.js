// Original: src/tools/WebSearchTool/UI.tsx
function getSearchSummary(results) {
  let searchCount = 0, totalResultCount = 0;
  for (let result of results)
    if (result != null && typeof result !== "string")
      searchCount++, totalResultCount += result.content?.length ?? 0;
  return {
    searchCount,
    totalResultCount
  };
}
function renderToolUseMessage17({
  query: query3,
  allowed_domains,
  blocked_domains
}, {
  verbose
}) {
  if (!query3)
    return null;
  let message = "";
  if (query3)
    message += `"${query3}"`;
  if (verbose) {
    if (allowed_domains && allowed_domains.length > 0)
      message += `, only allowing domains: ${allowed_domains.join(", ")}`;
    if (blocked_domains && blocked_domains.length > 0)
      message += `, blocking domains: ${blocked_domains.join(", ")}`;
  }
  return message;
}
function renderToolUseProgressMessage8(progressMessages) {
  if (progressMessages.length === 0)
    return null;
  let lastProgress = progressMessages[progressMessages.length - 1];
  if (!lastProgress?.data)
    return null;
  let data = lastProgress.data;
  switch (data.type) {
    case "query_update":
      return /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Searching: ",
            data.query
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    case "search_results_received":
      return /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Found ",
            data.resultCount,
            ' results for "',
            data.query,
            '"'
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    default:
      return null;
  }
}
function renderToolResultMessage16(output) {
  let {
    searchCount
  } = getSearchSummary(output.results ?? []), timeDisplay = output.durationSeconds >= 1 ? `${Math.round(output.durationSeconds)}s` : `${Math.round(output.durationSeconds * 1000)}ms`;
  return /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(ThemedBox_default, {
    justifyContent: "space-between",
    width: "100%",
    children: /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime142.jsxDEV(ThemedText, {
        children: [
          "Did ",
          searchCount,
          " search",
          searchCount !== 1 ? "es" : "",
          " in ",
          timeDisplay
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function getToolUseSummary7(input) {
  if (!input?.query)
    return null;
  return truncate(input.query, TOOL_SUMMARY_MAX_LENGTH);
}
var jsx_dev_runtime142;
var init_UI16 = __esm(() => {
  init_MessageResponse();
  init_ink2();
  init_format();
  jsx_dev_runtime142 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
