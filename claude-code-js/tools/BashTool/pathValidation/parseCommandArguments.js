// function: parseCommandArguments
function parseCommandArguments(cmd) {
  let parseResult = tryParseShellCommand(cmd, (env5) => `$${env5}`);
  if (!parseResult.success)
    return [];
  let parsed = parseResult.tokens, extractedArgs = [];
  for (let arg of parsed)
    if (typeof arg === "string")
      extractedArgs.push(arg);
    else if (typeof arg === "object" && arg !== null && "op" in arg && arg.op === "glob" && "pattern" in arg)
      extractedArgs.push(String(arg.pattern));
  return extractedArgs;
}
