// Original: src/utils/toolErrors.ts
function formatError3(error44) {
  if (error44 instanceof AbortError)
    return error44.message || INTERRUPT_MESSAGE_FOR_TOOL_USE;
  if (!(error44 instanceof Error))
    return String(error44);
  let fullMessage = getErrorParts(error44).filter(Boolean).join(`
`).trim() || "Command failed with no output";
  if (fullMessage.length <= 1e4)
    return fullMessage;
  let halfLength = 5000, start = fullMessage.slice(0, halfLength), end = fullMessage.slice(-halfLength);
  return `${start}

... [${fullMessage.length - 1e4} characters truncated] ...

${end}`;
}
function getErrorParts(error44) {
  if (error44 instanceof ShellError)
    return [
      `Exit code ${error44.code}`,
      error44.interrupted ? INTERRUPT_MESSAGE_FOR_TOOL_USE : "",
      error44.stderr,
      error44.stdout
    ];
  let parts = [error44.message];
  if ("stderr" in error44 && typeof error44.stderr === "string")
    parts.push(error44.stderr);
  if ("stdout" in error44 && typeof error44.stdout === "string")
    parts.push(error44.stdout);
  return parts;
}
function formatValidationPath(path20) {
  if (path20.length === 0)
    return "";
  return path20.reduce((acc, segment, index) => {
    let segmentStr = String(segment);
    if (typeof segment === "number")
      return `${String(acc)}[${segmentStr}]`;
    return index === 0 ? segmentStr : `${String(acc)}.${segmentStr}`;
  }, "");
}
function formatZodValidationError(toolName, error44) {
  let missingParams = error44.issues.filter((err2) => err2.code === "invalid_type" && err2.message.includes("received undefined")).map((err2) => formatValidationPath(err2.path)), unexpectedParams = error44.issues.filter((err2) => err2.code === "unrecognized_keys").flatMap((err2) => err2.keys), typeMismatchParams = error44.issues.filter((err2) => err2.code === "invalid_type" && !err2.message.includes("received undefined")).map((err2) => {
    let typeErr = err2, receivedMatch = err2.message.match(/received (\w+)/), received = receivedMatch ? receivedMatch[1] : "unknown";
    return {
      param: formatValidationPath(err2.path),
      expected: typeErr.expected,
      received
    };
  }), errorContent = error44.message, errorParts = [];
  if (missingParams.length > 0) {
    let missingParamErrors = missingParams.map((param) => `The required parameter \`${param}\` is missing`);
    errorParts.push(...missingParamErrors);
  }
  if (unexpectedParams.length > 0) {
    let unexpectedParamErrors = unexpectedParams.map((param) => `An unexpected parameter \`${param}\` was provided`);
    errorParts.push(...unexpectedParamErrors);
  }
  if (typeMismatchParams.length > 0) {
    let typeErrors = typeMismatchParams.map(({ param, expected, received }) => `The parameter \`${param}\` type is expected as \`${expected}\` but provided as \`${received}\``);
    errorParts.push(...typeErrors);
  }
  if (errorParts.length > 0)
    errorContent = `${toolName} failed due to the following ${errorParts.length > 1 ? "issues" : "issue"}:
${errorParts.join(`
`)}`;
  return errorContent;
}
var init_toolErrors = __esm(() => {
  init_errors();
  init_messages3();
});
