// Shared module state and imports
// Original: src/utils/telemetry/sessionTracing.ts
import { AsyncLocalStorage as AsyncLocalStorage5 } from "async_hooks";
var import_api10, interactionContext, toolContext, activeSpans, strongSpans, interactionSequence = 0, _cleanupIntervalStarted = !1, SPAN_TTL_MS = 1800000;

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterOptions.js
var AggregationTemporalityPreference;

// node_modules/@opentelemetry/otlp-exporter-base/build/src/OTLPExporterBase.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/types.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/shared-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/legacy-node-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/bounded-queue-export-promise-handler.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/logging-response-handler.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-export-delegate.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-network-export-delegate.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/index.js

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js
var import_core58, import_sdk_metrics2, import_otlp_exporter_base, import_api11, CumulativeTemporalitySelector = () => import_sdk_metrics2.AggregationTemporality.CUMULATIVE, DeltaTemporalitySelector = (instrumentType) => {
  switch (instrumentType) {
    case import_sdk_metrics2.InstrumentType.COUNTER:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_COUNTER:
    case import_sdk_metrics2.InstrumentType.GAUGE:
    case import_sdk_metrics2.InstrumentType.HISTOGRAM:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_GAUGE:
      return import_sdk_metrics2.AggregationTemporality.DELTA;
    case import_sdk_metrics2.InstrumentType.UP_DOWN_COUNTER:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
      return import_sdk_metrics2.AggregationTemporality.CUMULATIVE;
  }
}, LowMemoryTemporalitySelector = (instrumentType) => {
  switch (instrumentType) {
    case import_sdk_metrics2.InstrumentType.COUNTER:
    case import_sdk_metrics2.InstrumentType.HISTOGRAM:
      return import_sdk_metrics2.AggregationTemporality.DELTA;
    case import_sdk_metrics2.InstrumentType.GAUGE:
    case import_sdk_metrics2.InstrumentType.UP_DOWN_COUNTER:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_COUNTER:
    case import_sdk_metrics2.InstrumentType.OBSERVABLE_GAUGE:
      return import_sdk_metrics2.AggregationTemporality.CUMULATIVE;
  }
}, DEFAULT_AGGREGATION, OTLPMetricExporterBase;

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/logs/internal.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js
var import_core59, encodeTimestamp, JSON_ENCODER;

// node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/internal-types.js
var EAggregationTemporality;

// node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/internal.js
var import_api12, import_sdk_metrics3;

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/logs/json/logs.js
var JsonLogsSerializer;

// node_modules/@opentelemetry/otlp-transformer/build/esm/logs/json/index.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/json/metrics.js
var JsonMetricsSerializer;

// node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/json/index.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/trace.js
var JsonTraceSerializer;

// node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/index.js

// node_modules/@opentelemetry/otlp-transformer/build/esm/index.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/util.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/otlp-http-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/otlp-node-http-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/is-export-retryable.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/version.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/transport/http-transport-utils.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/transport/http-exporter-transport.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/retrying-transport.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/otlp-http-export-delegate.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/shared-env-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/otlp-node-http-env-configuration.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/convert-legacy-http-options.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/configuration/convert-legacy-node-http-options.js

// node_modules/@opentelemetry/otlp-exporter-base/build/src/index-node-http.js

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/node/OTLPMetricExporter.js
var import_node_http4, OTLPMetricExporter;

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/node/index.js

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/index.js

// node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js
__export(exports_esm3, {
  OTLPMetricExporterBase: () => OTLPMetricExporterBase,
  OTLPMetricExporter: () => OTLPMetricExporter,
  LowMemoryTemporalitySelector: () => LowMemoryTemporalitySelector,
  DeltaTemporalitySelector: () => DeltaTemporalitySelector,
  CumulativeTemporalitySelector: () => CumulativeTemporalitySelector,
  AggregationTemporalityPreference: () => AggregationTemporalityPreference
});

// node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusSerializer.js

// node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusExporter.js

// node_modules/@opentelemetry/exporter-prometheus/build/src/index.js

// node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/node/OTLPLogExporter.js
var import_otlp_exporter_base2, import_node_http5, OTLPLogExporter;

// node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/node/index.js

// node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/index.js

// node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/index.js
__export(exports_esm4, {
  OTLPLogExporter: () => OTLPLogExporter
});

// node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/node/OTLPTraceExporter.js
var import_otlp_exporter_base3, import_node_http6, OTLPTraceExporter;

// node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/node/index.js

// node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/index.js

// node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js
__export(exports_esm5, {
  OTLPTraceExporter: () => OTLPTraceExporter
});

