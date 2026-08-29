// Original: src/utils/classifierApprovals.ts
function getClassifierApproval(toolUseID) {
  return;
}
function getYoloClassifierApproval(toolUseID) {
  return;
}
function clearClassifierChecking(_toolUseID) {
  return;
}
function isClassifierChecking(toolUseID) {
  return CLASSIFIER_CHECKING.has(toolUseID);
}
function deleteClassifierApproval(toolUseID) {
  CLASSIFIER_APPROVALS.delete(toolUseID);
}
function clearClassifierApprovals() {
  CLASSIFIER_APPROVALS.clear(), CLASSIFIER_CHECKING.clear(), classifierChecking.emit();
}
var CLASSIFIER_APPROVALS, CLASSIFIER_CHECKING, classifierChecking, subscribeClassifierChecking;
var init_classifierApprovals = __esm(() => {
  CLASSIFIER_APPROVALS = /* @__PURE__ */ new Map, CLASSIFIER_CHECKING = /* @__PURE__ */ new Set, classifierChecking = createSignal();
  subscribeClassifierChecking = classifierChecking.subscribe;
});
