// function: logLockAcquisitionError
function logLockAcquisitionError(versionPath, lockError) {
  logError2(Error(`NON-FATAL: Lock acquisition failed for ${versionPath} (expected in multi-process scenarios)`, { cause: lockError }));
}
