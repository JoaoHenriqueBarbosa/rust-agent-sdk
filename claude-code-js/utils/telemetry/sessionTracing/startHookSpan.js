// function: startHookSpan
function startHookSpan(hookEvent, hookName, numHooks, hookDefinitions) {
  if (!isBetaTracingEnabled())
    return import_api10.trace.getActiveSpan() || getTracer().startSpan("dummy");
  let tracer = getTracer(), parentSpanCtx = toolContext.getStore() ?? interactionContext.getStore(), attributes = createSpanAttributes("hook", {
    hook_event: hookEvent,
    hook_name: hookName,
    num_hooks: numHooks,
    hook_definitions: hookDefinitions
  }), ctx = parentSpanCtx ? import_api10.trace.setSpan(import_api10.context.active(), parentSpanCtx.span) : import_api10.context.active(), span = tracer.startSpan("claude_code.hook", { attributes }, ctx), spanId = getSpanId(span), spanContextObj = {
    span,
    startTime: Date.now(),
    attributes
  };
  return activeSpans.set(spanId, new WeakRef(spanContextObj)), strongSpans.set(spanId, spanContextObj), span;
}
