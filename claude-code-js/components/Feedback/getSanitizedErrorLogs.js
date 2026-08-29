// function: getSanitizedErrorLogs
function getSanitizedErrorLogs() {
  return getInMemoryErrors().map((errorInfo) => {
    let errorCopy = {
      ...errorInfo
    };
    if (errorCopy && typeof errorCopy.error === "string")
      errorCopy.error = redactSensitiveInfo(errorCopy.error);
    return errorCopy;
  });
}
