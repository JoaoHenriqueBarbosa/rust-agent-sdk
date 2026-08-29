// function: psExeHasParamAbbreviation
function psExeHasParamAbbreviation(cmd, fullParam, minPrefix) {
  if (commandHasArgAbbreviation(cmd, fullParam, minPrefix))
    return !0;
  let normalized = {
    ...cmd,
    args: cmd.args.map((a2) => a2.length > 0 && PS_ALT_PARAM_PREFIXES.has(a2[0]) ? "-" + a2.slice(1) : a2)
  };
  return commandHasArgAbbreviation(normalized, fullParam, minPrefix);
}
