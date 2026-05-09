// function: getDefaultAuthorName
function getDefaultAuthorName(packageData) {
  if (typeof packageData.author === "string")
    return packageData.author;
  return packageData.author?.name || "";
}
