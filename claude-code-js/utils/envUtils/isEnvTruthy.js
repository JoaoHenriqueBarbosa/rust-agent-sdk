// function: isEnvTruthy
function isEnvTruthy(envVar) {
  if (!envVar)
    return !1;
  if (typeof envVar === "boolean")
    return envVar;
  let normalizedValue = envVar.toLowerCase().trim();
  return ["1", "true", "yes", "on"].includes(normalizedValue);
}
