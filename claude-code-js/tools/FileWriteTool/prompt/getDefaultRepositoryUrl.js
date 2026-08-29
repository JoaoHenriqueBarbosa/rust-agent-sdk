// function: getDefaultRepositoryUrl
function getDefaultRepositoryUrl(packageData) {
  if (typeof packageData.repository === "string")
    return packageData.repository;
  return packageData.repository?.url || "";
}
