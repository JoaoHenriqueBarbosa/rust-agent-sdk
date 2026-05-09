// var: getFinalError
var getFinalError = (originalError, message, isSync) => {
  let ErrorClass = isSync ? ExecaSyncError : ExecaError, options = originalError instanceof DiscardedError ? {} : { cause: originalError };
  return new ErrorClass(message, options);
}, DiscardedError, setErrorName = (ErrorClass, value) => {
  Object.defineProperty(ErrorClass.prototype, "name", {
    value,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(ErrorClass.prototype, execaErrorSymbol, {
    value: !0,
    writable: !1,
    enumerable: !1,
    configurable: !1
  });
}, isExecaError = (error41) => isErrorInstance(error41) && (execaErrorSymbol in error41), execaErrorSymbol, isErrorInstance = (value) => Object.prototype.toString.call(value) === "[object Error]", ExecaError, ExecaSyncError;
