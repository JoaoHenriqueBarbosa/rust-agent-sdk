// function: isServerTelemetryEntity
function isServerTelemetryEntity(key, entity) {
  let validateKey = key.indexOf(SERVER_TELEM_CACHE_KEY) === 0, validateEntity = !0;
  if (entity)
    validateEntity = entity.hasOwnProperty("failedRequests") && entity.hasOwnProperty("errors") && entity.hasOwnProperty("cacheHits");
  return validateKey && validateEntity;
}
