// function: isBeingDebugged
function isBeingDebugged() {
  let isBun2 = isRunningWithBun(), hasInspectArg = process.execArgv.some((arg) => {
    if (isBun2)
      return /--inspect(-brk)?/.test(arg);
    else
      return /--inspect(-brk)?|--debug(-brk)?/.test(arg);
  }), hasInspectEnv = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
  try {
    return !!global.require("inspector").url() || hasInspectArg || hasInspectEnv;
  } catch {
    return hasInspectArg || hasInspectEnv;
  }
}
