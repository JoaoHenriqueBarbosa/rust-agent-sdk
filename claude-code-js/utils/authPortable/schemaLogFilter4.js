// function: schemaLogFilter4
function schemaLogFilter4(schema5, data) {
  if (data == null)
    return data;
  let ns = import_schema8.NormalizedSchema.of(schema5);
  if (ns.getMergedTraits().sensitive)
    return SENSITIVE_STRING7;
  if (ns.isListSchema()) {
    if (!!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING7;
  } else if (ns.isMapSchema()) {
    if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING7;
  } else if (ns.isStructSchema() && typeof data === "object") {
    let object2 = data, newObject = {};
    for (let [member, memberNs] of ns.structIterator())
      if (object2[member] != null)
        newObject[member] = schemaLogFilter4(memberNs, object2[member]);
    return newObject;
  }
  return data;
}
