// Original: src/utils/telemetry/instrumentation.ts
var exports_instrumentation = {};
__export(exports_instrumentation, {
  parseExporterTypes: () => parseExporterTypes,
  isTelemetryEnabled: () => isTelemetryEnabled,
  initializeTelemetry: () => initializeTelemetry,
  flushTelemetry: () => flushTelemetry,
  bootstrapTelemetry: () => bootstrapTelemetry
});
function telemetryTimeout(ms, message) {
  return new Promise((_, reject2) => {
    setTimeout((rej, msg) => rej(new TelemetryTimeoutError(msg)), ms, reject2, message).unref();
  });
}
function bootstrapTelemetry() {
  if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE)
    process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta";
}
function parseExporterTypes(value) {
  return (value || "").trim().split(",").filter(Boolean).map((t2) => t2.trim()).filter((t2) => t2 !== "none");
}
async function getOtlpReaders() {
  let exporterTypes = parseExporterTypes(process.env.OTEL_METRICS_EXPORTER), exportInterval = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || DEFAULT_METRICS_EXPORT_INTERVAL_MS.toString()), exporters = [];
  for (let exporterType of exporterTypes)
    if (exporterType === "console") {
      let consoleExporter = new import_sdk_metrics4.ConsoleMetricExporter, originalExport = consoleExporter.export.bind(consoleExporter);
      consoleExporter.export = (metrics, callback) => {
        if (metrics.resource && metrics.resource.attributes)
          logForDebugging(`
=== Resource Attributes ===`), logForDebugging(jsonStringify(metrics.resource.attributes)), logForDebugging(`===========================
`);
        return originalExport(metrics, callback);
      }, exporters.push(consoleExporter);
    } else if (exporterType === "otlp") {
      let protocol = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(), httpConfig = getOTLPExporterConfig();
      switch (protocol) {
        case "grpc": {
          let { OTLPMetricExporter: OTLPMetricExporter2 } = await import("@opentelemetry/exporter-metrics-otlp-grpc");
          exporters.push(new OTLPMetricExporter2);
          break;
        }
        case "http/json": {
          let { OTLPMetricExporter: OTLPMetricExporter2 } = await Promise.resolve().then(() => (init_esm23(), exports_esm3));
          exporters.push(new OTLPMetricExporter2(httpConfig));
          break;
        }
        case "http/protobuf": {
          let { OTLPMetricExporter: OTLPMetricExporter2 } = await import("@opentelemetry/exporter-metrics-otlp-proto");
          exporters.push(new OTLPMetricExporter2(httpConfig));
          break;
        }
        default:
          throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${protocol}`);
      }
    } else if (exporterType === "prometheus") {
      let { PrometheusExporter } = await Promise.resolve().then(() => __toESM(require_src13(), 1));
      exporters.push(new PrometheusExporter);
    } else
      throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${exporterType}`);
  return exporters.map((exporter) => {
    if ("export" in exporter)
      return new import_sdk_metrics4.PeriodicExportingMetricReader({
        exporter,
        exportIntervalMillis: exportInterval
      });
    return exporter;
  });
}
async function getOtlpLogExporters() {
  let exporterTypes = parseExporterTypes(process.env.OTEL_LOGS_EXPORTER), protocol = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(), endpoint7 = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  logForDebugging(`[3P telemetry] getOtlpLogExporters: types=${jsonStringify(exporterTypes)}, protocol=${protocol}, endpoint=${endpoint7}`);
  let exporters = [];
  for (let exporterType of exporterTypes)
    if (exporterType === "console")
      exporters.push(new ConsoleLogRecordExporter);
    else if (exporterType === "otlp") {
      let httpConfig = getOTLPExporterConfig();
      switch (protocol) {
        case "grpc": {
          let { OTLPLogExporter: OTLPLogExporter2 } = await import("@opentelemetry/exporter-logs-otlp-grpc");
          exporters.push(new OTLPLogExporter2);
          break;
        }
        case "http/json": {
          let { OTLPLogExporter: OTLPLogExporter2 } = await Promise.resolve().then(() => (init_esm24(), exports_esm4));
          exporters.push(new OTLPLogExporter2(httpConfig));
          break;
        }
        case "http/protobuf": {
          let { OTLPLogExporter: OTLPLogExporter2 } = await import("@opentelemetry/exporter-logs-otlp-proto");
          exporters.push(new OTLPLogExporter2(httpConfig));
          break;
        }
        default:
          throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${protocol}`);
      }
    } else
      throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${exporterType}`);
  return exporters;
}
async function getOtlpTraceExporters() {
  let exporterTypes = parseExporterTypes(process.env.OTEL_TRACES_EXPORTER), exporters = [];
  for (let exporterType of exporterTypes)
    if (exporterType === "console")
      exporters.push(new ConsoleSpanExporter);
    else if (exporterType === "otlp") {
      let protocol = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(), httpConfig = getOTLPExporterConfig();
      switch (protocol) {
        case "grpc": {
          let { OTLPTraceExporter: OTLPTraceExporter2 } = await import("@opentelemetry/exporter-trace-otlp-grpc");
          exporters.push(new OTLPTraceExporter2);
          break;
        }
        case "http/json": {
          let { OTLPTraceExporter: OTLPTraceExporter2 } = await Promise.resolve().then(() => (init_esm25(), exports_esm5));
          exporters.push(new OTLPTraceExporter2(httpConfig));
          break;
        }
        case "http/protobuf": {
          let { OTLPTraceExporter: OTLPTraceExporter2 } = await import("@opentelemetry/exporter-trace-otlp-proto");
          exporters.push(new OTLPTraceExporter2(httpConfig));
          break;
        }
        default:
          throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${protocol}`);
      }
    } else
      throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${exporterType}`);
  return exporters;
}
function isTelemetryEnabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_TELEMETRY);
}
function getBigQueryExportingReader() {
  let bigqueryExporter = new BigQueryMetricsExporter;
  return new import_sdk_metrics4.PeriodicExportingMetricReader({
    exporter: bigqueryExporter,
    exportIntervalMillis: 300000
  });
}
function isBigQueryMetricsEnabled() {
  let subscriptionType = getSubscriptionType(), isC4EOrTeamUser = isClaudeAISubscriber() && (subscriptionType === "enterprise" || subscriptionType === "team");
  return is1PApiCustomer() || isC4EOrTeamUser;
}
async function initializeBetaTracing(resource) {
  let endpoint7 = process.env.BETA_TRACING_ENDPOINT;
  if (!endpoint7)
    return;
  let [{ OTLPTraceExporter: OTLPTraceExporter2 }, { OTLPLogExporter: OTLPLogExporter2 }] = await Promise.all([
    Promise.resolve().then(() => (init_esm25(), exports_esm5)),
    Promise.resolve().then(() => (init_esm24(), exports_esm4))
  ]), httpConfig = {
    url: `${endpoint7}/v1/traces`
  }, logHttpConfig = {
    url: `${endpoint7}/v1/logs`
  }, traceExporter = new OTLPTraceExporter2(httpConfig), spanProcessor = new BatchSpanProcessor(traceExporter, {
    scheduledDelayMillis: DEFAULT_TRACES_EXPORT_INTERVAL_MS
  }), tracerProvider = new BasicTracerProvider({
    resource,
    spanProcessors: [spanProcessor]
  });
  import_api13.trace.setGlobalTracerProvider(tracerProvider), setTracerProvider(tracerProvider);
  let logExporter = new OTLPLogExporter2(logHttpConfig), loggerProvider = new LoggerProvider({
    resource,
    processors: [
      new BatchLogRecordProcessor(logExporter, {
        scheduledDelayMillis: DEFAULT_LOGS_EXPORT_INTERVAL_MS
      })
    ]
  });
  logs.setGlobalLoggerProvider(loggerProvider), setLoggerProvider(loggerProvider);
  let eventLogger = logs.getLogger("com.anthropic.claude_code.events", "2.1.90");
  setEventLogger(eventLogger), process.on("beforeExit", async () => {
    await loggerProvider?.forceFlush(), await tracerProvider?.forceFlush();
  }), process.on("exit", () => {
    loggerProvider?.forceFlush(), tracerProvider?.forceFlush();
  });
}
async function initializeTelemetry() {
  if (profileCheckpoint("telemetry_init_start"), bootstrapTelemetry(), getHasFormattedOutput())
    for (let key2 of [
      "OTEL_METRICS_EXPORTER",
      "OTEL_LOGS_EXPORTER",
      "OTEL_TRACES_EXPORTER"
    ]) {
      let v2 = process.env[key2];
      if (v2?.includes("console"))
        process.env[key2] = v2.split(",").map((s2) => s2.trim()).filter((s2) => s2 !== "console").join(",");
    }
  import_api13.diag.setLogger(new ClaudeCodeDiagLogger, import_api13.DiagLogLevel.ERROR), initializePerfettoTracing();
  let readers = [], telemetryEnabled = isTelemetryEnabled();
  if (logForDebugging(`[3P telemetry] isTelemetryEnabled=${telemetryEnabled} (CLAUDE_CODE_ENABLE_TELEMETRY=${process.env.CLAUDE_CODE_ENABLE_TELEMETRY})`), telemetryEnabled)
    readers.push(...await getOtlpReaders());
  if (isBigQueryMetricsEnabled())
    readers.push(getBigQueryExportingReader());
  let platform5 = getPlatform(), baseAttributes = {
    [import_semantic_conventions3.ATTR_SERVICE_NAME]: "claude-code",
    [import_semantic_conventions3.ATTR_SERVICE_VERSION]: "2.1.90"
  };
  if (platform5 === "wsl") {
    let wslVersion = getWslVersion();
    if (wslVersion)
      baseAttributes["wsl.version"] = wslVersion;
  }
  let baseResource = import_resources3.resourceFromAttributes(baseAttributes), osResource = import_resources3.resourceFromAttributes(import_resources3.osDetector.detect().attributes || {}), hostDetected = import_resources3.hostDetector.detect(), hostArchAttributes = hostDetected.attributes?.[import_semantic_conventions3.SEMRESATTRS_HOST_ARCH] ? {
    [import_semantic_conventions3.SEMRESATTRS_HOST_ARCH]: hostDetected.attributes[import_semantic_conventions3.SEMRESATTRS_HOST_ARCH]
  } : {}, hostArchResource = import_resources3.resourceFromAttributes(hostArchAttributes), envResource = import_resources3.resourceFromAttributes(import_resources3.envDetector.detect().attributes || {}), resource = baseResource.merge(osResource).merge(hostArchResource).merge(envResource);
  if (isBetaTracingEnabled()) {
    initializeBetaTracing(resource).catch((e) => logForDebugging(`Beta tracing init failed: ${e}`, { level: "error" }));
    let meterProvider2 = new import_sdk_metrics4.MeterProvider({
      resource,
      views: [],
      readers
    });
    return setMeterProvider(meterProvider2), registerCleanup(async () => {
      let timeoutMs = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
      try {
        endInteractionSpan();
        let loggerProvider = getLoggerProvider(), tracerProvider = getTracerProvider(), chains = [meterProvider2.shutdown()];
        if (loggerProvider)
          chains.push(loggerProvider.forceFlush().then(() => loggerProvider.shutdown()));
        if (tracerProvider)
          chains.push(tracerProvider.forceFlush().then(() => tracerProvider.shutdown()));
        await Promise.race([
          Promise.all(chains),
          telemetryTimeout(timeoutMs, "OpenTelemetry shutdown timeout")
        ]);
      } catch {}
    }), meterProvider2.getMeter("com.anthropic.claude_code", "2.1.90");
  }
  let meterProvider = new import_sdk_metrics4.MeterProvider({
    resource,
    views: [],
    readers
  });
  if (setMeterProvider(meterProvider), telemetryEnabled) {
    let logExporters = await getOtlpLogExporters();
    if (logForDebugging(`[3P telemetry] Created ${logExporters.length} log exporter(s)`), logExporters.length > 0) {
      let loggerProvider = new LoggerProvider({
        resource,
        processors: logExporters.map((exporter) => new BatchLogRecordProcessor(exporter, {
          scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || DEFAULT_LOGS_EXPORT_INTERVAL_MS.toString())
        }))
      });
      logs.setGlobalLoggerProvider(loggerProvider), setLoggerProvider(loggerProvider);
      let eventLogger = logs.getLogger("com.anthropic.claude_code.events", "2.1.90");
      setEventLogger(eventLogger), logForDebugging("[3P telemetry] Event logger set successfully"), process.on("beforeExit", async () => {
        await loggerProvider?.forceFlush(), await getTracerProvider()?.forceFlush();
      }), process.on("exit", () => {
        loggerProvider?.forceFlush(), getTracerProvider()?.forceFlush();
      });
    }
  }
  if (telemetryEnabled && isEnhancedTelemetryEnabled()) {
    let traceExporters = await getOtlpTraceExporters();
    if (traceExporters.length > 0) {
      let spanProcessors = traceExporters.map((exporter) => new BatchSpanProcessor(exporter, {
        scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || DEFAULT_TRACES_EXPORT_INTERVAL_MS.toString())
      })), tracerProvider = new BasicTracerProvider({
        resource,
        spanProcessors
      });
      import_api13.trace.setGlobalTracerProvider(tracerProvider), setTracerProvider(tracerProvider);
    }
  }
  return registerCleanup(async () => {
    let timeoutMs = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
    try {
      endInteractionSpan();
      let shutdownPromises = [meterProvider.shutdown()], loggerProvider = getLoggerProvider();
      if (loggerProvider)
        shutdownPromises.push(loggerProvider.shutdown());
      let tracerProvider = getTracerProvider();
      if (tracerProvider)
        shutdownPromises.push(tracerProvider.shutdown());
      await Promise.race([
        Promise.all(shutdownPromises),
        telemetryTimeout(timeoutMs, "OpenTelemetry shutdown timeout")
      ]);
    } catch (error44) {
      if (error44 instanceof Error && error44.message.includes("timeout"))
        logForDebugging(`
OpenTelemetry telemetry flush timed out after ${timeoutMs}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${timeoutMs}ms
`, { level: "error" });
      throw error44;
    }
  }), meterProvider.getMeter("com.anthropic.claude_code", "2.1.90");
}
async function flushTelemetry() {
  let meterProvider = getMeterProvider();
  if (!meterProvider)
    return;
  let timeoutMs = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
  try {
    let flushPromises = [meterProvider.forceFlush()], loggerProvider = getLoggerProvider();
    if (loggerProvider)
      flushPromises.push(loggerProvider.forceFlush());
    let tracerProvider = getTracerProvider();
    if (tracerProvider)
      flushPromises.push(tracerProvider.forceFlush());
    await Promise.race([
      Promise.all(flushPromises),
      telemetryTimeout(timeoutMs, "OpenTelemetry flush timeout")
    ]), logForDebugging("Telemetry flushed successfully");
  } catch (error44) {
    if (error44 instanceof TelemetryTimeoutError)
      logForDebugging(`Telemetry flush timed out after ${timeoutMs}ms. Some metrics may not be exported.`, { level: "warn" });
    else
      logForDebugging(`Telemetry flush failed: ${errorMessage(error44)}`, {
        level: "error"
      });
  }
}
function parseOtelHeadersEnvVar() {
  let headers = {}, envHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (envHeaders)
    for (let pair of envHeaders.split(",")) {
      let [key2, ...valueParts] = pair.split("=");
      if (key2 && valueParts.length > 0)
        headers[key2.trim()] = valueParts.join("=").trim();
    }
  return headers;
}
function getOTLPExporterConfig() {
  let proxyUrl = getProxyUrl(), mtlsConfig = getMTLSConfig(), settings = getSettings_DEPRECATED(), config10 = {}, staticHeaders = parseOtelHeadersEnvVar();
  if (settings?.otelHeadersHelper)
    config10.headers = async () => {
      let dynamicHeaders = getOtelHeadersFromHelper();
      return { ...staticHeaders, ...dynamicHeaders };
    };
  else if (Object.keys(staticHeaders).length > 0)
    config10.headers = async () => staticHeaders;
  let otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!proxyUrl || otelEndpoint && shouldBypassProxy(otelEndpoint)) {
    let caCerts2 = getCACertificates();
    if (mtlsConfig || caCerts2)
      config10.httpAgentOptions = {
        ...mtlsConfig,
        ...caCerts2 && { ca: caCerts2 }
      };
    return config10;
  }
  let caCerts = getCACertificates(), agentFactory = (_protocol) => {
    return mtlsConfig || caCerts ? new import_https_proxy_agent3.HttpsProxyAgent(proxyUrl, {
      ...mtlsConfig && {
        cert: mtlsConfig.cert,
        key: mtlsConfig.key,
        passphrase: mtlsConfig.passphrase
      },
      ...caCerts && { ca: caCerts }
    }) : new import_https_proxy_agent3.HttpsProxyAgent(proxyUrl);
  };
  return config10.httpAgentOptions = agentFactory, config10;
}
var import_api13, import_resources3, import_sdk_metrics4, import_semantic_conventions3, import_https_proxy_agent3, DEFAULT_METRICS_EXPORT_INTERVAL_MS = 60000, DEFAULT_LOGS_EXPORT_INTERVAL_MS = 5000, DEFAULT_TRACES_EXPORT_INTERVAL_MS = 5000, TelemetryTimeoutError;
var init_instrumentation = __esm(() => {
  init_esm19();
  init_esm20();
  init_esm21();
  init_state();
  init_auth14();
  init_platform();
  init_caCerts();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_mtls();
  init_proxy();
  init_settings2();
  init_slowOperations();
  init_startupProfiler();
  init_betaSessionTracing();
  init_bigqueryExporter();
  init_logger8();
  init_perfettoTracing();
  init_sessionTracing();
  import_api13 = __toESM(require_src7(), 1), import_resources3 = __toESM(require_src10(), 1), import_sdk_metrics4 = __toESM(require_src11(), 1), import_semantic_conventions3 = __toESM(require_src8(), 1), import_https_proxy_agent3 = __toESM(require_dist2(), 1);
  TelemetryTimeoutError = class TelemetryTimeoutError extends Error {
  };
});
