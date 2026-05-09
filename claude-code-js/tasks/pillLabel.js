// Original: src/tasks/pillLabel.ts
function getPillLabel(tasks) {
  let n5 = tasks.length;
  if (tasks.every((t2) => t2.type === tasks[0].type))
    switch (tasks[0].type) {
      case "local_bash": {
        let monitors = count2(tasks, (t2) => t2.type === "local_bash" && t2.kind === "monitor"), shells = n5 - monitors, parts = [];
        if (shells > 0)
          parts.push(shells === 1 ? "1 shell" : `${shells} shells`);
        if (monitors > 0)
          parts.push(monitors === 1 ? "1 monitor" : `${monitors} monitors`);
        return parts.join(", ");
      }
      case "in_process_teammate": {
        let teamCount = new Set(tasks.map((t2) => t2.type === "in_process_teammate" ? t2.identity.teamName : "")).size;
        return teamCount === 1 ? "1 team" : `${teamCount} teams`;
      }
      case "local_agent":
        return n5 === 1 ? "1 local agent" : `${n5} local agents`;
      case "remote_agent": {
        let first = tasks[0];
        if (n5 === 1 && first.type === "remote_agent" && first.isUltraplan)
          switch (first.ultraplanPhase) {
            case "plan_ready":
              return `${DIAMOND_FILLED} ultraplan ready`;
            case "needs_input":
              return `${DIAMOND_OPEN} ultraplan needs your input`;
            default:
              return `${DIAMOND_OPEN} ultraplan`;
          }
        return n5 === 1 ? `${DIAMOND_OPEN} 1 cloud session` : `${DIAMOND_OPEN} ${n5} cloud sessions`;
      }
      case "local_workflow":
        return n5 === 1 ? "1 background workflow" : `${n5} background workflows`;
      case "monitor_mcp":
        return n5 === 1 ? "1 monitor" : `${n5} monitors`;
      case "dream":
        return "dreaming";
    }
  return `${n5} background ${n5 === 1 ? "task" : "tasks"}`;
}
function pillNeedsCta(tasks) {
  if (tasks.length !== 1)
    return !1;
  let t2 = tasks[0];
  return t2.type === "remote_agent" && t2.isUltraplan === !0 && t2.ultraplanPhase !== void 0;
}
var init_pillLabel = __esm(() => {
  init_figures2();
});
