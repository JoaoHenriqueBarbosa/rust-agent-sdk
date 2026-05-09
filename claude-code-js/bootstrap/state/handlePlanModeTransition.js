// function: handlePlanModeTransition
function handlePlanModeTransition(fromMode, toMode) {
  if (toMode === "plan" && fromMode !== "plan")
    STATE.needsPlanModeExitAttachment = !1;
  if (fromMode === "plan" && toMode !== "plan")
    STATE.needsPlanModeExitAttachment = !0;
}
