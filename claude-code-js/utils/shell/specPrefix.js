// Original: src/utils/shell/specPrefix.ts
function isKnownSubcommand(arg, spec) {
  if (!spec?.subcommands?.length)
    return !1;
  let argLower = arg.toLowerCase();
  return spec.subcommands.some((sub) => Array.isArray(sub.name) ? sub.name.some((n6) => n6.toLowerCase() === argLower) : sub.name.toLowerCase() === argLower);
}
function flagTakesArg(flag, nextArg, spec) {
  if (spec?.options) {
    let option = spec.options.find((opt) => Array.isArray(opt.name) ? opt.name.includes(flag) : opt.name === flag);
    if (option)
      return !!option.args;
  }
  if (spec?.subcommands?.length && nextArg && !nextArg.startsWith("-"))
    return !isKnownSubcommand(nextArg, spec);
  return !1;
}
function findFirstSubcommand(args, spec) {
  for (let i5 = 0;i5 < args.length; i5++) {
    let arg = args[i5];
    if (!arg)
      continue;
    if (arg.startsWith("-")) {
      if (flagTakesArg(arg, args[i5 + 1], spec))
        i5++;
      continue;
    }
    if (!spec?.subcommands?.length)
      return arg;
    if (isKnownSubcommand(arg, spec))
      return arg;
  }
  return;
}
async function buildPrefix(command19, args, spec) {
  let maxDepth = await calculateDepth(command19, args, spec), parts = [command19], hasSubcommands = !!spec?.subcommands?.length, foundSubcommand = !1;
  for (let i5 = 0;i5 < args.length; i5++) {
    let arg = args[i5];
    if (!arg || parts.length >= maxDepth)
      break;
    if (arg.startsWith("-")) {
      if (arg === "-c" && ["python", "python3"].includes(command19.toLowerCase()))
        break;
      if (spec?.options) {
        let option = spec.options.find((opt) => Array.isArray(opt.name) ? opt.name.includes(arg) : opt.name === arg);
        if (option?.args && toArray3(option.args).some((a2) => a2?.isCommand || a2?.isModule)) {
          parts.push(arg);
          continue;
        }
      }
      if (hasSubcommands && !foundSubcommand) {
        if (flagTakesArg(arg, args[i5 + 1], spec))
          i5++;
        continue;
      }
      break;
    }
    if (await shouldStopAtArg(arg, args.slice(0, i5), spec))
      break;
    if (hasSubcommands && !foundSubcommand)
      foundSubcommand = isKnownSubcommand(arg, spec);
    parts.push(arg);
  }
  return parts.join(" ");
}
async function calculateDepth(command19, args, spec) {
  let firstSubcommand = findFirstSubcommand(args, spec), commandLower = command19.toLowerCase(), key3 = firstSubcommand ? `${commandLower} ${firstSubcommand.toLowerCase()}` : commandLower;
  if (DEPTH_RULES[key3])
    return DEPTH_RULES[key3];
  if (DEPTH_RULES[commandLower])
    return DEPTH_RULES[commandLower];
  if (!spec)
    return 2;
  if (spec.options && args.some((arg) => arg?.startsWith("-")))
    for (let arg of args) {
      if (!arg?.startsWith("-"))
        continue;
      let option = spec.options.find((opt) => Array.isArray(opt.name) ? opt.name.includes(arg) : opt.name === arg);
      if (option?.args && toArray3(option.args).some((arg2) => arg2?.isCommand || arg2?.isModule))
        return 3;
    }
  if (firstSubcommand && spec.subcommands?.length) {
    let firstSubLower = firstSubcommand.toLowerCase(), subcommand = spec.subcommands.find((sub) => Array.isArray(sub.name) ? sub.name.some((n6) => n6.toLowerCase() === firstSubLower) : sub.name.toLowerCase() === firstSubLower);
    if (subcommand) {
      if (subcommand.args) {
        let subArgs = toArray3(subcommand.args);
        if (subArgs.some((arg) => arg?.isCommand))
          return 3;
        if (subArgs.some((arg) => arg?.isVariadic))
          return 2;
      }
      if (subcommand.subcommands?.length)
        return 4;
      if (!subcommand.args)
        return 2;
      return 3;
    }
  }
  if (spec.args) {
    let argsArray = toArray3(spec.args);
    if (argsArray.some((arg) => arg?.isCommand))
      return !Array.isArray(spec.args) && spec.args.isCommand ? 2 : Math.min(2 + argsArray.findIndex((arg) => arg?.isCommand), 3);
    if (!spec.subcommands?.length) {
      if (argsArray.some((arg) => arg?.isVariadic))
        return 1;
      if (argsArray[0] && !argsArray[0].isOptional)
        return 2;
    }
  }
  return spec.args && toArray3(spec.args).some((arg) => arg?.isDangerous) ? 3 : 2;
}
async function shouldStopAtArg(arg, args, spec) {
  if (arg.startsWith("-"))
    return !0;
  let dotIndex = arg.lastIndexOf("."), hasExtension = dotIndex > 0 && dotIndex < arg.length - 1 && !arg.substring(dotIndex + 1).includes(":"), hasFile = arg.includes("/") || hasExtension, hasUrl = URL_PROTOCOLS.some((proto2) => arg.startsWith(proto2));
  if (!hasFile && !hasUrl)
    return !1;
  if (spec?.options && args.length > 0 && args[args.length - 1] === "-m") {
    let option = spec.options.find((opt) => Array.isArray(opt.name) ? opt.name.includes("-m") : opt.name === "-m");
    if (option?.args && toArray3(option.args).some((arg2) => arg2?.isModule))
      return !1;
  }
  return !0;
}
var URL_PROTOCOLS, DEPTH_RULES, toArray3 = (val) => Array.isArray(val) ? val : [val];
var init_specPrefix = __esm(() => {
  URL_PROTOCOLS = ["http://", "https://", "ftp://"], DEPTH_RULES = {
    rg: 2,
    "pre-commit": 2,
    gcloud: 4,
    "gcloud compute": 6,
    "gcloud beta": 6,
    aws: 4,
    az: 4,
    kubectl: 3,
    docker: 3,
    dotnet: 3,
    "git push": 2
  };
});
