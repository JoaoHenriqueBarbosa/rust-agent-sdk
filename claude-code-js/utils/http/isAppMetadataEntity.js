// function: isAppMetadataEntity
function isAppMetadataEntity(key, entity) {
  if (!entity)
    return !1;
  return key.indexOf(APP_METADATA) === 0 && entity.hasOwnProperty("clientId") && entity.hasOwnProperty("environment");
}
