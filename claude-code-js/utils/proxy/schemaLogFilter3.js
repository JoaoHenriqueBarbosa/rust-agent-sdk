// function: schemaLogFilter3
function schemaLogFilter3(schema4, data) {
  if (data == null)
    return data;
  let ns = import_schema5.NormalizedSchema.of(schema4);
  if (ns.getMergedTraits().sensitive)
    return SENSITIVE_STRING5;
  if (ns.isListSchema()) {
    if (!!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING5;
  } else if (ns.isMapSchema()) {
    if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive)
      return SENSITIVE_STRING5;
  } else if (ns.isStructSchema() && typeof data === "object") {
    let object2 = data, newObject = {};
    for (let [member, memberNs] of ns.structIterator())
      if (object2[member] != null)
        newObject[member] = schemaLogFilter3(memberNs, object2[member]);
    return newObject;
  }
  return data;
}
