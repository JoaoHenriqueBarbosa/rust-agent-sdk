// Original: src/ink/terminal-focus-state.ts
function setTerminalFocused(v2) {
  focusState = v2 ? "focused" : "blurred";
  for (let cb of subscribers)
    cb();
  if (!v2) {
    for (let resolve10 of resolvers)
      resolve10();
    resolvers.clear();
  }
}
function getTerminalFocused() {
  return focusState !== "blurred";
}
function getTerminalFocusState() {
  return focusState;
}
function subscribeTerminalFocus(cb) {
  return subscribers.add(cb), () => {
    subscribers.delete(cb);
  };
}
var focusState = "unknown", resolvers, subscribers;
var init_terminal_focus_state = __esm(() => {
  resolvers = /* @__PURE__ */ new Set, subscribers = /* @__PURE__ */ new Set;
});
