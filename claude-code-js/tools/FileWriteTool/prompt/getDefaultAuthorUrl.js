// function: getDefaultAuthorUrl
function getDefaultAuthorUrl(packageData) {
  if (typeof packageData.author === "object")
    return packageData.author?.url || "";
  return "";
}
