// function: checkWmiProcessSpawn
function checkWmiProcessSpawn(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (WMI_SPAWN_CMDLETS.has(lower))
      return {
        behavior: "ask",
        message: `${cmd.name} can spawn arbitrary processes via WMI/CIM (Win32_Process Create)`
      };
  }
  return { behavior: "passthrough" };
}
