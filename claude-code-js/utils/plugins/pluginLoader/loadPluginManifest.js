// function: loadPluginManifest
async function loadPluginManifest(manifestPath, pluginName, source) {
  if (!await pathExists(manifestPath))
    return {
      name: pluginName,
      description: `Plugin from ${source}`
    };
  try {
    let content = await readFile35(manifestPath, { encoding: "utf-8" }), parsedJson = jsonParse(content), result = PluginManifestSchema().safeParse(parsedJson);
    if (result.success)
      return result.data;
    let errors8 = result.error.issues.map((err2) => err2.path.length > 0 ? `${err2.path.join(".")}: ${err2.message}` : err2.message).join(", ");
    throw logForDebugging(`Plugin ${pluginName} has an invalid manifest file at ${manifestPath}. Validation errors: ${errors8}`, { level: "error" }), Error(`Plugin ${pluginName} has an invalid manifest file at ${manifestPath}.

Validation errors: ${errors8}`);
  } catch (error44) {
    if (error44 instanceof Error && error44.message.includes("invalid manifest file"))
      throw error44;
    let errorMsg = errorMessage(error44);
    throw logForDebugging(`Plugin ${pluginName} has a corrupt manifest file at ${manifestPath}. Parse error: ${errorMsg}`, { level: "error" }), Error(`Plugin ${pluginName} has a corrupt manifest file at ${manifestPath}.

JSON parse error: ${errorMsg}`);
  }
}
