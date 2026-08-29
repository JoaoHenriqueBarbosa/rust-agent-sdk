// function: parsePatternCommand
function parsePatternCommand(args, flagsWithArgs, defaults2 = []) {
  let paths2 = [], patternFound = !1, afterDoubleDash = !1;
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
      if (flag && ["-e", "--regexp", "-f", "--file"].includes(flag))
        patternFound = !0;
      if (flag && flagsWithArgs.has(flag) && !arg.includes("="))
        i5++;
      continue;
    }
    if (!patternFound) {
      patternFound = !0;
      continue;
    }
    paths2.push(arg);
  }
  return paths2.length > 0 ? paths2 : defaults2;
}
