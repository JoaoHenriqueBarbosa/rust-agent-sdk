// function: inferCompactSchema
function inferCompactSchema(value, depth = 2) {
  if (value === null)
    return "null";
  if (Array.isArray(value)) {
    if (value.length === 0)
      return "[]";
    return `[${inferCompactSchema(value[0], depth - 1)}]`;
  }
  if (typeof value === "object") {
    if (depth <= 0)
      return "{...}";
    let props = Object.entries(value).slice(0, 10).map(([k3, v2]) => `${k3}: ${inferCompactSchema(v2, depth - 1)}`), suffix = Object.keys(value).length > 10 ? ", ..." : "";
    return `{${props.join(", ")}${suffix}}`;
  }
  return typeof value;
}
