// function: expandEnvVars
function expandEnvVars(config10) {
  let missingVars = [];
  function expandString(str2) {
    let { expanded: expanded2, missingVars: vars } = expandEnvVarsInString(str2);
    return missingVars.push(...vars), expanded2;
  }
  let expanded;
  switch (config10.type) {
    case void 0:
    case "stdio": {
      let stdioConfig = config10;
      expanded = {
        ...stdioConfig,
        command: expandString(stdioConfig.command),
        args: stdioConfig.args.map(expandString),
        env: stdioConfig.env ? mapValues_default(stdioConfig.env, expandString) : void 0
      };
      break;
    }
    case "sse":
    case "http":
    case "ws": {
      let remoteConfig = config10;
      expanded = {
        ...remoteConfig,
        url: expandString(remoteConfig.url),
        headers: remoteConfig.headers ? mapValues_default(remoteConfig.headers, expandString) : void 0
      };
      break;
    }
    case "sse-ide":
    case "ws-ide":
      expanded = config10;
      break;
    case "sdk":
      expanded = config10;
      break;
    case "claudeai-proxy":
      expanded = config10;
      break;
  }
  return {
    expanded,
    missingVars: [...new Set(missingVars)]
  };
}
