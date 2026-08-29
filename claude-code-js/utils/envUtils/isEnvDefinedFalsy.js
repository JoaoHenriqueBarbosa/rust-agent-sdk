// function: isEnvDefinedFalsy
function isEnvDefinedFalsy(envVar) {
  if (envVar === void 0)
    return !1;
  if (typeof envVar === "boolean")
    return !envVar;
  if (!envVar)
    return !1;
  let normalizedValue = envVar.toLowerCase().trim();
  return ["0", "false", "no", "off"].includes(normalizedValue);
}
