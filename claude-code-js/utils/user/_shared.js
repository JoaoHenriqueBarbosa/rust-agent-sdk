// Shared module state and imports
// Original: src/utils/user.ts

// node_modules/@opentelemetry/api/build/src/version.js

// node_modules/@opentelemetry/api/build/src/internal/semver.js

// node_modules/@opentelemetry/api/build/src/internal/global-utils.js

// node_modules/@opentelemetry/api/build/src/diag/ComponentLogger.js

// node_modules/@opentelemetry/api/build/src/diag/types.js

// node_modules/@opentelemetry/api/build/src/diag/internal/logLevelLogger.js

// node_modules/@opentelemetry/api/build/src/api/diag.js

// node_modules/@opentelemetry/api/build/src/baggage/internal/baggage-impl.js

// node_modules/@opentelemetry/api/build/src/baggage/internal/symbol.js

// node_modules/@opentelemetry/api/build/src/baggage/utils.js

// node_modules/@opentelemetry/api/build/src/context/context.js

// node_modules/@opentelemetry/api/build/src/diag/consoleLogger.js

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeter.js

// node_modules/@opentelemetry/api/build/src/metrics/Metric.js

// node_modules/@opentelemetry/api/build/src/propagation/TextMapPropagator.js

// node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js

// node_modules/@opentelemetry/api/build/src/api/context.js

// node_modules/@opentelemetry/api/build/src/trace/trace_flags.js

// node_modules/@opentelemetry/api/build/src/trace/invalid-span-constants.js

// node_modules/@opentelemetry/api/build/src/trace/NonRecordingSpan.js

// node_modules/@opentelemetry/api/build/src/trace/context-utils.js

// node_modules/@opentelemetry/api/build/src/trace/spancontext-utils.js

// node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js

// node_modules/@opentelemetry/api/build/src/trace/NoopTracerProvider.js

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracerProvider.js

// node_modules/@opentelemetry/api/build/src/trace/SamplingResult.js

// node_modules/@opentelemetry/api/build/src/trace/span_kind.js

// node_modules/@opentelemetry/api/build/src/trace/status.js

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-validators.js

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-impl.js

// node_modules/@opentelemetry/api/build/src/trace/internal/utils.js

// node_modules/@opentelemetry/api/build/src/context-api.js

// node_modules/@opentelemetry/api/build/src/diag-api.js

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeterProvider.js

// node_modules/@opentelemetry/api/build/src/api/metrics.js

// node_modules/@opentelemetry/api/build/src/metrics-api.js

// node_modules/@opentelemetry/api/build/src/propagation/NoopTextMapPropagator.js

// node_modules/@opentelemetry/api/build/src/baggage/context-helpers.js

// node_modules/@opentelemetry/api/build/src/api/propagation.js

// node_modules/@opentelemetry/api/build/src/propagation-api.js

// node_modules/@opentelemetry/api/build/src/api/trace.js

// node_modules/@opentelemetry/api/build/src/trace-api.js

// node_modules/@opentelemetry/api/build/src/index.js

// node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js
var SeverityNumber;

// node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js
var NOOP_LOGGER2;

// node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js
var GLOBAL_LOGS_API_KEY, _global2, API_BACKWARDS_COMPATIBILITY_VERSION = 1;

// node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js
var NOOP_LOGGER_PROVIDER;

// node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js

// node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js

// node_modules/@opentelemetry/api-logs/build/esm/api/logs.js

// node_modules/@opentelemetry/api-logs/build/esm/index.js
var logs;

// node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js

// node_modules/@opentelemetry/core/build/src/baggage/constants.js

// node_modules/@opentelemetry/core/build/src/baggage/utils.js

// node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js

// node_modules/@opentelemetry/core/build/src/common/anchored-clock.js

// node_modules/@opentelemetry/core/build/src/common/attributes.js

// node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js

// node_modules/@opentelemetry/core/build/src/common/global-error-handler.js

// node_modules/@opentelemetry/core/build/src/platform/node/environment.js

// node_modules/@opentelemetry/core/build/src/common/globalThis.js

// node_modules/@opentelemetry/core/build/src/version.js

// node_modules/@opentelemetry/semantic-conventions/build/src/internal/utils.js

// node_modules/@opentelemetry/semantic-conventions/build/src/trace/SemanticAttributes.js

// node_modules/@opentelemetry/semantic-conventions/build/src/trace/index.js

// node_modules/@opentelemetry/semantic-conventions/build/src/resource/SemanticResourceAttributes.js

// node_modules/@opentelemetry/semantic-conventions/build/src/resource/index.js

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_attributes.js

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_metrics.js

// node_modules/@opentelemetry/semantic-conventions/build/src/stable_events.js

// node_modules/@opentelemetry/semantic-conventions/build/src/index.js

// node_modules/@opentelemetry/core/build/src/semconv.js

// node_modules/@opentelemetry/core/build/src/platform/node/sdk-info.js

// node_modules/@opentelemetry/core/build/src/platform/node/index.js

// node_modules/@opentelemetry/core/build/src/platform/index.js

// node_modules/@opentelemetry/core/build/src/common/time.js

// node_modules/@opentelemetry/core/build/src/common/timer-util.js

// node_modules/@opentelemetry/core/build/src/ExportResult.js

// node_modules/@opentelemetry/core/build/src/propagation/composite.js

// node_modules/@opentelemetry/core/build/src/internal/validators.js

// node_modules/@opentelemetry/core/build/src/trace/TraceState.js

// node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js

// node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js

// node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js

// node_modules/@opentelemetry/core/build/src/utils/merge.js

// node_modules/@opentelemetry/core/build/src/utils/timeout.js

// node_modules/@opentelemetry/core/build/src/utils/url.js

