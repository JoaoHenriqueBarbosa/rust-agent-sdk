// var: init_pathValidation2
var init_pathValidation2 = __esm(() => {
  init_commands4();
  init_shellQuote();
  init_path2();
  init_filesystem();
  init_PermissionUpdate();
  init_pathValidation();
  init_bashPermissions();
  init_sedValidation();
  PATH_EXTRACTORS = {
    cd: (args) => args.length === 0 ? [homedir18()] : [args.join(" ")],
    ls: (args) => {
      let paths2 = filterOutFlags(args);
      return paths2.length > 0 ? paths2 : ["."];
    },
    find: (args) => {
      let paths2 = [], pathFlags = /* @__PURE__ */ new Set([
        "-newer",
        "-anewer",
        "-cnewer",
        "-mnewer",
        "-samefile",
        "-path",
        "-wholename",
        "-ilname",
        "-lname",
        "-ipath",
        "-iwholename"
      ]), newerPattern = /^-newer[acmBt][acmtB]$/, foundNonGlobalFlag = !1, afterDoubleDash = !1;
      for (let i5 = 0;i5 < args.length; i5++) {
        let arg = args[i5];
        if (!arg)
          continue;
        if (afterDoubleDash) {
          paths2.push(arg);
          continue;
        }
        if (arg === "--") {
          afterDoubleDash = !0;
          continue;
        }
        if (arg.startsWith("-")) {
          if (["-H", "-L", "-P"].includes(arg))
            continue;
          if (foundNonGlobalFlag = !0, pathFlags.has(arg) || newerPattern.test(arg)) {
            let nextArg = args[i5 + 1];
            if (nextArg)
              paths2.push(nextArg), i5++;
          }
          continue;
        }
        if (!foundNonGlobalFlag)
          paths2.push(arg);
      }
      return paths2.length > 0 ? paths2 : ["."];
    },
    mkdir: filterOutFlags,
    touch: filterOutFlags,
    rm: filterOutFlags,
    rmdir: filterOutFlags,
    mv: filterOutFlags,
    cp: filterOutFlags,
    cat: filterOutFlags,
    head: filterOutFlags,
    tail: filterOutFlags,
    sort: filterOutFlags,
    uniq: filterOutFlags,
    wc: filterOutFlags,
    cut: filterOutFlags,
    paste: filterOutFlags,
    column: filterOutFlags,
    file: filterOutFlags,
    stat: filterOutFlags,
    diff: filterOutFlags,
    awk: filterOutFlags,
    strings: filterOutFlags,
    hexdump: filterOutFlags,
    od: filterOutFlags,
    base64: filterOutFlags,
    nl: filterOutFlags,
    sha256sum: filterOutFlags,
    sha1sum: filterOutFlags,
    md5sum: filterOutFlags,
    tr: (args) => {
      let hasDelete = args.some((a2) => a2 === "-d" || a2 === "--delete" || a2.startsWith("-") && a2.includes("d"));
      return filterOutFlags(args).slice(hasDelete ? 1 : 2);
    },
    grep: (args) => {
      let paths2 = parsePatternCommand(args, /* @__PURE__ */ new Set([
        "-e",
        "--regexp",
        "-f",
        "--file",
        "--exclude",
        "--include",
        "--exclude-dir",
        "--include-dir",
        "-m",
        "--max-count",
        "-A",
        "--after-context",
        "-B",
        "--before-context",
        "-C",
        "--context"
      ]));
      if (paths2.length === 0 && args.some((a2) => ["-r", "-R", "--recursive"].includes(a2)))
        return ["."];
      return paths2;
    },
    rg: (args) => {
      return parsePatternCommand(args, /* @__PURE__ */ new Set([
        "-e",
        "--regexp",
        "-f",
        "--file",
        "-t",
        "--type",
        "-T",
        "--type-not",
        "-g",
        "--glob",
        "-m",
        "--max-count",
        "--max-depth",
        "-r",
        "--replace",
        "-A",
        "--after-context",
        "-B",
        "--before-context",
        "-C",
        "--context"
      ]), ["."]);
    },
    sed: (args) => {
      let paths2 = [], skipNext = !1, scriptFound = !1, afterDoubleDash = !1;
      for (let i5 = 0;i5 < args.length; i5++) {
        if (skipNext) {
          skipNext = !1;
          continue;
        }
        let arg = args[i5];
        if (!arg)
          continue;
        if (!afterDoubleDash && arg === "--") {
          afterDoubleDash = !0;
          continue;
        }
        if (!afterDoubleDash && arg.startsWith("-")) {
          if (["-f", "--file"].includes(arg)) {
            let scriptFile = args[i5 + 1];
            if (scriptFile)
              paths2.push(scriptFile), skipNext = !0;
            scriptFound = !0;
          } else if (["-e", "--expression"].includes(arg))
            skipNext = !0, scriptFound = !0;
          else if (arg.includes("e") || arg.includes("f"))
            scriptFound = !0;
          continue;
        }
        if (!scriptFound) {
          scriptFound = !0;
          continue;
        }
        paths2.push(arg);
      }
      return paths2;
    },
    jq: (args) => {
      let paths2 = [], flagsWithArgs = /* @__PURE__ */ new Set([
        "-e",
        "--expression",
        "-f",
        "--from-file",
        "--arg",
        "--argjson",
        "--slurpfile",
        "--rawfile",
        "--args",
        "--jsonargs",
        "-L",
        "--library-path",
        "--indent",
        "--tab"
      ]), filterFound = !1, afterDoubleDash = !1;
      for (let i5 = 0;i5 < args.length; i5++) {
        let arg = args[i5];
        if (arg === void 0 || arg === null)
          continue;
        if (!afterDoubleDash && arg === "--") {
          afterDoubleDash = !0;
          continue;
        }
        if (!afterDoubleDash && arg.startsWith("-")) {
          let flag = arg.split("=")[0];
          if (flag && ["-e", "--expression"].includes(flag))
            filterFound = !0;
          if (flag && flagsWithArgs.has(flag) && !arg.includes("="))
            i5++;
          continue;
        }
        if (!filterFound) {
          filterFound = !0;
          continue;
        }
        paths2.push(arg);
      }
      return paths2;
    },
    git: (args) => {
      if (args.length >= 1 && args[0] === "diff") {
        if (args.includes("--no-index"))
          return filterOutFlags(args.slice(1)).slice(0, 2);
      }
      return [];
    }
  }, SUPPORTED_PATH_COMMANDS = Object.keys(PATH_EXTRACTORS), ACTION_VERBS = {
    cd: "change directories to",
    ls: "list files in",
    find: "search files in",
    mkdir: "create directories in",
    touch: "create or modify files in",
    rm: "remove files from",
    rmdir: "remove directories from",
    mv: "move files to/from",
    cp: "copy files to/from",
    cat: "concatenate files from",
    head: "read the beginning of files from",
    tail: "read the end of files from",
    sort: "sort contents of files from",
    uniq: "filter duplicate lines from files in",
    wc: "count lines/words/bytes in files from",
    cut: "extract columns from files in",
    paste: "merge files from",
    column: "format files from",
    tr: "transform text from files in",
    file: "examine file types in",
    stat: "read file stats from",
    diff: "compare files from",
    awk: "process text from files in",
    strings: "extract strings from files in",
    hexdump: "display hex dump of files from",
    od: "display octal dump of files from",
    base64: "encode/decode files from",
    nl: "number lines in files from",
    grep: "search for patterns in files from",
    rg: "search for patterns in files from",
    sed: "edit files in",
    git: "access files with git from",
    jq: "process JSON from files in",
    sha256sum: "compute SHA-256 checksums for files in",
    sha1sum: "compute SHA-1 checksums for files in",
    md5sum: "compute MD5 checksums for files in"
  }, COMMAND_OPERATION_TYPE = {
    cd: "read",
    ls: "read",
    find: "read",
    mkdir: "create",
    touch: "create",
    rm: "write",
    rmdir: "write",
    mv: "write",
    cp: "write",
    cat: "read",
    head: "read",
    tail: "read",
    sort: "read",
    uniq: "read",
    wc: "read",
    cut: "read",
    paste: "read",
    column: "read",
    tr: "read",
    file: "read",
    stat: "read",
    diff: "read",
    awk: "read",
    strings: "read",
    hexdump: "read",
    od: "read",
    base64: "read",
    nl: "read",
    grep: "read",
    rg: "read",
    sed: "write",
    git: "read",
    jq: "read",
    sha256sum: "read",
    sha1sum: "read",
    md5sum: "read"
  }, COMMAND_VALIDATOR = {
    mv: (args) => !args.some((arg) => arg?.startsWith("-")),
    cp: (args) => !args.some((arg) => arg?.startsWith("-"))
  };
  TIMEOUT_FLAG_VALUE_RE = /^[A-Za-z0-9_.+-]+$/;
});
