// function: createExportLogsServiceRequest
function createExportLogsServiceRequest(logRecords, encoder) {
  return {
    resourceLogs: logRecordsToResourceLogs(logRecords, encoder)
  };
}
