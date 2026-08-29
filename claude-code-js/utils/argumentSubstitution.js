// Original: src/utils/argumentSubstitution.ts
function parseArguments2(args) {
  if (!args || !args.trim())
    return [];
  let result = tryParseShellCommand(args, (key2) => `$${key2}`);
  if (!result.success)
    return args.split(/\s+/).filter(Boolean);
  return result.tokens.filter((token) => typeof token === "string");
}
function parseArgumentNames(argumentNames) {
  if (!argumentNames)
    return [];
  let isValidName = (name3) => typeof name3 === "string" && name3.trim() !== "" && !/^\d+$/.test(name3);
  if (Array.isArray(argumentNames))
    return argumentNames.filter(isValidName);
  if (typeof argumentNames === "string")
    return argumentNames.split(/\s+/).filter(isValidName);
  return [];
}
function generateProgressiveArgumentHint(argNames, typedArgs) {
  let remaining = argNames.slice(typedArgs.length);
  if (remaining.length === 0)
    return;
  return remaining.map((name3) => `[${name3}]`).join(" ");
}
function substituteArguments(content, args, appendIfNoPlaceholder = !0, argumentNames = []) {
  if (args === void 0 || args === null)
    return content;
  let parsedArgs = parseArguments2(args), originalContent = content;
  for (let i5 = 0;i5 < argumentNames.length; i5++) {
    let name3 = argumentNames[i5];
    if (!name3)
      continue;
    content = content.replace(new RegExp(`\\$${name3}(?![\\[\\w])`, "g"), parsedArgs[i5] ?? "");
  }
  if (content = content.replace(/\$ARGUMENTS\[(\d+)\]/g, (_, indexStr) => {
    let index = parseInt(indexStr, 10);
    return parsedArgs[index] ?? "";
  }), content = content.replace(/\$(\d+)(?!\w)/g, (_, indexStr) => {
    let index = parseInt(indexStr, 10);
    return parsedArgs[index] ?? "";
  }), content = content.replaceAll("$ARGUMENTS", args), content === originalContent && appendIfNoPlaceholder && args)
    content = content + `

ARGUMENTS: ${args}`;
  return content;
}
var init_argumentSubstitution = __esm(() => {
  init_shellQuote();
});
