// Original: src/tools/PowerShellTool/readOnlyValidation.ts
function argLeaksValue(_cmd, element) {
  let argTypes = (element?.elementTypes ?? []).slice(1), args = element?.args ?? [], children = element?.children;
  for (let i5 = 0;i5 < argTypes.length; i5++) {
    if (argTypes[i5] !== "StringConstant" && argTypes[i5] !== "Parameter") {
      if (!/[$(@{[]/.test(args[i5] ?? ""))
        continue;
      return !0;
    }
    if (argTypes[i5] === "Parameter") {
      let paramChildren = children?.[i5];
      if (paramChildren) {
        if (paramChildren.some((c3) => c3.type !== "StringConstant"))
          return !0;
      } else {
        let arg = args[i5] ?? "", colonIdx = arg.indexOf(":");
        if (colonIdx > 0 && /[$(@{[]/.test(arg.slice(colonIdx + 1)))
          return !0;
      }
    }
  }
  return !1;
}
function resolveToCanonical(name3) {
  let lower = name3.toLowerCase();
  if (!lower.includes("\\") && !lower.includes("/"))
    lower = lower.replace(WINDOWS_PATHEXT, "");
  let alias = COMMON_ALIASES[lower];
  if (alias)
    return alias.toLowerCase();
  return lower;
}
function isCwdChangingCmdlet(name3) {
  let canonical = resolveToCanonical(name3);
  return canonical === "set-location" || canonical === "push-location" || canonical === "pop-location" || canonical === "new-psdrive" || getPlatform() === "windows" && (canonical === "ndr" || canonical === "mount");
}
function isSafeOutputCommand(name3) {
  let canonical = resolveToCanonical(name3);
  return SAFE_OUTPUT_CMDLETS.has(canonical);
}
function isAllowlistedPipelineTail(cmd, originalCommand) {
  let canonical = resolveToCanonical(cmd.name);
  if (!PIPELINE_TAIL_CMDLETS.has(canonical))
    return !1;
  return isAllowlistedCommand(cmd, originalCommand);
}
function isProvablySafeStatement(stmt) {
  if (stmt.statementType !== "PipelineAst")
    return !1;
  if (stmt.commands.length === 0)
    return !1;
  for (let cmd of stmt.commands)
    if (cmd.elementType !== "CommandAst")
      return !1;
  return !0;
}
function lookupAllowlist(name3) {
  let lower = name3.toLowerCase(), direct = CMDLET_ALLOWLIST[lower];
  if (direct)
    return direct;
  let canonical = resolveToCanonical(lower);
  if (canonical !== lower)
    return CMDLET_ALLOWLIST[canonical];
  return;
}
function hasSyncSecurityConcerns(command12) {
  let trimmed = command12.trim();
  if (!trimmed)
    return !1;
  if (/\$\(/.test(trimmed))
    return !0;
  if (/(?:^|[^\w.])@\w+/.test(trimmed))
    return !0;
  if (/\.\w+\s*\(/.test(trimmed))
    return !0;
  if (/\$\w+\s*[+\-*/]?=/.test(trimmed))
    return !0;
  if (/--%/.test(trimmed))
    return !0;
  if (/\\\\/.test(trimmed) || /(?<!:)\/\//.test(trimmed))
    return !0;
  if (/::/.test(trimmed))
    return !0;
  return !1;
}
function isReadOnlyCommand(command12, parsed) {
  if (!command12.trim())
    return !1;
  if (!parsed)
    return !1;
  if (!parsed.valid)
    return !1;
  let security = deriveSecurityFlags(parsed);
  if (security.hasScriptBlocks || security.hasSubExpressions || security.hasExpandableStrings || security.hasSplatting || security.hasMemberInvocations || security.hasAssignments || security.hasStopParsing)
    return !1;
  let segments = getPipelineSegments(parsed);
  if (segments.length === 0)
    return !1;
  if (segments.reduce((sum, seg) => sum + seg.commands.length, 0) > 1) {
    if (segments.some((seg) => seg.commands.some((cmd) => isCwdChangingCmdlet(cmd.name))))
      return !1;
  }
  for (let pipeline3 of segments) {
    if (!pipeline3 || pipeline3.commands.length === 0)
      return !1;
    if (pipeline3.redirections.length > 0) {
      if (pipeline3.redirections.some((r4) => !r4.isMerging && !isNullRedirectionTarget(r4.target)))
        return !1;
    }
    let firstCmd = pipeline3.commands[0];
    if (!firstCmd)
      return !1;
    if (!isAllowlistedCommand(firstCmd, command12))
      return !1;
    for (let i5 = 1;i5 < pipeline3.commands.length; i5++) {
      let cmd = pipeline3.commands[i5];
      if (!cmd || cmd.nameType === "application")
        return !1;
      if (isSafeOutputCommand(cmd.name) && cmd.args.length === 0)
        continue;
      if (!isAllowlistedCommand(cmd, command12))
        return !1;
    }
    if (pipeline3.nestedCommands && pipeline3.nestedCommands.length > 0)
      return !1;
  }
  return !0;
}
function isAllowlistedCommand(cmd, originalCommand) {
  if (cmd.nameType === "application") {
    let rawFirstToken = cmd.text.split(/\s/, 1)[0]?.toLowerCase() ?? "";
    if (!SAFE_EXTERNAL_EXES.has(rawFirstToken))
      return !1;
  }
  let config10 = lookupAllowlist(cmd.name);
  if (!config10)
    return !1;
  if (config10.regex && !config10.regex.test(originalCommand))
    return !1;
  if (config10.additionalCommandIsDangerousCallback?.(originalCommand, cmd))
    return !1;
  if (!cmd.elementTypes)
    return !1;
  for (let i5 = 1;i5 < cmd.elementTypes.length; i5++) {
    let t2 = cmd.elementTypes[i5];
    if (t2 !== "StringConstant" && t2 !== "Parameter") {
      if (!/[$(@{[]/.test(cmd.args[i5 - 1] ?? ""))
        continue;
      return !1;
    }
    if (t2 === "Parameter") {
      let paramChildren = cmd.children?.[i5 - 1];
      if (paramChildren) {
        if (paramChildren.some((c3) => c3.type !== "StringConstant"))
          return !1;
      } else {
        let arg = cmd.args[i5 - 1] ?? "", colonIdx = arg.indexOf(":");
        if (colonIdx > 0 && /[$(@{[]/.test(arg.slice(colonIdx + 1)))
          return !1;
      }
    }
  }
  let canonical = resolveToCanonical(cmd.name);
  if (canonical === "git" || canonical === "gh" || canonical === "docker" || canonical === "dotnet")
    return isExternalCommandSafe(canonical, cmd.args);
  let isCmdlet = canonical.includes("-");
  if (config10.allowAllFlags)
    return !0;
  if (!config10.safeFlags || config10.safeFlags.length === 0)
    return !cmd.args.some((arg, i5) => {
      if (isCmdlet)
        return isPowerShellParameter(arg, cmd.elementTypes?.[i5 + 1]);
      return arg.startsWith("-") || process.platform === "win32" && arg.startsWith("/");
    });
  for (let i5 = 0;i5 < cmd.args.length; i5++) {
    let arg = cmd.args[i5];
    if (isCmdlet ? isPowerShellParameter(arg, cmd.elementTypes?.[i5 + 1]) : arg.startsWith("-") || process.platform === "win32" && arg.startsWith("/")) {
      let paramName = isCmdlet ? "-" + arg.slice(1) : arg, colonIndex = paramName.indexOf(":");
      if (colonIndex > 0)
        paramName = paramName.substring(0, colonIndex);
      let paramLower = paramName.toLowerCase();
      if (isCmdlet && COMMON_PARAMETERS.has(paramLower))
        continue;
      if (!config10.safeFlags.some((flag) => flag.toLowerCase() === paramLower))
        return !1;
    }
  }
  return !0;
}
function isExternalCommandSafe(command12, args) {
  switch (command12) {
    case "git":
      return isGitSafe(args);
    case "gh":
      return isGhSafe(args);
    case "docker":
      return isDockerSafe(args);
    case "dotnet":
      return isDotnetSafe(args);
    default:
      return !1;
  }
}
function isGitSafe(args) {
  if (args.length === 0)
    return !0;
  for (let arg of args)
    if (arg.includes("$"))
      return !1;
  let idx = 0;
  while (idx < args.length) {
    let arg = args[idx];
    if (!arg || !arg.startsWith("-"))
      break;
    for (let shortFlag of DANGEROUS_GIT_SHORT_FLAGS_ATTACHED)
      if (arg.length > shortFlag.length && arg.startsWith(shortFlag) && (shortFlag === "-C" || arg[shortFlag.length] !== "-"))
        return !1;
    let hasInlineValue = arg.includes("="), flagName = hasInlineValue ? arg.split("=")[0] || "" : arg;
    if (DANGEROUS_GIT_GLOBAL_FLAGS.has(flagName))
      return !1;
    if (!hasInlineValue && GIT_GLOBAL_FLAGS_WITH_VALUES.has(flagName))
      idx += 2;
    else
      idx++;
  }
  if (idx >= args.length)
    return !0;
  let first = args[idx]?.toLowerCase() || "", second = idx + 1 < args.length ? args[idx + 1]?.toLowerCase() || "" : "", twoWordKey = `git ${first} ${second}`, oneWordKey = `git ${first}`, config10 = GIT_READ_ONLY_COMMANDS[twoWordKey], subcommandTokens = 2;
  if (!config10)
    config10 = GIT_READ_ONLY_COMMANDS[oneWordKey], subcommandTokens = 1;
  if (!config10)
    return !1;
  let flagArgs = args.slice(idx + subcommandTokens);
  if (first === "ls-remote") {
    for (let arg of flagArgs)
      if (!arg.startsWith("-")) {
        if (arg.includes("://") || arg.includes("@") || arg.includes(":") || arg.includes("$"))
          return !1;
      }
  }
  if (config10.additionalCommandIsDangerousCallback && config10.additionalCommandIsDangerousCallback("", flagArgs))
    return !1;
  return validateFlags(flagArgs, 0, config10, { commandName: "git" });
}
function isGhSafe(args) {
  return !1;
}
function isDockerSafe(args) {
  if (args.length === 0)
    return !0;
  for (let arg of args)
    if (arg.includes("$"))
      return !1;
  let oneWordKey = `docker ${args[0]?.toLowerCase()}`;
  if (EXTERNAL_READONLY_COMMANDS.includes(oneWordKey))
    return !0;
  let config10 = DOCKER_READ_ONLY_COMMANDS[oneWordKey];
  if (!config10)
    return !1;
  let flagArgs = args.slice(1);
  if (config10.additionalCommandIsDangerousCallback && config10.additionalCommandIsDangerousCallback("", flagArgs))
    return !1;
  return validateFlags(flagArgs, 0, config10);
}
function isDotnetSafe(args) {
  if (args.length === 0)
    return !1;
  for (let arg of args)
    if (!DOTNET_READ_ONLY_FLAGS.has(arg.toLowerCase()))
      return !1;
  return !0;
}
var DOTNET_READ_ONLY_FLAGS, CMDLET_ALLOWLIST, SAFE_OUTPUT_CMDLETS, PIPELINE_TAIL_CMDLETS, SAFE_EXTERNAL_EXES, WINDOWS_PATHEXT, DANGEROUS_GIT_GLOBAL_FLAGS, GIT_GLOBAL_FLAGS_WITH_VALUES, DANGEROUS_GIT_SHORT_FLAGS_ATTACHED;
var init_readOnlyValidation2 = __esm(() => {
  init_platform();
  init_parser5();
  init_readOnlyCommandValidation();
  init_commonParameters();
  DOTNET_READ_ONLY_FLAGS = /* @__PURE__ */ new Set([
    "--version",
    "--info",
    "--list-runtimes",
    "--list-sdks"
  ]);
  CMDLET_ALLOWLIST = Object.assign(Object.create(null), {
    "get-childitem": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-Filter",
        "-Include",
        "-Exclude",
        "-Recurse",
        "-Depth",
        "-Name",
        "-Force",
        "-Attributes",
        "-Directory",
        "-File",
        "-Hidden",
        "-ReadOnly",
        "-System"
      ]
    },
    "get-content": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-TotalCount",
        "-Head",
        "-Tail",
        "-Raw",
        "-Encoding",
        "-Delimiter",
        "-ReadCount"
      ]
    },
    "get-item": {
      safeFlags: ["-Path", "-LiteralPath", "-Force", "-Stream"]
    },
    "get-itemproperty": {
      safeFlags: ["-Path", "-LiteralPath", "-Name"]
    },
    "test-path": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-PathType",
        "-Filter",
        "-Include",
        "-Exclude",
        "-IsValid",
        "-NewerThan",
        "-OlderThan"
      ]
    },
    "resolve-path": {
      safeFlags: ["-Path", "-LiteralPath", "-Relative"]
    },
    "get-filehash": {
      safeFlags: ["-Path", "-LiteralPath", "-Algorithm", "-InputStream"]
    },
    "get-acl": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-Audit",
        "-Filter",
        "-Include",
        "-Exclude"
      ]
    },
    "set-location": {
      safeFlags: ["-Path", "-LiteralPath", "-PassThru", "-StackName"]
    },
    "push-location": {
      safeFlags: ["-Path", "-LiteralPath", "-PassThru", "-StackName"]
    },
    "pop-location": {
      safeFlags: ["-PassThru", "-StackName"]
    },
    "select-string": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-Pattern",
        "-InputObject",
        "-SimpleMatch",
        "-CaseSensitive",
        "-Quiet",
        "-List",
        "-NotMatch",
        "-AllMatches",
        "-Encoding",
        "-Context",
        "-Raw",
        "-NoEmphasis"
      ]
    },
    "convertto-json": {
      safeFlags: [
        "-InputObject",
        "-Depth",
        "-Compress",
        "-EnumsAsStrings",
        "-AsArray"
      ]
    },
    "convertfrom-json": {
      safeFlags: ["-InputObject", "-Depth", "-AsHashtable", "-NoEnumerate"]
    },
    "convertto-csv": {
      safeFlags: [
        "-InputObject",
        "-Delimiter",
        "-NoTypeInformation",
        "-NoHeader",
        "-UseQuotes"
      ]
    },
    "convertfrom-csv": {
      safeFlags: ["-InputObject", "-Delimiter", "-Header", "-UseCulture"]
    },
    "convertto-xml": {
      safeFlags: ["-InputObject", "-Depth", "-As", "-NoTypeInformation"]
    },
    "convertto-html": {
      safeFlags: [
        "-InputObject",
        "-Property",
        "-Head",
        "-Title",
        "-Body",
        "-Pre",
        "-Post",
        "-As",
        "-Fragment"
      ]
    },
    "format-hex": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-InputObject",
        "-Encoding",
        "-Count",
        "-Offset"
      ]
    },
    "get-member": {
      safeFlags: [
        "-InputObject",
        "-MemberType",
        "-Name",
        "-Static",
        "-View",
        "-Force"
      ]
    },
    "get-unique": {
      safeFlags: ["-InputObject", "-AsString", "-CaseInsensitive", "-OnType"]
    },
    "compare-object": {
      safeFlags: [
        "-ReferenceObject",
        "-DifferenceObject",
        "-Property",
        "-SyncWindow",
        "-CaseSensitive",
        "-Culture",
        "-ExcludeDifferent",
        "-IncludeEqual",
        "-PassThru"
      ]
    },
    "join-string": {
      safeFlags: [
        "-InputObject",
        "-Property",
        "-Separator",
        "-OutputPrefix",
        "-OutputSuffix",
        "-SingleQuote",
        "-DoubleQuote",
        "-FormatString"
      ]
    },
    "get-random": {
      safeFlags: [
        "-InputObject",
        "-Minimum",
        "-Maximum",
        "-Count",
        "-SetSeed",
        "-Shuffle"
      ]
    },
    "convert-path": {
      safeFlags: ["-Path", "-LiteralPath"]
    },
    "join-path": {
      safeFlags: ["-Path", "-ChildPath", "-AdditionalChildPath"]
    },
    "split-path": {
      safeFlags: [
        "-Path",
        "-LiteralPath",
        "-Qualifier",
        "-NoQualifier",
        "-Parent",
        "-Leaf",
        "-LeafBase",
        "-Extension",
        "-IsAbsolute"
      ]
    },
    "get-hotfix": {
      safeFlags: ["-Id", "-Description"]
    },
    "get-itempropertyvalue": {
      safeFlags: ["-Path", "-LiteralPath", "-Name"]
    },
    "get-psprovider": {
      safeFlags: ["-PSProvider"]
    },
    "get-process": {
      safeFlags: [
        "-Name",
        "-Id",
        "-Module",
        "-FileVersionInfo",
        "-IncludeUserName"
      ]
    },
    "get-service": {
      safeFlags: [
        "-Name",
        "-DisplayName",
        "-DependentServices",
        "-RequiredServices",
        "-Include",
        "-Exclude"
      ]
    },
    "get-computerinfo": {
      allowAllFlags: !0
    },
    "get-host": {
      allowAllFlags: !0
    },
    "get-date": {
      safeFlags: ["-Date", "-Format", "-UFormat", "-DisplayHint", "-AsUTC"]
    },
    "get-location": {
      safeFlags: ["-PSProvider", "-PSDrive", "-Stack", "-StackName"]
    },
    "get-psdrive": {
      safeFlags: ["-Name", "-PSProvider", "-Scope"]
    },
    "get-module": {
      safeFlags: [
        "-Name",
        "-ListAvailable",
        "-All",
        "-FullyQualifiedName",
        "-PSEdition"
      ]
    },
    "get-alias": {
      safeFlags: ["-Name", "-Definition", "-Scope", "-Exclude"]
    },
    "get-history": {
      safeFlags: ["-Id", "-Count"]
    },
    "get-culture": {
      allowAllFlags: !0
    },
    "get-uiculture": {
      allowAllFlags: !0
    },
    "get-timezone": {
      safeFlags: ["-Name", "-Id", "-ListAvailable"]
    },
    "get-uptime": {
      allowAllFlags: !0
    },
    "write-output": {
      safeFlags: ["-InputObject", "-NoEnumerate"],
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "write-host": {
      safeFlags: [
        "-Object",
        "-NoNewline",
        "-Separator",
        "-ForegroundColor",
        "-BackgroundColor"
      ],
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "start-sleep": {
      safeFlags: ["-Seconds", "-Milliseconds", "-Duration"],
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "format-table": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "format-list": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "format-wide": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "format-custom": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "measure-object": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "select-object": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "sort-object": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "group-object": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "where-object": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "out-string": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "out-host": {
      allowAllFlags: !0,
      additionalCommandIsDangerousCallback: argLeaksValue
    },
    "get-netadapter": {
      safeFlags: [
        "-Name",
        "-InterfaceDescription",
        "-InterfaceIndex",
        "-Physical"
      ]
    },
    "get-netipaddress": {
      safeFlags: [
        "-InterfaceIndex",
        "-InterfaceAlias",
        "-AddressFamily",
        "-Type"
      ]
    },
    "get-netipconfiguration": {
      safeFlags: ["-InterfaceIndex", "-InterfaceAlias", "-Detailed", "-All"]
    },
    "get-netroute": {
      safeFlags: [
        "-InterfaceIndex",
        "-InterfaceAlias",
        "-AddressFamily",
        "-DestinationPrefix"
      ]
    },
    "get-dnsclientcache": {
      safeFlags: ["-Entry", "-Name", "-Type", "-Status", "-Section", "-Data"]
    },
    "get-dnsclient": {
      safeFlags: ["-InterfaceIndex", "-InterfaceAlias"]
    },
    "get-eventlog": {
      safeFlags: [
        "-LogName",
        "-Newest",
        "-After",
        "-Before",
        "-EntryType",
        "-Index",
        "-InstanceId",
        "-Message",
        "-Source",
        "-UserName",
        "-AsBaseObject",
        "-List"
      ]
    },
    "get-winevent": {
      safeFlags: [
        "-LogName",
        "-ListLog",
        "-ListProvider",
        "-ProviderName",
        "-Path",
        "-MaxEvents",
        "-FilterXPath",
        "-Force",
        "-Oldest"
      ]
    },
    "get-cimclass": {
      safeFlags: [
        "-ClassName",
        "-Namespace",
        "-MethodName",
        "-PropertyName",
        "-QualifierName"
      ]
    },
    git: {},
    gh: {},
    docker: {},
    ipconfig: {
      safeFlags: ["/all", "/displaydns", "/allcompartments"],
      additionalCommandIsDangerousCallback: (_cmd, element) => {
        return (element?.args ?? []).some((a2) => !a2.startsWith("/") && !a2.startsWith("-"));
      }
    },
    netstat: {
      safeFlags: [
        "-a",
        "-b",
        "-e",
        "-f",
        "-n",
        "-o",
        "-p",
        "-q",
        "-r",
        "-s",
        "-t",
        "-x",
        "-y"
      ]
    },
    systeminfo: {
      safeFlags: ["/FO", "/NH"]
    },
    tasklist: {
      safeFlags: ["/M", "/SVC", "/V", "/FI", "/FO", "/NH"]
    },
    "where.exe": {
      allowAllFlags: !0
    },
    hostname: {
      safeFlags: ["-a", "-d", "-f", "-i", "-I", "-s", "-y", "-A"],
      additionalCommandIsDangerousCallback: (_cmd, element) => {
        return (element?.args ?? []).some((a2) => !a2.startsWith("-"));
      }
    },
    whoami: {
      safeFlags: [
        "/user",
        "/groups",
        "/claims",
        "/priv",
        "/logonid",
        "/all",
        "/fo",
        "/nh"
      ]
    },
    ver: {
      allowAllFlags: !0
    },
    arp: {
      safeFlags: ["-a", "-g", "-v", "-N"]
    },
    route: {
      safeFlags: ["print", "PRINT", "-4", "-6"],
      additionalCommandIsDangerousCallback: (_cmd, element) => {
        if (!element)
          return !0;
        return element.args.find((a2) => !a2.startsWith("-"))?.toLowerCase() !== "print";
      }
    },
    getmac: {
      safeFlags: ["/FO", "/NH", "/V"]
    },
    file: {
      safeFlags: [
        "-b",
        "--brief",
        "-i",
        "--mime",
        "-L",
        "--dereference",
        "--mime-type",
        "--mime-encoding",
        "-z",
        "--uncompress",
        "-p",
        "--preserve-date",
        "-k",
        "--keep-going",
        "-r",
        "--raw",
        "-v",
        "--version",
        "-0",
        "--print0",
        "-s",
        "--special-files",
        "-l",
        "-F",
        "--separator",
        "-e",
        "-P",
        "-N",
        "--no-pad",
        "-E",
        "--extension"
      ]
    },
    tree: {
      safeFlags: ["/F", "/A", "/Q", "/L"]
    },
    findstr: {
      safeFlags: [
        "/B",
        "/E",
        "/L",
        "/R",
        "/S",
        "/I",
        "/X",
        "/V",
        "/N",
        "/M",
        "/O",
        "/P",
        "/C",
        "/G",
        "/D",
        "/A"
      ]
    },
    dotnet: {}
  }), SAFE_OUTPUT_CMDLETS = /* @__PURE__ */ new Set([
    "out-null"
  ]), PIPELINE_TAIL_CMDLETS = /* @__PURE__ */ new Set([
    "format-table",
    "format-list",
    "format-wide",
    "format-custom",
    "measure-object",
    "select-object",
    "sort-object",
    "group-object",
    "where-object",
    "out-string",
    "out-host"
  ]), SAFE_EXTERNAL_EXES = /* @__PURE__ */ new Set(["where.exe"]), WINDOWS_PATHEXT = /\.(exe|cmd|bat|com)$/;
  DANGEROUS_GIT_GLOBAL_FLAGS = /* @__PURE__ */ new Set([
    "-c",
    "-C",
    "--exec-path",
    "--config-env",
    "--git-dir",
    "--work-tree",
    "--attr-source"
  ]), GIT_GLOBAL_FLAGS_WITH_VALUES = /* @__PURE__ */ new Set([
    "-c",
    "-C",
    "--exec-path",
    "--config-env",
    "--git-dir",
    "--work-tree",
    "--namespace",
    "--super-prefix",
    "--shallow-file"
  ]), DANGEROUS_GIT_SHORT_FLAGS_ATTACHED = ["-c", "-C"];
});
