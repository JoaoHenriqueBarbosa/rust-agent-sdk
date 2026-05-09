// function: parentOrigin
function parentOrigin(parentSpanContext) {
  if (!parentSpanContext)
    return "none";
  if (parentSpanContext.isRemote)
    return "remote";
  return "local";
}
