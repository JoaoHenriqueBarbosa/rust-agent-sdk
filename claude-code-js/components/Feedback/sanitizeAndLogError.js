// function: sanitizeAndLogError
function sanitizeAndLogError(err2) {
  if (err2 instanceof Error) {
    let safeError = Error(redactSensitiveInfo(err2.message));
    if (err2.stack)
      safeError.stack = redactSensitiveInfo(err2.stack);
    logError2(safeError);
  } else {
    let errorString = redactSensitiveInfo(String(err2));
    logError2(Error(errorString));
  }
}
