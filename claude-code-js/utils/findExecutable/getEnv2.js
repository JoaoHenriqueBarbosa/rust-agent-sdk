// function: getEnv2
function getEnv2(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
