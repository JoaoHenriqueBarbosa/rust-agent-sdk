// function: schemaLogFilter
function schemaLogFilter(schema2, data) {
  if (data == null)
    return data;
  let ns = import_schema.NormalizedSchema.of(schema2);
  if (ns.getMergedTraits().sensitive)
    return SENSITIVE_STRING;
  if (ns.isListSchema()) {
    if (!!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING;
  } else if (ns.isMapSchema()) {
    if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING;
  } else if (ns.isStructSchema() && typeof data === "object") {
    let object2 = data, newObject = {};
    for (let [member, memberNs] of ns.structIterator())
      if (object2[member] != null)
        newObject[member] = schemaLogFilter(memberNs, object2[member]);
    return newObject;
  }
  return data;
}
