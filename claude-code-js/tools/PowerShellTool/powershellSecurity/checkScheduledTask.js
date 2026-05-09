// function: checkScheduledTask
function checkScheduledTask(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (SCHEDULED_TASK_CMDLETS.has(lower))
      return {
        behavior: "ask",
        message: `${cmd.name} creates or modifies a scheduled task (persistence primitive)`
      };
    if (lower === "schtasks" || lower === "schtasks.exe") {
      if (cmd.args.some((a2) => {
        let la = a2.toLowerCase();
        return la === "/create" || la === "/change" || la === "-create" || la === "-change";
      }))
        return {
          behavior: "ask",
          message: "schtasks with create/change modifies scheduled tasks (persistence primitive)"
        };
    }
  }
  return { behavior: "passthrough" };
}
