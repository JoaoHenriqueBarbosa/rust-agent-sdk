// function: checkModuleLoading
function checkModuleLoading(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (MODULE_LOADING_CMDLETS.has(lower))
      return {
        behavior: "ask",
        message: "Command loads, installs, or downloads a PowerShell module or script, which can execute arbitrary code"
      };
  }
  return { behavior: "passthrough" };
}
