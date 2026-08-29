// function: inspectableError
function inspectableError(err2) {
  return {
    type: err2.type,
    message: err2.message,
    code: err2.code,
    defaultPrevented: err2.defaultPrevented,
    cancelable: err2.cancelable,
    timeStamp: err2.timeStamp
  };
}
