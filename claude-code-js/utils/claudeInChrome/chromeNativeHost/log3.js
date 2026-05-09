// function: log3
function log3(message, ...args) {
  if (LOG_FILE) {
    let timestamp = (/* @__PURE__ */ new Date()).toISOString(), formattedArgs = args.length > 0 ? " " + jsonStringify(args) : "", logLine2 = `[${timestamp}] [Claude Chrome Native Host] ${message}${formattedArgs}
`;
    appendFile5(LOG_FILE, logLine2).catch(() => {});
  }
  console.error(`[Claude Chrome Native Host] ${message}`, ...args);
}
