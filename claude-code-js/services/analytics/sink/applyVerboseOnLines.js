// var: applyVerboseOnLines
var applyVerboseOnLines = (printedLines, verboseInfo, fdNumber) => {
  let verboseFunction = getVerboseFunction(verboseInfo, fdNumber);
  return printedLines.map(({ verboseLine, verboseObject }) => applyVerboseFunction(verboseLine, verboseObject, verboseFunction)).filter((printedLine) => printedLine !== void 0).map((printedLine) => appendNewline(printedLine)).join("");
}, applyVerboseFunction = (verboseLine, verboseObject, verboseFunction) => {
  if (verboseFunction === void 0)
    return verboseLine;
  let printedLine = verboseFunction(verboseLine, verboseObject);
  if (typeof printedLine === "string")
    return printedLine;
}, appendNewline = (printedLine) => printedLine.endsWith(`
