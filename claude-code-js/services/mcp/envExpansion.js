// Original: src/services/mcp/envExpansion.ts
function expandEnvVarsInString(value) {
  let missingVars = [];
  return {
    expanded: value.replace(/\$\{([^}]+)\}/g, (match, varContent) => {
      let [varName, defaultValue] = varContent.split(":-", 2), envValue = process.env[varName];
      if (envValue !== void 0)
        return envValue;
      if (defaultValue !== void 0)
        return defaultValue;
      return missingVars.push(varName), match;
    }),
    missingVars
  };
}
