// function: _temp86
function _temp86(v2) {
  let value = process.env[v2.name], result = validateBoundedIntEnvVar(v2.name, value, v2.default, v2.upperLimit);
  return {
    name: v2.name,
    ...result
  };
}
