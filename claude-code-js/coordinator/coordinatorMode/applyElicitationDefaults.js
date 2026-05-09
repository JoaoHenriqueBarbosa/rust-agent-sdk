// function: applyElicitationDefaults
function applyElicitationDefaults(schema5, data) {
  if (!schema5 || data === null || typeof data !== "object")
    return;
  if (schema5.type === "object" && schema5.properties && typeof schema5.properties === "object") {
    let obj = data, props = schema5.properties;
    for (let key2 of Object.keys(props)) {
      let propSchema = props[key2];
      if (obj[key2] === void 0 && Object.prototype.hasOwnProperty.call(propSchema, "default"))
        obj[key2] = propSchema.default;
      if (obj[key2] !== void 0)
        applyElicitationDefaults(propSchema, obj[key2]);
    }
  }
  if (Array.isArray(schema5.anyOf)) {
    for (let sub of schema5.anyOf)
      if (typeof sub !== "boolean")
        applyElicitationDefaults(sub, data);
  }
  if (Array.isArray(schema5.oneOf)) {
    for (let sub of schema5.oneOf)
      if (typeof sub !== "boolean")
        applyElicitationDefaults(sub, data);
  }
}
