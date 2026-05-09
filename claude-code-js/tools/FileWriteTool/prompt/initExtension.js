// function: initExtension
async function initExtension(targetPath = process.cwd(), nonInteractive = !1) {
  let resolvedPath5 = resolve19(targetPath), manifestPath = join35(resolvedPath5, "manifest.json");
  if (existsSync7(manifestPath)) {
    if (nonInteractive)
      return console.log("manifest.json already exists. Use --force to overwrite in non-interactive mode."), !1;
    if (!await esm_default3({
      message: "manifest.json already exists. Overwrite?",
      default: !1
    }))
      return console.log("Cancelled"), !1;
  }
  if (!nonInteractive)
    console.log("This utility will help you create a manifest.json file for your MCPB bundle."), console.log(`Press ^C at any time to quit.
`);
  else
    console.log("Creating manifest.json with default values...");
  try {
    let packageData = readPackageJson(resolvedPath5), basicInfo = nonInteractive ? getDefaultBasicInfo(packageData, resolvedPath5) : await promptBasicInfo(packageData, resolvedPath5), longDescription = nonInteractive ? void 0 : await promptLongDescription(basicInfo.description), authorInfo = nonInteractive ? getDefaultAuthorInfo(packageData) : await promptAuthorInfo(packageData), urls = nonInteractive ? { homepage: "", documentation: "", support: "" } : await promptUrls(), visualAssets = nonInteractive ? { icon: "", icons: [], screenshots: [] } : await promptVisualAssets(), serverConfig = nonInteractive ? getDefaultServerConfig(packageData) : await promptServerConfig(packageData), toolsData = nonInteractive ? { tools: [], toolsGenerated: !1 } : await promptTools(), promptsData = nonInteractive ? { prompts: [], promptsGenerated: !1 } : await promptPrompts(), compatibility = nonInteractive ? void 0 : await promptCompatibility(serverConfig.serverType), userConfig = nonInteractive ? {} : await promptUserConfig(), optionalFields = nonInteractive ? getDefaultOptionalFields(packageData) : await promptOptionalFields(packageData), manifest = buildManifest(basicInfo, longDescription, authorInfo, urls, visualAssets, serverConfig, toolsData.tools, toolsData.toolsGenerated, promptsData.prompts, promptsData.promptsGenerated, compatibility, userConfig, optionalFields);
    return writeFileSync3(manifestPath, JSON.stringify(manifest, null, 2) + `
`), console.log(`
Created manifest.json at ${manifestPath}`), printNextSteps(), !0;
  } catch (error44) {
    if (error44 instanceof Error && error44.message.includes("User force closed"))
      return console.log(`
Cancelled`), !1;
    throw error44;
  }
}
