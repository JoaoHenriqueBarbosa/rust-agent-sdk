// function: getPlanPhase4Section
function getPlanPhase4Section() {
  let variant = getPewterLedgerVariant();
  switch (variant) {
    case "trim":
      return PLAN_PHASE4_TRIM;
    case "cut":
      return PLAN_PHASE4_CUT;
    case "cap":
      return PLAN_PHASE4_CAP;
    case null:
      return PLAN_PHASE4_CONTROL;
    default:
      return PLAN_PHASE4_CONTROL;
  }
}
