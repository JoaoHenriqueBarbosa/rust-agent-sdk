// function: promptAuthorInfo
async function promptAuthorInfo(packageData) {
  let authorEmail = await esm_default4({
    message: "Author email (optional):",
    default: getDefaultAuthorEmail(packageData)
  }), authorUrl = await esm_default4({
    message: "Author URL (optional):",
    default: getDefaultAuthorUrl(packageData)
  });
  return { authorEmail, authorUrl };
}
