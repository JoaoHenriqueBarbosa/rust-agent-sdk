// function: promptOptionalFields
async function promptOptionalFields(packageData) {
  let keywords = await esm_default4({
    message: "Keywords (comma-separated, optional):",
    default: ""
  }), license = await esm_default4({
    message: "License:",
    default: packageData.license || "MIT"
  }), addRepository = await esm_default3({
    message: "Add repository information?",
    default: !!packageData.repository
  }), repository;
  if (addRepository) {
    let repoUrl = await esm_default4({
      message: "Repository URL:",
      default: getDefaultRepositoryUrl(packageData)
    });
    if (repoUrl)
      repository = {
        type: "git",
        url: repoUrl
      };
  }
  return { keywords, license, repository };
}
