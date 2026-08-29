// var: require_PrometheusSerializer
var require_PrometheusSerializer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PrometheusSerializer = void 0;
  var api_1 = require_src7(), sdk_metrics_1 = require_src11(), core_1 = require_src9(), semantic_conventions_1 = require_src8(), ATTR_OTEL_SCOPE_SCHEMA_URL = "otel.scope.schema_url";
  function escapeString(str2) {
    return str2.replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
  }
  function escapeAttributeValue(str2 = "") {
    if (typeof str2 !== "string")
      str2 = JSON.stringify(str2);
    return escapeString(str2).replace(/"/g, "\\\"");
  }
  var invalidCharacterRegex = /[^a-z0-9_]/gi, multipleUnderscoreRegex = /_{2,}/g;
  function sanitizePrometheusMetricName(name3) {
    return name3.replace(invalidCharacterRegex, "_").replace(multipleUnderscoreRegex, "_");
  }
  function enforcePrometheusNamingConvention(name3, data) {
    if (!name3.endsWith("_total") && data.dataPointType === sdk_metrics_1.DataPointType.SUM && data.isMonotonic)
      name3 = name3 + "_total";
    return name3;
  }
  function valueString(value) {
    if (value === 1 / 0)
      return "+Inf";
    else if (value === -1 / 0)
      return "-Inf";
    else
      return `${value}`;
  }
  function toPrometheusType(metricData) {
    switch (metricData.dataPointType) {
      case sdk_metrics_1.DataPointType.SUM:
        if (metricData.isMonotonic)
          return "counter";
        return "gauge";
      case sdk_metrics_1.DataPointType.GAUGE:
        return "gauge";
      case sdk_metrics_1.DataPointType.HISTOGRAM:
        return "histogram";
      default:
        return "untyped";
    }
  }
  function stringify2(metricName, attributes, value, timestamp, additionalAttributes) {
    let hasAttribute = !1, attributesStr = "";
    for (let [key2, val] of Object.entries(attributes)) {
      let sanitizedAttributeName = sanitizePrometheusMetricName(key2);
      hasAttribute = !0, attributesStr += `${attributesStr.length > 0 ? "," : ""}${sanitizedAttributeName}="${escapeAttributeValue(val)}"`;
    }
    if (additionalAttributes)
      for (let [key2, val] of Object.entries(additionalAttributes)) {
        let sanitizedAttributeName = sanitizePrometheusMetricName(key2);
        hasAttribute = !0, attributesStr += `${attributesStr.length > 0 ? "," : ""}${sanitizedAttributeName}="${escapeAttributeValue(val)}"`;
      }
    if (hasAttribute)
      metricName += `{${attributesStr}}`;
    return `${metricName} ${valueString(value)}${timestamp !== void 0 ? " " + String(timestamp) : ""}
`;
  }
  var NO_REGISTERED_METRICS = "# no registered metrics";

  class PrometheusSerializer {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    _withoutScopeInfo;
    _withoutTargetInfo;
    constructor(prefix, appendTimestamp = !1, withResourceConstantLabels, withoutTargetInfo, withoutScopeInfo) {
      if (prefix)
        this._prefix = prefix + "_";
      this._appendTimestamp = appendTimestamp, this._withResourceConstantLabels = withResourceConstantLabels, this._withoutScopeInfo = !!withoutScopeInfo, this._withoutTargetInfo = !!withoutTargetInfo;
    }
    serialize(resourceMetrics) {
      let str2 = "";
      this._additionalAttributes = this._filterResourceConstantLabels(resourceMetrics.resource.attributes, this._withResourceConstantLabels);
      for (let scopeMetrics of resourceMetrics.scopeMetrics)
        str2 += this._serializeScopeMetrics(scopeMetrics);
      if (str2 === "")
        str2 += NO_REGISTERED_METRICS;
      return this._serializeResource(resourceMetrics.resource) + str2;
    }
    _filterResourceConstantLabels(attributes, pattern) {
      if (pattern) {
        let filteredAttributes = {};
        for (let [key2, value] of Object.entries(attributes))
          if (key2.match(pattern))
            filteredAttributes[key2] = value;
        return filteredAttributes;
      }
      return;
    }
    _serializeScopeMetrics(scopeMetrics) {
      let str2 = "";
      for (let metric of scopeMetrics.metrics)
        str2 += this._serializeMetricData(metric, scopeMetrics.scope) + `
`;
      return str2;
    }
    _serializeMetricData(metricData, scope) {
      let name3 = sanitizePrometheusMetricName(escapeString(metricData.descriptor.name));
      if (this._prefix)
        name3 = `${this._prefix}${name3}`;
      let dataPointType = metricData.dataPointType;
      name3 = enforcePrometheusNamingConvention(name3, metricData);
      let help = `# HELP ${name3} ${escapeString(metricData.descriptor.description || "description missing")}`, unit = metricData.descriptor.unit ? `
# UNIT ${name3} ${escapeString(metricData.descriptor.unit)}` : "", type = `# TYPE ${name3} ${toPrometheusType(metricData)}`, additionalAttributes;
      if (this._withoutScopeInfo)
        additionalAttributes = this._additionalAttributes;
      else {
        let scopeInfo = { [semantic_conventions_1.ATTR_OTEL_SCOPE_NAME]: scope.name };
        if (scope.schemaUrl)
          scopeInfo[ATTR_OTEL_SCOPE_SCHEMA_URL] = scope.schemaUrl;
        if (scope.version)
          scopeInfo[semantic_conventions_1.ATTR_OTEL_SCOPE_VERSION] = scope.version;
        additionalAttributes = Object.assign(scopeInfo, this._additionalAttributes);
      }
      let results = "";
      switch (dataPointType) {
        case sdk_metrics_1.DataPointType.SUM:
        case sdk_metrics_1.DataPointType.GAUGE: {
          results = metricData.dataPoints.map((it) => this._serializeSingularDataPoint(name3, metricData, it, additionalAttributes)).join("");
          break;
        }
        case sdk_metrics_1.DataPointType.HISTOGRAM: {
          results = metricData.dataPoints.map((it) => this._serializeHistogramDataPoint(name3, metricData, it, additionalAttributes)).join("");
          break;
        }
        default:
          api_1.diag.error(`Unrecognizable DataPointType: ${dataPointType} for metric "${name3}"`);
      }
      return `${help}${unit}
${type}
${results}`.trim();
    }
    _serializeSingularDataPoint(name3, data, dataPoint, additionalAttributes) {
      let results = "";
      name3 = enforcePrometheusNamingConvention(name3, data);
      let { value, attributes } = dataPoint, timestamp = (0, core_1.hrTimeToMilliseconds)(dataPoint.endTime);
      return results += stringify2(name3, attributes, value, this._appendTimestamp ? timestamp : void 0, additionalAttributes), results;
    }
    _serializeHistogramDataPoint(name3, data, dataPoint, additionalAttributes) {
      let results = "";
      name3 = enforcePrometheusNamingConvention(name3, data);
      let { attributes, value: histogram } = dataPoint, timestamp = (0, core_1.hrTimeToMilliseconds)(dataPoint.endTime);
      for (let key2 of ["count", "sum"]) {
        let value = histogram[key2];
        if (value != null)
          results += stringify2(name3 + "_" + key2, attributes, value, this._appendTimestamp ? timestamp : void 0, additionalAttributes);
      }
      let cumulativeSum = 0, countEntries = histogram.buckets.counts.entries(), infiniteBoundaryDefined = !1;
      for (let [idx, val] of countEntries) {
        cumulativeSum += val;
        let upperBound = histogram.buckets.boundaries[idx];
        if (upperBound === void 0 && infiniteBoundaryDefined)
          break;
        if (upperBound === 1 / 0)
          infiniteBoundaryDefined = !0;
        results += stringify2(name3 + "_bucket", attributes, cumulativeSum, this._appendTimestamp ? timestamp : void 0, Object.assign({}, additionalAttributes, {
          le: upperBound === void 0 || upperBound === 1 / 0 ? "+Inf" : String(upperBound)
        }));
      }
      return results;
    }
    _serializeResource(resource) {
      if (this._withoutTargetInfo === !0)
        return "";
      let name3 = "target_info", help = `# HELP ${name3} Target metadata`, type = `# TYPE ${name3} gauge`, results = stringify2(name3, resource.attributes, 1).trim();
      return `${help}
${type}
${results}
`;
    }
  }
  exports.PrometheusSerializer = PrometheusSerializer;
});
