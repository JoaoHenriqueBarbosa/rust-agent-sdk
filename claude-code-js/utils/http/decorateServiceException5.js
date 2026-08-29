// var: decorateServiceException5
var decorateServiceException5 = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v2]) => v2 !== void 0).forEach(([k3, v2]) => {
    if (exception[k3] == null || exception[k3] === "")
      exception[k3] = v2;
  });
  let message = exception.message || exception.Message || "UnknownError";
  return exception.message = message, delete exception.Message, exception;
};
