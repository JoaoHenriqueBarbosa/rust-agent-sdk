// function: validateIcon
function validateIcon(iconPath, baseDir) {
  let errors8 = [], warnings = [], isRemoteUrl = iconPath.startsWith("http://") || iconPath.startsWith("https://"), hasVariableSubstitution = iconPath.includes("${__dirname}"), isAbsolutePath = isAbsolute8(iconPath);
  if (isRemoteUrl)
    warnings.push('Icon path uses a remote URL. Best practice for local MCP servers: Use local files like "icon": "icon.png" for maximum compatibility. Claude Desktop currently only supports local icon files in bundles.');
  if (hasVariableSubstitution)
    errors8.push('Icon path should not use ${__dirname} variable substitution. Use a simple relative path like "icon.png" instead of "${__dirname}/icon.png".');
  if (isAbsolutePath)
    errors8.push(`Icon path must be relative to the bundle root, not an absolute path. Found: "${iconPath}"`);
  if (!isRemoteUrl && !isAbsolutePath && !hasVariableSubstitution) {
    let fullIconPath = join39(baseDir, iconPath);
    if (!existsSync10(fullIconPath))
      errors8.push(`Icon file not found at path: ${iconPath}`);
    else
      try {
        let buffer = readFileSync16(fullIconPath);
        if (!isPNG(buffer))
          errors8.push(`Icon file must be PNG format. The file at "${iconPath}" does not appear to be a valid PNG file.`);
        else
          warnings.push("Icon validation passed. Recommended size is 512\xD7512 pixels for best display in Claude Desktop.");
      } catch (error44) {
        errors8.push(`Unable to read icon file at "${iconPath}": ${error44 instanceof Error ? error44.message : "Unknown error"}`);
      }
  }
  return {
    valid: errors8.length === 0,
    errors: errors8,
    warnings
  };
}
