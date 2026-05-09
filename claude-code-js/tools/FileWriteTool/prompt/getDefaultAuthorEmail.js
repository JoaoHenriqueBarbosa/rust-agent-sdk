// function: getDefaultAuthorEmail
function getDefaultAuthorEmail(packageData) {
  if (typeof packageData.author === "object")
    return packageData.author?.email || "";
  return "";
}
