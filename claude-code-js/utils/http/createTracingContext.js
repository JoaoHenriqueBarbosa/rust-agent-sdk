// function: createTracingContext
function createTracingContext(options = {}) {
  let context3 = new TracingContextImpl(options.parentContext);
  if (options.span)
    context3 = context3.setValue(knownContextKeys.span, options.span);
  if (options.namespace)
    context3 = context3.setValue(knownContextKeys.namespace, options.namespace);
  return context3;
}
