// function: withoutCcdSpawnEnvKeys
function withoutCcdSpawnEnvKeys(env5) {
  if (!env5 || !ccdSpawnEnvKeys)
    return env5 || {};
  let out = {};
  for (let [key3, value] of Object.entries(env5))
    if (!ccdSpawnEnvKeys.has(key3))
      out[key3] = value;
  return out;
}