// node_modules/@opentelemetry/core/build/src/utils/promise.js

// node_modules/@opentelemetry/core/build/src/utils/callback.js

// node_modules/@opentelemetry/core/build/src/utils/configuration.js

// node_modules/@opentelemetry/core/build/src/internal/exporter.js

// node_modules/@opentelemetry/core/build/src/index.js

// node_modules/@opentelemetry/resources/build/src/default-service-name.js

// node_modules/@opentelemetry/resources/build/src/utils.js

// node_modules/@opentelemetry/resources/build/src/ResourceImpl.js

// node_modules/@opentelemetry/resources/build/src/detect-resources.js

// node_modules/@opentelemetry/resources/build/src/detectors/EnvDetector.js

// node_modules/@opentelemetry/resources/build/src/semconv.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/execAsync.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-darwin.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-linux.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-bsd.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-win.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-unsupported.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/utils.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/HostDetector.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/OSDetector.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/ProcessDetector.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/ServiceInstanceIdDetector.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/node/index.js

// node_modules/@opentelemetry/resources/build/src/detectors/platform/index.js

// node_modules/@opentelemetry/resources/build/src/detectors/NoopDetector.js

// node_modules/@opentelemetry/resources/build/src/detectors/index.js

// node_modules/@opentelemetry/resources/build/src/index.js

// node_modules/@opentelemetry/sdk-logs/build/esm/utils/validation.js

// node_modules/@opentelemetry/sdk-logs/build/esm/LogRecordImpl.js
var api2, import_core43, import_semantic_conventions;

// node_modules/@opentelemetry/sdk-logs/build/esm/Logger.js
var import_api2;

// node_modules/@opentelemetry/sdk-logs/build/esm/export/NoopLogRecordProcessor.js

// node_modules/@opentelemetry/sdk-logs/build/esm/MultiLogRecordProcessor.js
var import_core44;

// node_modules/@opentelemetry/sdk-logs/build/esm/internal/utils.js

// node_modules/@opentelemetry/sdk-logs/build/esm/internal/LoggerProviderSharedState.js
var DEFAULT_LOGGER_CONFIG, DEFAULT_LOGGER_CONFIGURATOR = () => ({
  ...DEFAULT_LOGGER_CONFIG
});

// node_modules/@opentelemetry/sdk-logs/build/esm/LoggerProvider.js
var import_api3, import_resources, import_core45, DEFAULT_LOGGER_NAME = "unknown";

// node_modules/@opentelemetry/sdk-logs/build/esm/export/ConsoleLogRecordExporter.js
var import_core46;

// node_modules/@opentelemetry/sdk-logs/build/esm/export/BatchLogRecordProcessorBase.js
var import_api4, import_core47;

// node_modules/@opentelemetry/sdk-logs/build/esm/platform/node/export/BatchLogRecordProcessor.js
var BatchLogRecordProcessor;

// node_modules/@opentelemetry/sdk-logs/build/esm/platform/node/index.js

// node_modules/@opentelemetry/sdk-logs/build/esm/platform/index.js

// node_modules/@opentelemetry/sdk-logs/build/esm/index.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/AggregationTemporality.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricData.js

// node_modules/@opentelemetry/sdk-metrics/build/src/utils.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/types.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Drop.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Histogram.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/Buckets.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/ieee754.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/util.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/types.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/ExponentMapping.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/LogarithmMapping.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/getMapping.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/ExponentialHistogram.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/LastValue.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Sum.js

// node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/index.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/Aggregation.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/AggregationOption.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/AggregationSelector.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricReader.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/PeriodicExportingMetricReader.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/InMemoryMetricExporter.js

// node_modules/@opentelemetry/sdk-metrics/build/src/export/ConsoleMetricExporter.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/ViewRegistry.js

// node_modules/@opentelemetry/sdk-metrics/build/src/InstrumentDescriptor.js

// node_modules/@opentelemetry/sdk-metrics/build/src/Instruments.js

// node_modules/@opentelemetry/sdk-metrics/build/src/Meter.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricStorage.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/HashMap.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/DeltaMetricProcessor.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/TemporalMetricProcessor.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/AsyncMetricStorage.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/RegistrationConflicts.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricStorageRegistry.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MultiWritableMetricStorage.js

// node_modules/@opentelemetry/sdk-metrics/build/src/ObservableResult.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/ObservableRegistry.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/SyncMetricStorage.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/AttributesProcessor.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MeterSharedState.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MeterProviderSharedState.js

// node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricCollector.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/Predicate.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/InstrumentSelector.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/MeterSelector.js

// node_modules/@opentelemetry/sdk-metrics/build/src/view/View.js

// node_modules/@opentelemetry/sdk-metrics/build/src/MeterProvider.js

// node_modules/@opentelemetry/sdk-metrics/build/src/index.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/enums.js
var import_api5, import_core48, import_semantic_conventions2;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/Sampler.js
var SamplingDecision;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOnSampler.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/ParentBasedSampler.js
var import_api6, import_core49;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/TraceIdRatioBasedSampler.js
var import_api7;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/config.js
var import_api8, import_core50, TracesSamplerValues, DEFAULT_RATIO = 1;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/utility.js
var import_core51, DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128, DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/export/BatchSpanProcessorBase.js
var import_api9, import_core52;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/node/export/BatchSpanProcessor.js
var BatchSpanProcessor;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/node/RandomIdGenerator.js
var SHARED_BUFFER;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/node/index.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/index.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/semconv.js

// node_modules/@opentelemetry/sdk-trace-base/build/esm/version.js
var api3, import_core53;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/MultiSpanProcessor.js
var import_core54;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/BasicTracerProvider.js
var import_core55, import_resources2, ForceFlushState;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/export/ConsoleSpanExporter.js
var import_core56;

// node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js

