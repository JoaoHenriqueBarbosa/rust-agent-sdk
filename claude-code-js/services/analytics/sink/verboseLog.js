// var: verboseLog
var verboseLog = ({ type, verboseMessage, fdNumber, verboseInfo, result }) => {
  let verboseObject = getVerboseObject({ type, result, verboseInfo }), printedLines = getPrintedLines(verboseMessage, verboseObject), finalLines = applyVerboseOnLines(printedLines, verboseInfo, fdNumber);
  if (finalLines !== "")
    console.warn(finalLines.slice(0, -1));
}, getVerboseObject = ({
  type,
  result,
  verboseInfo: { escapedCommand, commandId, rawOptions: { piped = !1, ...options } }
}) => ({
  type,
  escapedCommand,
  commandId: `${commandId}`,
  timestamp: /* @__PURE__ */ new Date,
  piped,
  result,
  options
}), getPrintedLines = (verboseMessage, verboseObject) => verboseMessage.split(`
