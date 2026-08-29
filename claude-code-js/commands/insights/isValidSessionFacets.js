// function: isValidSessionFacets
function isValidSessionFacets(obj) {
  if (!obj || typeof obj !== "object")
    return !1;
  let o5 = obj;
  return typeof o5.underlying_goal === "string" && typeof o5.outcome === "string" && typeof o5.brief_summary === "string" && o5.goal_categories !== null && typeof o5.goal_categories === "object" && o5.user_satisfaction_counts !== null && typeof o5.user_satisfaction_counts === "object" && o5.friction_counts !== null && typeof o5.friction_counts === "object";
}
