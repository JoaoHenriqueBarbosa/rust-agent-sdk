// function: setClientRequestIdPolicy
function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
  return {
    name: "setClientRequestIdPolicy",
    async sendRequest(request2, next) {
      if (!request2.headers.has(requestIdHeaderName))
        request2.headers.set(requestIdHeaderName, request2.requestId);
      return next(request2);
    }
  };
}
