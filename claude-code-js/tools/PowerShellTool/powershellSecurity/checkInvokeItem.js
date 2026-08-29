// function: checkInvokeItem
function checkInvokeItem(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (lower === "invoke-item" || lower === "ii")
      return {
        behavior: "ask",
        message: "Invoke-Item opens files with the default handler (ShellExecute). On executable files this runs arbitrary code."
      };
  }
  return { behavior: "passthrough" };
}
