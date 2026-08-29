// Original: src/utils/envValidation.ts
function validateBoundedIntEnvVar(name3, value, defaultValue, upperLimit) {
  if (!value)
    return { effective: defaultValue, status: "valid" };
  let parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    let result = {
      effective: defaultValue,
      status: "invalid",
      message: `Invalid value "${value}" (using default: ${defaultValue})`
    };
    return logForDebugging(`${name3} ${result.message}`), result;
  }
  if (parsed > upperLimit) {
    let result = {
      effective: upperLimit,
      status: "capped",
      message: `Capped from ${parsed} to ${upperLimit}`
    };
    return logForDebugging(`${name3} ${result.message}`), result;
  }
  return { effective: parsed, status: "valid" };
}
var init_envValidation = __esm(() => {
  init_debug();
});
