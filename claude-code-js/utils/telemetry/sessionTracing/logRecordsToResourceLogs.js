// function: logRecordsToResourceLogs
function logRecordsToResourceLogs(logRecords, encoder) {
  let resourceMap = createResourceMap(logRecords);
  return Array.from(resourceMap, ([resource, ismMap]) => {
    let processedResource = createResource(resource, encoder);
    return {
      resource: processedResource,
      scopeLogs: Array.from(ismMap, ([, scopeLogs]) => {
        return {
          scope: createInstrumentationScope(scopeLogs[0].instrumentationScope),
          logRecords: scopeLogs.map((log3) => toLogRecord(log3, encoder)),
          schemaUrl: scopeLogs[0].instrumentationScope.schemaUrl
        };
      }),
      schemaUrl: processedResource.schemaUrl
    };
  });
}
