// var: require_dist_cjs45
var require_dist_cjs45 = __commonJS((exports) => {
  var loggerMiddleware = () => (next, context) => async (args) => {
    try {
      let response2 = await next(args), { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context, { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions, inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog, outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog, { $metadata, ...outputWithoutMetadata } = response2.output;
      return logger2?.info?.({
        clientName,
        commandName,
        input: inputFilterSensitiveLog(args.input),
        output: outputFilterSensitiveLog(outputWithoutMetadata),
        metadata: $metadata
      }), response2;
    } catch (error41) {
      let { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context, { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions, inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
      throw logger2?.error?.({
        clientName,
        commandName,
        input: inputFilterSensitiveLog(args.input),
        error: error41,
        metadata: error41.$metadata
      }), error41;
    }
  }, loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: !0
  }, getLoggerPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
    }
  });
  exports.getLoggerPlugin = getLoggerPlugin;
  exports.loggerMiddleware = loggerMiddleware;
  exports.loggerMiddlewareOptions = loggerMiddlewareOptions;
});
