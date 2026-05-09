// function: createExportTraceServiceRequest
function createExportTraceServiceRequest(spans, encoder) {
  return {
    resourceSpans: spanRecordsToResourceSpans(spans, encoder)
  };
}
