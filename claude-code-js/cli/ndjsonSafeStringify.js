// Original: src/cli/ndjsonSafeStringify.ts
function escapeJsLineTerminators(json2) {
  return json2.replace(JS_LINE_TERMINATORS, (c3) => c3 === "\u2028" ? "\\u2028" : "\\u2029");
}
function ndjsonSafeStringify(value) {
  return escapeJsLineTerminators(jsonStringify(value));
}
var JS_LINE_TERMINATORS;
var init_ndjsonSafeStringify = __esm(() => {
  init_slowOperations();
  JS_LINE_TERMINATORS = /\u2028|\u2029/g;
});
