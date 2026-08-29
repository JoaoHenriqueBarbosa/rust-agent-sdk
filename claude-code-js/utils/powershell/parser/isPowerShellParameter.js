// function: isPowerShellParameter
function isPowerShellParameter(arg, elementType) {
  if (elementType !== void 0)
    return elementType === "Parameter";
  return arg.length > 0 && PS_TOKENIZER_DASH_CHARS.has(arg[0]);
}
