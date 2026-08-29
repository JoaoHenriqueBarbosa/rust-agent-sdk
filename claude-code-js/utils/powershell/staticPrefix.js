// Original: src/utils/powershell/staticPrefix.ts
async function extractPrefixFromElement(cmd) {
  if (cmd.nameType === "application")
    return null;
  let name3 = cmd.name;
  if (!name3)
    return null;
  if (NEVER_SUGGEST.has(name3.toLowerCase()))
    return null;
  if (cmd.nameType === "cmdlet")
    return name3;
  if (cmd.elementTypes?.[0] !== "StringConstant")
    return null;
  for (let i5 = 0;i5 < cmd.args.length; i5++) {
    let t2 = cmd.elementTypes[i5 + 1];
    if (t2 !== "StringConstant" && t2 !== "Parameter")
      return null;
  }
  let nameLower = name3.toLowerCase(), spec = await getCommandSpec(nameLower), prefix = await buildPrefix(name3, cmd.args, spec), argIdx = 0;
  for (let word of prefix.split(" ").slice(1)) {
    if (word.includes("\\"))
      return null;
    while (argIdx < cmd.args.length) {
      let a2 = cmd.args[argIdx];
      if (a2 === word)
        break;
      if (a2.startsWith("-")) {
        if (argIdx++, spec?.options && argIdx < cmd.args.length && cmd.args[argIdx] !== word && !cmd.args[argIdx].startsWith("-")) {
          let flagLower = a2.toLowerCase();
          if (spec.options.find((o5) => Array.isArray(o5.name) ? o5.name.includes(flagLower) : o5.name === flagLower)?.args)
            argIdx++;
        }
        continue;
      }
      return null;
    }
    if (argIdx >= cmd.args.length)
      return null;
    argIdx++;
  }
  if (!prefix.includes(" ") && (spec?.subcommands?.length || DEPTH_RULES[nameLower]))
    return null;
  return prefix;
}
async function getCompoundCommandPrefixesStatic2(command19, excludeSubcommand) {
  let parsed = await parsePowerShellCommandCached(command19);
  if (!parsed.valid)
    return [];
  let commands7 = getAllCommands2(parsed).filter((cmd) => cmd.elementType === "CommandAst");
  if (commands7.length <= 1) {
    let prefix = commands7[0] ? await extractPrefixFromElement(commands7[0]) : null;
    return prefix ? [prefix] : [];
  }
  let prefixes = [];
  for (let cmd of commands7) {
    if (excludeSubcommand?.(cmd))
      continue;
    let prefix = await extractPrefixFromElement(cmd);
    if (prefix)
      prefixes.push(prefix);
  }
  if (prefixes.length === 0)
    return [];
  let groups = /* @__PURE__ */ new Map;
  for (let prefix of prefixes) {
    let key3 = prefix.split(" ")[0].toLowerCase(), group = groups.get(key3);
    if (group)
      group.push(prefix);
    else
      groups.set(key3, [prefix]);
  }
  let collapsed = [];
  for (let [rootLower, group] of groups) {
    let lcp = wordAlignedLCP(group);
    if ((lcp === "" ? 0 : countCharInString(lcp, " ") + 1) <= 1) {
      if ((await getCommandSpec(rootLower))?.subcommands?.length || DEPTH_RULES[rootLower])
        continue;
    }
    collapsed.push(lcp);
  }
  return collapsed;
}
function wordAlignedLCP(strings) {
  if (strings.length === 0)
    return "";
  if (strings.length === 1)
    return strings[0];
  let firstWords = strings[0].split(" "), commonWordCount = firstWords.length;
  for (let i5 = 1;i5 < strings.length; i5++) {
    let words = strings[i5].split(" "), matchCount = 0;
    while (matchCount < commonWordCount && matchCount < words.length && words[matchCount].toLowerCase() === firstWords[matchCount].toLowerCase())
      matchCount++;
    if (commonWordCount = matchCount, commonWordCount === 0)
      break;
  }
  return firstWords.slice(0, commonWordCount).join(" ");
}
var init_staticPrefix = __esm(() => {
  init_registry2();
  init_specPrefix();
  init_dangerousCmdlets();
  init_parser5();
});
