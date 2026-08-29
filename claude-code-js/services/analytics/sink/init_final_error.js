// var: init_final_error
var init_final_error = __esm(() => {
  DiscardedError = class DiscardedError extends Error {
  };
  execaErrorSymbol = Symbol("isExecaError");
  ExecaError = class ExecaError extends Error {
  };
  setErrorName(ExecaError, ExecaError.name);
  ExecaSyncError = class ExecaSyncError extends Error {
  };
  setErrorName(ExecaSyncError, ExecaSyncError.name);
});
