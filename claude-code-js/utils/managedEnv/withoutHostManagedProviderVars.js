// function: withoutHostManagedProviderVars
function withoutHostManagedProviderVars(env5) {
  if (!env5)
    return {};
  if (!isEnvTruthy(process.env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST))
    return env5;
  let out = {};
  for (let [key3, value] of Object.entries(env5))
    if (!isProviderManagedEnvVar(key3))
      out[key3] = value;
  return out;
}
