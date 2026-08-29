// function: checkStartProcess
function checkStartProcess(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    let lower = cmd.name.toLowerCase();
    if (lower !== "start-process" && lower !== "saps" && lower !== "start")
      continue;
    if (psExeHasParamAbbreviation(cmd, "-Verb", "-v") && cmd.args.some((a2) => a2.toLowerCase() === "runas"))
      return {
        behavior: "ask",
        message: "Command requests elevated privileges"
      };
    if (cmd.children)
      for (let i5 = 0;i5 < cmd.args.length; i5++) {
        let argClean = cmd.args[i5].replace(/`/g, "");
        if (!/^[-\u2013\u2014\u2015/]v[a-z]*:/i.test(argClean))
          continue;
        let kids = cmd.children[i5];
        if (!kids)
          continue;
        for (let child of kids)
          if (child.text.replace(/['"`\s]/g, "").toLowerCase() === "runas")
            return {
              behavior: "ask",
              message: "Command requests elevated privileges"
            };
      }
    if (cmd.args.some((a2) => {
      let clean = a2.replace(/`/g, "");
      return /^[-\u2013\u2014\u2015/]v[a-z]*:['"` ]*runas['"` ]*$/i.test(clean);
    }))
      return {
        behavior: "ask",
        message: "Command requests elevated privileges"
      };
    for (let arg of cmd.args) {
      let stripped = arg.replace(/^['"]|['"]$/g, "");
      if (isPowerShellExecutable(stripped))
        return {
          behavior: "ask",
          message: "Start-Process launches a nested PowerShell process which cannot be validated"
        };
    }
  }
  return { behavior: "passthrough" };
}
