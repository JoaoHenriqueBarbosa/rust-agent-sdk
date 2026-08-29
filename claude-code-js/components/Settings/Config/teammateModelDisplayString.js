// function: teammateModelDisplayString
function teammateModelDisplayString(value) {
  if (value === void 0)
    return modelDisplayString(getHardcodedTeammateModelFallback());
  if (value === null)
    return "Default (leader's model)";
  return modelDisplayString(value);
}
