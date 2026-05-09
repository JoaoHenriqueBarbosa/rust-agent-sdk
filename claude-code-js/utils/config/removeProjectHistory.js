// function: removeProjectHistory
function removeProjectHistory(projects) {
  if (!projects)
    return projects;
  let cleanedProjects = {}, needsCleaning = !1;
  for (let [path9, projectConfig] of Object.entries(projects)) {
    let legacy = projectConfig;
    if (legacy.history !== void 0) {
      needsCleaning = !0;
      let { history, ...cleanedConfig } = legacy;
      cleanedProjects[path9] = cleanedConfig;
    } else
      cleanedProjects[path9] = projectConfig;
  }
  return needsCleaning ? cleanedProjects : projects;
}
