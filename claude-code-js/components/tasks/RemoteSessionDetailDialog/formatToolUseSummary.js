// function: formatToolUseSummary
function formatToolUseSummary(name3, input) {
  if (name3 === EXIT_PLAN_MODE_V2_TOOL_NAME)
    return "Review the plan in Claude Code on the web";
  if (!input || typeof input !== "object")
    return name3;
  if (name3 === ASK_USER_QUESTION_TOOL_NAME && "questions" in input) {
    let qs = input.questions;
    if (Array.isArray(qs) && qs[0] && typeof qs[0] === "object") {
      let q4 = "question" in qs[0] && typeof qs[0].question === "string" && qs[0].question ? qs[0].question : ("header" in qs[0]) && typeof qs[0].header === "string" ? qs[0].header : null;
      if (q4) {
        let oneLine = q4.replace(/\s+/g, " ").trim();
        return `Answer in browser: ${truncateToWidth(oneLine, 50)}`;
      }
    }
  }
  for (let v2 of Object.values(input))
    if (typeof v2 === "string" && v2.trim()) {
      let oneLine = v2.replace(/\s+/g, " ").trim();
      return `${name3} ${truncateToWidth(oneLine, 60)}`;
    }
  return name3;
}
