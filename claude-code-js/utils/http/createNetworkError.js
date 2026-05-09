// function: createNetworkError
function createNetworkError(error43, httpStatus, responseHeaders, additionalError) {
  return error43.errorMessage = `${error43.errorMessage}, additionalErrorInfo: error.name:${additionalError?.name}, error.message:${additionalError?.message}`, new NetworkError(error43, httpStatus, responseHeaders);
}
