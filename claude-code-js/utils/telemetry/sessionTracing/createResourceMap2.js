// function: createResourceMap2
function createResourceMap2(readableSpans) {
  let resourceMap = /* @__PURE__ */ new Map;
  for (let record3 of readableSpans) {
    let ilsMap = resourceMap.get(record3.resource);
    if (!ilsMap)
      ilsMap = /* @__PURE__ */ new Map, resourceMap.set(record3.resource, ilsMap);
    let instrumentationScopeKey = `${record3.instrumentationScope.name}@${record3.instrumentationScope.version || ""}:${record3.instrumentationScope.schemaUrl || ""}`, records = ilsMap.get(instrumentationScopeKey);
    if (!records)
      records = [], ilsMap.set(instrumentationScopeKey, records);
    records.push(record3);
  }
  return resourceMap;
}
