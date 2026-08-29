// function: validatePluginPaths
async function validatePluginPaths(relPaths, pluginPath, pluginName, source, component, componentLabel, contextLabel, errors8) {
  let checks4 = await Promise.all(relPaths.map(async (relPath) => {
    let fullPath = join100(pluginPath, relPath);
    return { relPath, fullPath, exists: await pathExists(fullPath) };
  })), validPaths = [];
  for (let { relPath, fullPath, exists } of checks4)
    if (exists)
      validPaths.push(fullPath);
    else
      logForDebugging(`${componentLabel} path ${relPath} ${contextLabel} not found at ${fullPath} for ${pluginName}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${fullPath} for ${pluginName}`)), errors8.push({
        type: "path-not-found",
        source,
        plugin: pluginName,
        path: fullPath,
        component
      });
  return validPaths;
}
