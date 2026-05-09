// Original: src/services/compact/compactWarningState.ts
function suppressCompactWarning() {
  compactWarningStore.setState(() => !0);
}
function clearCompactWarningSuppression() {
  compactWarningStore.setState(() => !1);
}
var compactWarningStore;
var init_compactWarningState = __esm(() => {
  compactWarningStore = createStore(!1);
});
