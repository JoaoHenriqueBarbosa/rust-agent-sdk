// function: parseEnvVars
function parseEnvVars(rawEnvArgs) {
  let parsedEnv = {};
  if (rawEnvArgs)
    for (let envStr of rawEnvArgs) {
      let [key, ...valueParts] = envStr.split("=");
      if (!key || valueParts.length === 0)
        throw Error(`Invalid environment variable format: ${envStr}, environment variables should be added as: -e KEY1=value1 -e KEY2=value2`);
      parsedEnv[key] = valueParts.join("=");
    }
  return parsedEnv;
}
