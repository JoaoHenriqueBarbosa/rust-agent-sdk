// function: getNodeType
function getNodeType(value) {
  switch (typeof value) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!value)
        return "null";
      else if (Array.isArray(value))
        return "array";
      return "object";
    }
    default:
      return "null";
  }
}
