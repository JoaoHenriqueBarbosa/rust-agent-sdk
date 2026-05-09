// function: createExportMetricsServiceRequest
function createExportMetricsServiceRequest(resourceMetrics, encoder) {
  return {
    resourceMetrics: resourceMetrics.map((metrics) => toResourceMetrics(metrics, encoder))
  };
}
