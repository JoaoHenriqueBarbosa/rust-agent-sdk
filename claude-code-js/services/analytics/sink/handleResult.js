// var: handleResult
var handleResult = (result, verboseInfo, { reject }) => {
  if (logResult(result, verboseInfo), result.failed && reject)
    throw result;
  return result;
};
