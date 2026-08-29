// class: ServerTelemetryManager
class ServerTelemetryManager {
  constructor(telemetryRequest, cacheManager) {
    this.cacheOutcome = CacheOutcome.NOT_APPLICABLE, this.cacheManager = cacheManager, this.apiId = telemetryRequest.apiId, this.correlationId = telemetryRequest.correlationId, this.wrapperSKU = telemetryRequest.wrapperSKU || "", this.wrapperVer = telemetryRequest.wrapperVer || "", this.telemetryCacheKey = SERVER_TELEM_CACHE_KEY + CACHE_KEY_SEPARATOR + telemetryRequest.clientId;
  }
  generateCurrentRequestHeaderValue() {
    let request2 = `${this.apiId}${SERVER_TELEM_VALUE_SEPARATOR}${this.cacheOutcome}`, platformFieldsArr = [this.wrapperSKU, this.wrapperVer], nativeBrokerErrorCode = this.getNativeBrokerErrorCode();
    if (nativeBrokerErrorCode?.length)
      platformFieldsArr.push(`broker_error=${nativeBrokerErrorCode}`);
    let platformFields = platformFieldsArr.join(SERVER_TELEM_VALUE_SEPARATOR), regionDiscoveryFields = this.getRegionDiscoveryFields(), requestWithRegionDiscoveryFields = [
      request2,
      regionDiscoveryFields
    ].join(SERVER_TELEM_VALUE_SEPARATOR);
    return [
      SERVER_TELEM_SCHEMA_VERSION,
      requestWithRegionDiscoveryFields,
      platformFields
    ].join(SERVER_TELEM_CATEGORY_SEPARATOR);
  }
  generateLastRequestHeaderValue() {
    let lastRequests = this.getLastRequests(), maxErrors = ServerTelemetryManager.maxErrorsToSend(lastRequests), failedRequests = lastRequests.failedRequests.slice(0, 2 * maxErrors).join(SERVER_TELEM_VALUE_SEPARATOR), errors6 = lastRequests.errors.slice(0, maxErrors).join(SERVER_TELEM_VALUE_SEPARATOR), errorCount = lastRequests.errors.length, overflow = maxErrors < errorCount ? SERVER_TELEM_OVERFLOW_TRUE : SERVER_TELEM_OVERFLOW_FALSE, platformFields = [errorCount, overflow].join(SERVER_TELEM_VALUE_SEPARATOR);
    return [
      SERVER_TELEM_SCHEMA_VERSION,
      lastRequests.cacheHits,
      failedRequests,
      errors6,
      platformFields
    ].join(SERVER_TELEM_CATEGORY_SEPARATOR);
  }
  cacheFailedRequest(error43) {
    let lastRequests = this.getLastRequests();
    if (lastRequests.errors.length >= SERVER_TELEM_MAX_CACHED_ERRORS)
      lastRequests.failedRequests.shift(), lastRequests.failedRequests.shift(), lastRequests.errors.shift();
    if (lastRequests.failedRequests.push(this.apiId, this.correlationId), error43 instanceof Error && !!error43 && error43.toString())
      if (error43 instanceof AuthError)
        if (error43.subError)
          lastRequests.errors.push(error43.subError);
        else if (error43.errorCode)
          lastRequests.errors.push(error43.errorCode);
        else
          lastRequests.errors.push(error43.toString());
      else
        lastRequests.errors.push(error43.toString());
    else
      lastRequests.errors.push(SERVER_TELEM_UNKNOWN_ERROR);
    this.cacheManager.setServerTelemetry(this.telemetryCacheKey, lastRequests, this.correlationId);
    return;
  }
  incrementCacheHits() {
    let lastRequests = this.getLastRequests();
    return lastRequests.cacheHits += 1, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, lastRequests, this.correlationId), lastRequests.cacheHits;
  }
  getLastRequests() {
    let initialValue = {
      failedRequests: [],
      errors: [],
      cacheHits: 0
    };
    return this.cacheManager.getServerTelemetry(this.telemetryCacheKey, this.correlationId) || initialValue;
  }
  clearTelemetryCache() {
    let lastRequests = this.getLastRequests(), numErrorsFlushed = ServerTelemetryManager.maxErrorsToSend(lastRequests), errorCount = lastRequests.errors.length;
    if (numErrorsFlushed === errorCount)
      this.cacheManager.removeItem(this.telemetryCacheKey, this.correlationId);
    else {
      let serverTelemEntity = {
        failedRequests: lastRequests.failedRequests.slice(numErrorsFlushed * 2),
        errors: lastRequests.errors.slice(numErrorsFlushed),
        cacheHits: 0
      };
      this.cacheManager.setServerTelemetry(this.telemetryCacheKey, serverTelemEntity, this.correlationId);
    }
  }
  static maxErrorsToSend(serverTelemetryEntity) {
    let i4, maxErrors = 0, dataSize = 0, errorCount = serverTelemetryEntity.errors.length;
    for (i4 = 0;i4 < errorCount; i4++) {
      let apiId = serverTelemetryEntity.failedRequests[2 * i4] || "", correlationId = serverTelemetryEntity.failedRequests[2 * i4 + 1] || "", errorCode = serverTelemetryEntity.errors[i4] || "";
      if (dataSize += apiId.toString().length + correlationId.toString().length + errorCode.length + 3, dataSize < SERVER_TELEM_MAX_LAST_HEADER_BYTES)
        maxErrors += 1;
      else
        break;
    }
    return maxErrors;
  }
  getRegionDiscoveryFields() {
    let regionDiscoveryFields = [];
    return regionDiscoveryFields.push(this.regionUsed || ""), regionDiscoveryFields.push(this.regionSource || ""), regionDiscoveryFields.push(this.regionOutcome || ""), regionDiscoveryFields.join(",");
  }
  updateRegionDiscoveryMetadata(regionDiscoveryMetadata) {
    this.regionUsed = regionDiscoveryMetadata.region_used, this.regionSource = regionDiscoveryMetadata.region_source, this.regionOutcome = regionDiscoveryMetadata.region_outcome;
  }
  setCacheOutcome(cacheOutcome) {
    this.cacheOutcome = cacheOutcome;
  }
  setNativeBrokerErrorCode(errorCode) {
    let lastRequests = this.getLastRequests();
    lastRequests.nativeBrokerErrorCode = errorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, lastRequests, this.correlationId);
  }
  getNativeBrokerErrorCode() {
    return this.getLastRequests().nativeBrokerErrorCode;
  }
  clearNativeBrokerErrorCode() {
    let lastRequests = this.getLastRequests();
    delete lastRequests.nativeBrokerErrorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, lastRequests, this.correlationId);
  }
  static makeExtraSkuString(params) {
    return makeExtraSkuString(params);
  }
}
