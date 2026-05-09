// function: addToolContentEvent
function addToolContentEvent(eventName, attributes) {
  if (!isAnyTracingEnabled() || !isToolContentLoggingEnabled())
    return;
  let currentSpanCtx = toolContext.getStore();
  if (!currentSpanCtx)
    return;
  let processedAttributes = {};
  for (let [key2, value] of Object.entries(attributes))
    if (typeof value === "string") {
      let { content, truncated } = truncateContent(value);
      if (processedAttributes[key2] = content, truncated)
        processedAttributes[`${key2}_truncated`] = !0, processedAttributes[`${key2}_original_length`] = value.length;
    } else
      processedAttributes[key2] = value;
  currentSpanCtx.span.addEvent(eventName, processedAttributes);
}
