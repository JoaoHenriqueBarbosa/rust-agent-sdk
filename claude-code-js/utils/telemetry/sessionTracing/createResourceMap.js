// function: createResourceMap
function createResourceMap(logRecords) {
  let resourceMap = /* @__PURE__ */ new Map;
  for (let record3 of logRecords) {
    let { resource, instrumentationScope: { name: name3, version: version5 = "", schemaUrl = "" } } = record3, ismMap = resourceMap.get(resource);
    if (!ismMap)
      ismMap = /* @__PURE__ */ new Map, resourceMap.set(resource, ismMap);
    let ismKey = `${name3}@${version5}:${schemaUrl}`, records = ismMap.get(ismKey);
    if (!records)
      records = [], ismMap.set(ismKey, records);
    records.push(record3);
  }
  return resourceMap;
}
