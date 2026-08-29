// function: validateRequiredEnvVars
function validateRequiredEnvVars(options) {
  if (options?.requiredEnvVars) {
    let missing = (Array.isArray(options.requiredEnvVars) ? options.requiredEnvVars : [options.requiredEnvVars]).filter((envVar) => !process.env[envVar]);
    if (missing.length > 0) {
      let errorMessage2 = `Required environment ${missing.length === 1 ? "variable" : "variables"} '${missing.join(", ")}' for DefaultAzureCredential ${missing.length === 1 ? "is" : "are"} not set or empty.`;
      throw logger28.warning(errorMessage2), Error(errorMessage2);
    }
  }
}
