// function: getDefaultEnvironment
function getDefaultEnvironment() {
  let env5 = {};
  for (let key2 of DEFAULT_INHERITED_ENV_VARS) {
    let value = process22.env[key2];
    if (value === void 0)
      continue;
    if (value.startsWith("()"))
      continue;
    env5[key2] = value;
  }
  return env5;
}
