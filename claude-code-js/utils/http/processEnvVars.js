// function: processEnvVars
function processEnvVars(supportedEnvVars) {
  return supportedEnvVars.reduce((acc, envVariable) => {
    if (process.env[envVariable])
      acc.assigned.push(envVariable);
    else
      acc.missing.push(envVariable);
    return acc;
  }, { missing: [], assigned: [] });
}
