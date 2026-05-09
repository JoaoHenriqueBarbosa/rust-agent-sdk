// function: validateFlagArgument
function validateFlagArgument(value, argType) {
  switch (argType) {
    case "none":
      return !1;
    case "number":
      return /^\d+$/.test(value);
    case "string":
      return !0;
    case "char":
      return value.length === 1;
    case "{}":
      return value === "{}";
    case "EOF":
      return value === "EOF";
    default:
      return !1;
  }
}
