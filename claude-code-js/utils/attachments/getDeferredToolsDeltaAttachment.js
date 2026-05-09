// function: getDeferredToolsDeltaAttachment
function getDeferredToolsDeltaAttachment(tools, model, messages, scanContext) {
  if (!isDeferredToolsDeltaEnabled())
    return [];
  if (!isToolSearchEnabledOptimistic())
    return [];
  if (!modelSupportsToolReference(model))
    return [];
  if (!isToolSearchToolAvailable(tools))
    return [];
  let delta = getDeferredToolsDelta(tools, messages ?? [], scanContext);
  if (!delta)
    return [];
  return [{ type: "deferred_tools_delta", ...delta }];
}
