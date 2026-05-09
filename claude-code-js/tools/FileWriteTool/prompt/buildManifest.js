// function: buildManifest
function buildManifest(basicInfo, longDescription, authorInfo, urls, visualAssets, serverConfig, tools, toolsGenerated, prompts, promptsGenerated, compatibility, userConfig, optionalFields) {
  let { name: name3, displayName, version: version5, description, authorName } = basicInfo, { authorEmail, authorUrl } = authorInfo, { serverType, entryPoint, mcp_config } = serverConfig, { keywords, license, repository } = optionalFields;
  return {
    manifest_version: DEFAULT_MANIFEST_VERSION,
    name: name3,
    ...displayName && displayName !== name3 ? { display_name: displayName } : {},
    version: version5,
    description,
    ...longDescription ? { long_description: longDescription } : {},
    author: {
      name: authorName,
      ...authorEmail ? { email: authorEmail } : {},
      ...authorUrl ? { url: authorUrl } : {}
    },
    ...urls.homepage ? { homepage: urls.homepage } : {},
    ...urls.documentation ? { documentation: urls.documentation } : {},
    ...urls.support ? { support: urls.support } : {},
    ...visualAssets.icon ? { icon: visualAssets.icon } : {},
    ...visualAssets.icons.length > 0 ? { icons: visualAssets.icons } : {},
    ...visualAssets.screenshots.length > 0 ? { screenshots: visualAssets.screenshots } : {},
    server: {
      type: serverType,
      entry_point: entryPoint,
      mcp_config
    },
    ...tools.length > 0 ? { tools } : {},
    ...toolsGenerated ? { tools_generated: !0 } : {},
    ...prompts.length > 0 ? { prompts } : {},
    ...promptsGenerated ? { prompts_generated: !0 } : {},
    ...compatibility ? { compatibility } : {},
    ...Object.keys(userConfig).length > 0 ? { user_config: userConfig } : {},
    ...keywords ? {
      keywords: keywords.split(",").map((k3) => k3.trim()).filter((k3) => k3)
    } : {},
    ...license ? { license } : {},
    ...repository ? { repository } : {}
  };
}
