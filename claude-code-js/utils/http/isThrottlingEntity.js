// function: isThrottlingEntity
function isThrottlingEntity(key, entity) {
  let validateKey = !1;
  if (key)
    validateKey = key.indexOf(THROTTLING_PREFIX) === 0;
  let validateEntity = !0;
  if (entity)
    validateEntity = entity.hasOwnProperty("throttleTime");
  return validateKey && validateEntity;
}
