// function: createTracingClient
function createTracingClient(options) {
  let { namespace, packageName, packageVersion } = options;
  function startSpan(name, operationOptions, spanOptions) {
    let startSpanResult = getInstrumenter().startSpan(name, {
      ...spanOptions,
      packageName,
      packageVersion,
      tracingContext: operationOptions?.tracingOptions?.tracingContext
    }), tracingContext = startSpanResult.tracingContext, span = startSpanResult.span;
    if (!tracingContext.getValue(knownContextKeys.namespace))
      tracingContext = tracingContext.setValue(knownContextKeys.namespace, namespace);
    span.setAttribute("az.namespace", tracingContext.getValue(knownContextKeys.namespace));
    let updatedOptions = Object.assign({}, operationOptions, {
      tracingOptions: { ...operationOptions?.tracingOptions, tracingContext }
    });
    return {
      span,
      updatedOptions
    };
  }
  async function withSpan(name, operationOptions, callback, spanOptions) {
    let { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
    try {
      let result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
      return span.setStatus({ status: "success" }), result;
    } catch (err) {
      throw span.setStatus({ status: "error", error: err }), err;
    } finally {
      span.end();
    }
  }
  function withContext(context3, callback, ...callbackArgs) {
    return getInstrumenter().withContext(context3, callback, ...callbackArgs);
  }
  function parseTraceparentHeader(traceparentHeader) {
    return getInstrumenter().parseTraceparentHeader(traceparentHeader);
  }
  function createRequestHeaders(tracingContext) {
    return getInstrumenter().createRequestHeaders(tracingContext);
  }
  return {
    startSpan,
    withSpan,
    withContext,
    parseTraceparentHeader,
    createRequestHeaders
  };
}
