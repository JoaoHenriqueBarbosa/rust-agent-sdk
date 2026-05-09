// var: normalizeIpcStdioArray
var normalizeIpcStdioArray = (stdioArray, ipc) => ipc && !stdioArray.includes("ipc") ? [...stdioArray, "ipc"] : stdioArray;

// node_modules/execa/lib/stdio/stdio-option.js
var normalizeStdioOption = ({ stdio, ipc, buffer, ...options }, verboseInfo, isSync) => {
  let stdioArray = getStdioArray(stdio, options).map((stdioOption, fdNumber) => addDefaultValue2(stdioOption, fdNumber));
  return isSync ? normalizeStdioSync(stdioArray, buffer, verboseInfo) : normalizeIpcStdioArray(stdioArray, ipc);
}, getStdioArray = (stdio, options) => {
  if (stdio === void 0)
    return STANDARD_STREAMS_ALIASES.map((alias) => options[alias]);
  if (hasAlias(options))
    throw Error(`It's not possible to provide \`stdio\` in combination with one of ${STANDARD_STREAMS_ALIASES.map((alias) => `\`${alias}\``).join(", ")}`);
  if (typeof stdio === "string")
    return [stdio, stdio, stdio];
  if (!Array.isArray(stdio))
    throw TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  let length = Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length);
  return Array.from({ length }, (_, fdNumber) => stdio[fdNumber]);
}, hasAlias = (options) => STANDARD_STREAMS_ALIASES.some((alias) => options[alias] !== void 0), addDefaultValue2 = (stdioOption, fdNumber) => {
  if (Array.isArray(stdioOption))
    return stdioOption.map((item) => addDefaultValue2(item, fdNumber));
  if (stdioOption === null || stdioOption === void 0)
    return fdNumber >= STANDARD_STREAMS_ALIASES.length ? "ignore" : "pipe";
  return stdioOption;
}, normalizeStdioSync = (stdioArray, buffer, verboseInfo) => stdioArray.map((stdioOption, fdNumber) => !buffer[fdNumber] && fdNumber !== 0 && !isFullVerbose(verboseInfo, fdNumber) && isOutputPipeOnly(stdioOption) ? "ignore" : stdioOption), isOutputPipeOnly = (stdioOption) => stdioOption === "pipe" || Array.isArray(stdioOption) && stdioOption.every((item) => item === "pipe");
