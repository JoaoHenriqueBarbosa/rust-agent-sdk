// function: powershellCommandIsSafe
function powershellCommandIsSafe(_command, parsed) {
  if (!parsed.valid)
    return {
      behavior: "ask",
      message: "Could not parse command for security analysis"
    };
  let validators3 = [
    checkInvokeExpression,
    checkDynamicCommandName,
    checkEncodedCommand,
    checkPwshCommandOrFile,
    checkDownloadCradles,
    checkDownloadUtilities,
    checkAddType,
    checkComObject,
    checkDangerousFilePathExecution,
    checkInvokeItem,
    checkScheduledTask,
    checkForEachMemberName,
    checkStartProcess,
    checkScriptBlockInjection,
    checkSubExpressions,
    checkExpandableStrings,
    checkSplatting,
    checkStopParsing,
    checkMemberInvocations,
    checkTypeLiterals,
    checkEnvVarManipulation,
    checkModuleLoading,
    checkRuntimeStateManipulation,
    checkWmiProcessSpawn
  ];
  for (let validator of validators3) {
    let result = validator(parsed);
    if (result.behavior === "ask")
      return result;
  }
  return { behavior: "passthrough" };
}
