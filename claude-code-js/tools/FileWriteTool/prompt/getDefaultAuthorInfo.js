// function: getDefaultAuthorInfo
function getDefaultAuthorInfo(packageData) {
  return {
    authorEmail: getDefaultAuthorEmail(packageData),
    authorUrl: getDefaultAuthorUrl(packageData)
  };
}
