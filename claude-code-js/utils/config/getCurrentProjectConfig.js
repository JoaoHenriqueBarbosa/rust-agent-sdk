// function: getCurrentProjectConfig
function getCurrentProjectConfig() {
  let absolutePath = getProjectPathForConfig(), config5 = getGlobalConfig();
  if (!config5.projects)
    return DEFAULT_PROJECT_CONFIG;
  let projectConfig = config5.projects[absolutePath] ?? DEFAULT_PROJECT_CONFIG;
  if (typeof projectConfig.allowedTools === "string")
    projectConfig.allowedTools = safeParseJSON(projectConfig.allowedTools) ?? [];
  return projectConfig;
}
