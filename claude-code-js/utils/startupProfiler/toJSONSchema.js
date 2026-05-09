// function: toJSONSchema
function toJSONSchema(input, _params) {
  if (input instanceof $ZodRegistry) {
    let gen2 = new JSONSchemaGenerator(_params), defs = {};
    for (let entry of input._idmap.entries()) {
      let [_, schema] = entry;
      gen2.process(schema);
    }
    let schemas = {}, external = {
      registry: input,
      uri: _params?.uri,
      defs
    };
    for (let entry of input._idmap.entries()) {
      let [key, schema] = entry;
      schemas[key] = gen2.emit(schema, {
        ..._params,
        external
      });
    }
    if (Object.keys(defs).length > 0) {
      let defsSegment = gen2.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  let gen = new JSONSchemaGenerator(_params);
  return gen.process(input), gen.emit(input, _params);
}
