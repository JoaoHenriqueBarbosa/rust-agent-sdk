// function: cachePlugin
async function cachePlugin(source, options2) {
  let cachePath = getPluginCachePath();
  await getFsImplementation().mkdir(cachePath);
  let tempName = generateTemporaryCacheNameForPlugin(source), tempPath = join100(cachePath, tempName), shouldCleanup = !1, gitCommitSha;
  try {
    if (logForDebugging(`Caching plugin from source: ${jsonStringify(source)} to temporary path ${tempPath}`), shouldCleanup = !0, typeof source === "string")
      await installFromLocal(source, tempPath);
    else
      switch (source.source) {
        case "npm":
          await installFromNpm(source.package, tempPath, {
            registry: source.registry,
            version: source.version
          });
          break;
        case "github":
          await installFromGitHub(source.repo, tempPath, source.ref, source.sha);
          break;
        case "url":
          await installFromGit(source.url, tempPath, source.ref, source.sha);
          break;
        case "git-subdir":
          gitCommitSha = await installFromGitSubdir(source.url, tempPath, source.path, source.ref, source.sha);
          break;
        case "pip":
          throw Error("Python package plugins are not yet supported");
        default:
          throw Error("Unsupported plugin source type");
      }
  } catch (error44) {
    if (shouldCleanup && await pathExists(tempPath)) {
      logForDebugging(`Cleaning up failed installation at ${tempPath}`);
      try {
        await rm11(tempPath, { recursive: !0, force: !0 });
      } catch (cleanupError) {
        logForDebugging(`Failed to clean up installation: ${cleanupError}`, {
          level: "error"
        });
      }
    }
    throw error44;
  }
  let manifestPath = join100(tempPath, ".claude-plugin", "plugin.json"), legacyManifestPath = join100(tempPath, "plugin.json"), manifest;
  if (await pathExists(manifestPath))
    try {
      let content = await readFile35(manifestPath, { encoding: "utf-8" }), parsed = jsonParse(content), result = PluginManifestSchema().safeParse(parsed);
      if (result.success)
        manifest = result.data;
      else {
        let errors8 = result.error.issues.map((err2) => `${err2.path.join(".")}: ${err2.message}`).join(", ");
        throw logForDebugging(`Invalid manifest at ${manifestPath}: ${errors8}`, {
          level: "error"
        }), Error(`Plugin has an invalid manifest file at ${manifestPath}. Validation errors: ${errors8}`);
      }
    } catch (error44) {
      if (error44 instanceof Error && error44.message.includes("invalid manifest file"))
        throw error44;
      let errorMsg = errorMessage(error44);
      throw logForDebugging(`Failed to parse manifest at ${manifestPath}: ${errorMsg}`, {
        level: "error"
      }), Error(`Plugin has a corrupt manifest file at ${manifestPath}. JSON parse error: ${errorMsg}`);
    }
  else if (await pathExists(legacyManifestPath))
    try {
      let content = await readFile35(legacyManifestPath, {
        encoding: "utf-8"
      }), parsed = jsonParse(content), result = PluginManifestSchema().safeParse(parsed);
      if (result.success)
        manifest = result.data;
      else {
        let errors8 = result.error.issues.map((err2) => `${err2.path.join(".")}: ${err2.message}`).join(", ");
        throw logForDebugging(`Invalid legacy manifest at ${legacyManifestPath}: ${errors8}`, { level: "error" }), Error(`Plugin has an invalid manifest file at ${legacyManifestPath}. Validation errors: ${errors8}`);
      }
    } catch (error44) {
      if (error44 instanceof Error && error44.message.includes("invalid manifest file"))
        throw error44;
      let errorMsg = errorMessage(error44);
      throw logForDebugging(`Failed to parse legacy manifest at ${legacyManifestPath}: ${errorMsg}`, {
        level: "error"
      }), Error(`Plugin has a corrupt manifest file at ${legacyManifestPath}. JSON parse error: ${errorMsg}`);
    }
  else
    manifest = options2?.manifest || {
      name: tempName,
      description: `Plugin cached from ${typeof source === "string" ? source : source.source}`
    };
  let finalName = manifest.name.replace(/[^a-zA-Z0-9-_]/g, "-"), finalPath = join100(cachePath, finalName);
  if (await pathExists(finalPath))
    logForDebugging(`Removing old cached version at ${finalPath}`), await rm11(finalPath, { recursive: !0, force: !0 });
  return await rename6(tempPath, finalPath), logForDebugging(`Successfully cached plugin ${manifest.name} to ${finalPath}`), {
    path: finalPath,
    manifest,
    ...gitCommitSha && { gitCommitSha }
  };
}
