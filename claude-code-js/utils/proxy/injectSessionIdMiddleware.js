// var: injectSessionIdMiddleware
var injectSessionIdMiddleware = () => (next) => async (args) => {
  let requestParams = {
    ...args.input
  }, response3 = await next(args), output = response3.output;
  if (requestParams.SessionId && output.SessionId == null)
    output.SessionId = requestParams.SessionId;
  return response3;
}, injectSessionIdMiddlewareOptions;
