// function: toScopeMetrics
function toScopeMetrics(scopeMetrics, encoder) {
  return Array.from(scopeMetrics.map((metrics) => ({
    scope: createInstrumentationScope(metrics.scope),
    metrics: metrics.metrics.map((metricData) => toMetric(metricData, encoder)),
    schemaUrl: metrics.scope.schemaUrl
  })));
}
