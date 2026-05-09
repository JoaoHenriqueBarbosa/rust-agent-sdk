// function: schemaLogFilter2
function schemaLogFilter2(schema3, data) {
  if (data == null)
    return data;
  let ns = import_schema2.NormalizedSchema.of(schema3);
  if (ns.getMergedTraits().sensitive)
    return SENSITIVE_STRING3;
  if (ns.isListSchema()) {
    if (!!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING3;
  } else if (ns.isMapSchema()) {
    if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING3;
  } else if (ns.isStructSchema() && typeof data === "object") {
    let object2 = data, newObject = {};
    for (let [member, memberNs] of ns.structIterator())
      if (object2[member] != null)
        newObject[member] = schemaLogFilter2(memberNs, object2[member]);
    return newObject;
  }
  return data;
}
