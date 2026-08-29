// function: checkComObject
function checkComObject(parsed) {
  for (let cmd of getAllCommands2(parsed)) {
    if (cmd.name.toLowerCase() !== "new-object")
      continue;
    if (psExeHasParamAbbreviation(cmd, "-comobject", "-com"))
      return {
        behavior: "ask",
        message: "Command instantiates a COM object which may have execution capabilities"
      };
    let typeName;
    for (let i5 = 0;i5 < cmd.args.length; i5++) {
      let a2 = cmd.args[i5], lower = a2.toLowerCase();
      if (lower.startsWith("-t") && lower.includes(":")) {
        let colonIdx = a2.indexOf(":"), paramPart = lower.slice(0, colonIdx);
        if ("-typename".startsWith(paramPart)) {
          typeName = a2.slice(colonIdx + 1);
          break;
        }
      }
      if (lower.startsWith("-t") && "-typename".startsWith(lower) && cmd.args[i5 + 1] !== void 0) {
        typeName = cmd.args[i5 + 1];
        break;
      }
    }
    if (typeName === void 0) {
      let VALUE_PARAMS = /* @__PURE__ */ new Set(["-argumentlist", "-comobject", "-property"]), SWITCH_PARAMS = /* @__PURE__ */ new Set(["-strict"]);
      for (let i5 = 0;i5 < cmd.args.length; i5++) {
        let a2 = cmd.args[i5];
        if (a2.startsWith("-")) {
          let lower = a2.toLowerCase();
          if (lower.startsWith("-t") && "-typename".startsWith(lower)) {
            i5++;
            continue;
          }
          if (lower.includes(":"))
            continue;
          if (SWITCH_PARAMS.has(lower))
            continue;
          if (VALUE_PARAMS.has(lower)) {
            i5++;
            continue;
          }
          continue;
        }
        typeName = a2;
        break;
      }
    }
    if (typeName !== void 0 && !isClmAllowedType(typeName))
      return {
        behavior: "ask",
        message: `New-Object instantiates .NET type '${typeName}' outside the ConstrainedLanguage allowlist`
      };
  }
  return { behavior: "passthrough" };
}
