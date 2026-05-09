// Original: src/utils/bash/prefix.ts
function isKnownSubcommand2(arg, spec) {
  if (!spec?.subcommands?.length)
    return !1;
  return spec.subcommands.some((sub) => Array.isArray(sub.name) ? sub.name.includes(arg) : sub.name === arg);
}
async function getCommandPrefixStatic(command19, recursionDepth = 0, wrapperCount = 0) {
  if (wrapperCount > 2 || recursionDepth > 10)
    return null;
  let parsed = await parseCommand3(command19);
  if (!parsed)
    return null;
  if (!parsed.commandNode)
    return { commandPrefix: null };
  let { envVars, commandNode } = parsed, cmdArgs = extractCommandArguments(commandNode), [cmd, ...args] = cmdArgs;
  if (!cmd)
    return { commandPrefix: null };
  let spec = await getCommandSpec(cmd), isWrapper = WRAPPER_COMMANDS.has(cmd) || spec?.args && toArray4(spec.args).some((arg) => arg?.isCommand);
  if (isWrapper && args[0] && isKnownSubcommand2(args[0], spec))
    isWrapper = !1;
  let prefix = isWrapper ? await handleWrapper(cmd, args, recursionDepth, wrapperCount) : await buildPrefix(cmd, args, spec);
  if (prefix === null && recursionDepth === 0 && isWrapper)
    return null;
  let envPrefix = envVars.length ? `${envVars.join(" ")} ` : "";
  return { commandPrefix: prefix ? envPrefix + prefix : null };
}
async function handleWrapper(command19, args, recursionDepth, wrapperCount) {
  let spec = await getCommandSpec(command19);
  if (spec?.args) {
    let commandArgIndex = toArray4(spec.args).findIndex((arg) => arg?.isCommand);
    if (commandArgIndex !== -1) {
      let parts = [command19];
      for (let i5 = 0;i5 < args.length && i5 <= commandArgIndex; i5++)
        if (i5 === commandArgIndex) {
          let result2 = await getCommandPrefixStatic(args.slice(i5).join(" "), recursionDepth + 1, wrapperCount + 1);
          if (result2?.commandPrefix)
            return parts.push(...result2.commandPrefix.split(" ")), parts.join(" ");
          break;
        } else if (args[i5] && !args[i5].startsWith("-") && !ENV_VAR.test(args[i5]))
          parts.push(args[i5]);
    }
  }
  let wrapped = args.find((arg) => !arg.startsWith("-") && !NUMERIC.test(arg) && !ENV_VAR.test(arg));
  if (!wrapped)
    return command19;
  let result = await getCommandPrefixStatic(args.slice(args.indexOf(wrapped)).join(" "), recursionDepth + 1, wrapperCount + 1);
  return !result?.commandPrefix ? null : `${command19} ${result.commandPrefix}`;
}
async function getCompoundCommandPrefixesStatic(command19, excludeSubcommand) {
  let subcommands = splitCommand_DEPRECATED(command19);
  if (subcommands.length <= 1) {
    let result = await getCommandPrefixStatic(command19);
    return result?.commandPrefix ? [result.commandPrefix] : [];
  }
  let prefixes = [];
  for (let subcmd of subcommands) {
    let trimmed = subcmd.trim();
    if (excludeSubcommand?.(trimmed))
      continue;
    let result = await getCommandPrefixStatic(trimmed);
    if (result?.commandPrefix)
      prefixes.push(result.commandPrefix);
  }
  if (prefixes.length === 0)
    return [];
  let groups = /* @__PURE__ */ new Map;
  for (let prefix of prefixes) {
    let root3 = prefix.split(" ")[0], group = groups.get(root3);
    if (group)
      group.push(prefix);
    else
      groups.set(root3, [prefix]);
  }
  let collapsed = [];
  for (let [, group] of groups)
    collapsed.push(longestCommonPrefix2(group));
  return collapsed;
}
function longestCommonPrefix2(strings) {
  if (strings.length === 0)
    return "";
  if (strings.length === 1)
    return strings[0];
  let words = strings[0].split(" "), commonWords = words.length;
  for (let i5 = 1;i5 < strings.length; i5++) {
    let otherWords = strings[i5].split(" "), shared8 = 0;
    while (shared8 < commonWords && shared8 < otherWords.length && words[shared8] === otherWords[shared8])
      shared8++;
    commonWords = shared8;
  }
  return words.slice(0, Math.max(1, commonWords)).join(" ");
}
var NUMERIC, ENV_VAR, WRAPPER_COMMANDS, toArray4 = (val) => Array.isArray(val) ? val : [val];
var init_prefix2 = __esm(() => {
  init_specPrefix();
  init_commands4();
  init_parser4();
  init_registry2();
  NUMERIC = /^\d+$/, ENV_VAR = /^[A-Za-z_][A-Za-z0-9_]*=/, WRAPPER_COMMANDS = /* @__PURE__ */ new Set([
    "nice"
  ]);
});
