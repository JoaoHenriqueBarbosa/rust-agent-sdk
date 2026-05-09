// function: validateFlags
function validateFlags(tokens, startIndex, config9, options) {
  let i4 = startIndex;
  while (i4 < tokens.length) {
    let token = tokens[i4];
    if (!token) {
      i4++;
      continue;
    }
    if (options?.xargsTargetCommands && options.commandName === "xargs" && (!token.startsWith("-") || token === "--")) {
      if (token === "--" && i4 + 1 < tokens.length)
        i4++, token = tokens[i4];
      if (token && options.xargsTargetCommands.includes(token))
        break;
      return !1;
    }
    if (token === "--") {
      if (config9.respectsDoubleDash !== !1) {
        i4++;
        break;
      }
      i4++;
      continue;
    }
    if (token.startsWith("-") && token.length > 1 && FLAG_PATTERN.test(token)) {
      let hasEquals = token.includes("="), [flag, ...valueParts] = token.split("="), inlineValue = valueParts.join("=");
      if (!flag)
        return !1;
      let flagArgType = config9.safeFlags[flag];
      if (!flagArgType) {
        if (options?.commandName === "git" && flag.match(/^-\d+$/)) {
          i4++;
          continue;
        }
        if ((options?.commandName === "grep" || options?.commandName === "rg") && flag.startsWith("-") && !flag.startsWith("--") && flag.length > 2) {
          let potentialFlag = flag.substring(0, 2), potentialValue = flag.substring(2);
          if (config9.safeFlags[potentialFlag] && /^\d+$/.test(potentialValue)) {
            let flagArgType2 = config9.safeFlags[potentialFlag];
            if (flagArgType2 === "number" || flagArgType2 === "string")
              if (validateFlagArgument(potentialValue, flagArgType2)) {
                i4++;
                continue;
              } else
                return !1;
          }
        }
        if (flag.startsWith("-") && !flag.startsWith("--") && flag.length > 2) {
          for (let j4 = 1;j4 < flag.length; j4++) {
            let singleFlag = "-" + flag[j4], flagType = config9.safeFlags[singleFlag];
            if (!flagType)
              return !1;
            if (flagType !== "none")
              return !1;
          }
          i4++;
          continue;
        } else
          return !1;
      }
      if (flagArgType === "none") {
        if (hasEquals)
          return !1;
        i4++;
      } else {
        let argValue;
        if (hasEquals)
          argValue = inlineValue, i4++;
        else {
          if (i4 + 1 >= tokens.length || tokens[i4 + 1] && tokens[i4 + 1].startsWith("-") && tokens[i4 + 1].length > 1 && FLAG_PATTERN.test(tokens[i4 + 1]))
            return !1;
          argValue = tokens[i4 + 1] || "", i4 += 2;
        }
        if (flagArgType === "string" && argValue.startsWith("-"))
          if (flag === "--sort" && options?.commandName === "git" && argValue.match(/^-[a-zA-Z]/))
            ;
          else
            return !1;
        if (!validateFlagArgument(argValue, flagArgType))
          return !1;
      }
    } else
      i4++;
  }
  return !0;
}
