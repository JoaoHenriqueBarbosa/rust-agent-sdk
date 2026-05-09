// function: retryPolicy
function retryPolicy(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT }) {
  let logger12 = options.logger || retryPolicyLogger;
  return {
    name: retryPolicyName,
    async sendRequest(request2, next) {
      let response7, responseError, retryCount = -1;
      retryRequest:
        while (!0) {
          retryCount += 1, response7 = void 0, responseError = void 0;
          try {
            logger12.info(`Retry ${retryCount}: Attempting to send request`, request2.requestId), response7 = await next(request2), logger12.info(`Retry ${retryCount}: Received a response from request`, request2.requestId);
          } catch (e) {
            if (logger12.error(`Retry ${retryCount}: Received an error from request`, request2.requestId), responseError = e, !e || responseError.name !== "RestError")
              throw e;
            response7 = responseError.response;
          }
          if (request2.abortSignal?.aborted)
            throw logger12.error(`Retry ${retryCount}: Request aborted.`), new AbortError3;
          if (retryCount >= (options.maxRetries ?? DEFAULT_RETRY_POLICY_COUNT))
            if (logger12.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`), responseError)
              throw responseError;
            else if (response7)
              return response7;
            else
              throw Error("Maximum retries reached with no response or error to throw");
          logger12.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
          strategiesLoop:
            for (let strategy of strategies) {
              let strategyLogger = strategy.logger || logger12;
              strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
              let modifiers = strategy.retry({
                retryCount,
                response: response7,
                responseError
              });
              if (modifiers.skipStrategy) {
                strategyLogger.info(`Retry ${retryCount}: Skipped.`);
                continue strategiesLoop;
              }
              let { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
              if (errorToThrow)
                throw strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow), errorToThrow;
              if (retryAfterInMs || retryAfterInMs === 0) {
                strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`), await delay3(retryAfterInMs, void 0, { abortSignal: request2.abortSignal });
                continue retryRequest;
              }
              if (redirectTo) {
                strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`), request2.url = redirectTo;
                continue retryRequest;
              }
            }
          if (responseError)
            throw logger12.info("None of the retry strategies could work with the received error. Throwing it."), responseError;
          if (response7)
            return logger12.info("None of the retry strategies could work with the received response. Returning it."), response7;
        }
    }
  };
}
