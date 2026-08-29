// function: validateManifest
function validateManifest(inputPath) {
  try {
    let resolvedPath5 = resolve21(inputPath), manifestPath = resolvedPath5;
    if (existsSync10(resolvedPath5) && statSync9(resolvedPath5).isDirectory())
      manifestPath = join39(resolvedPath5, "manifest.json");
    let manifestContent = readFileSync16(manifestPath, "utf-8"), manifestData = JSON.parse(manifestContent), manifestVersion = getManifestVersionFromRawData(manifestData);
    if (!manifestVersion)
      return console.log("Unrecognized or unsupported manifest version"), !1;
    let result = MANIFEST_SCHEMAS[manifestVersion].safeParse(manifestData);
    if (result.success) {
      if (console.log("Manifest schema validation passes!"), manifestData.icon) {
        let baseDir = dirname22(manifestPath), iconValidation = validateIcon(manifestData.icon, baseDir);
        if (iconValidation.errors.length > 0)
          return console.log(`
ERROR: Icon validation failed:
`), iconValidation.errors.forEach((error44) => {
            console.log(`  - ${error44}`);
          }), !1;
        if (iconValidation.warnings.length > 0)
          console.log(`
Icon validation warnings:
`), iconValidation.warnings.forEach((warning) => {
            console.log(`  - ${warning}`);
          });
      }
      return !0;
    } else
      return console.log(`ERROR: Manifest validation failed:
`), result.error.issues.forEach((issue2) => {
        let path16 = issue2.path.join(".");
        console.log(`  - ${path16 ? `${path16}: ` : ""}${issue2.message}`);
      }), !1;
  } catch (error44) {
    if (error44 instanceof Error)
      if (error44.message.includes("ENOENT")) {
        if (console.error(`ERROR: File not found: ${inputPath}`), existsSync10(resolve21(inputPath)) && statSync9(resolve21(inputPath)).isDirectory())
          console.error("  (No manifest.json found in directory)");
      } else if (error44.message.includes("JSON"))
        console.error(`ERROR: Invalid JSON in manifest file: ${error44.message}`);
      else
        console.error(`ERROR: Error reading manifest: ${error44.message}`);
    else
      console.error("ERROR: Unknown error occurred");
    return !1;
  }
}
