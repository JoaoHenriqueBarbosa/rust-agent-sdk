// function: promptBasicInfo
async function promptBasicInfo(packageData, resolvedPath5) {
  let defaultName = packageData.name || basename7(resolvedPath5), name3 = await esm_default4({
    message: "Extension name:",
    default: defaultName,
    validate: (value) => value.trim().length > 0 || "Name is required"
  }), authorName = await esm_default4({
    message: "Author name:",
    default: getDefaultAuthorName(packageData),
    validate: (value) => value.trim().length > 0 || "Author name is required"
  }), displayName = await esm_default4({
    message: "Display name (optional):",
    default: name3
  }), version5 = await esm_default4({
    message: "Version:",
    default: packageData.version || "1.0.0",
    validate: (value) => {
      if (!value.trim())
        return "Version is required";
      if (!/^\d+\.\d+\.\d+/.test(value))
        return "Version must follow semantic versioning (e.g., 1.0.0)";
      return !0;
    }
  }), description = await esm_default4({
    message: "Description:",
    default: packageData.description || "",
    validate: (value) => value.trim().length > 0 || "Description is required"
  });
  return { name: name3, authorName, displayName, version: version5, description };
}
