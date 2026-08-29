// function: logForDebugging2
function logForDebugging2(message, options) {
  if (!process.env.SRT_DEBUG)
    return;
  let level = options?.level || "info", prefix = "[SandboxDebug]";
  switch (level) {
    case "error":
      console.error(`${prefix} ${message}`);
      break;
    case "warn":
      console.warn(`${prefix} ${message}`);
      break;
    default:
      console.error(`${prefix} ${message}`);
  }
}
