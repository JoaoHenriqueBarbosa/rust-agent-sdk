// function: getDefaultOptionalFields
function getDefaultOptionalFields(packageData) {
  return {
    keywords: "",
    license: packageData.license || "MIT",
    repository: void 0
  };
}
