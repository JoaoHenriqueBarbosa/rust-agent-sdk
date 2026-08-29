// function: packExtension
async function packExtension({ extensionPath, outputPath, silent }) {
  let resolvedPath5 = resolve22(extensionPath), logger34 = getLogger({ silent });
  if (!existsSync11(resolvedPath5) || !statSync10(resolvedPath5).isDirectory())
    return logger34.error(`ERROR: Directory not found: ${extensionPath}`), !1;
  let manifestPath = join40(resolvedPath5, "manifest.json");
  if (!existsSync11(manifestPath))
    if (logger34.log(`No manifest.json found in ${extensionPath}`), await esm_default3({
      message: "Would you like to create a manifest.json file?",
      default: !0
    })) {
      if (!await initExtension(extensionPath))
        return logger34.error("ERROR: Failed to create manifest"), !1;
    } else
      return logger34.error("ERROR: Cannot pack extension without manifest.json"), !1;
  if (logger34.log("Validating manifest..."), !validateManifest(manifestPath))
    return logger34.error("ERROR: Cannot pack extension with invalid manifest"), !1;
  let manifest;
  try {
    let manifestContent = readFileSync17(manifestPath, "utf-8"), manifestData = JSON.parse(manifestContent), manifestVersion = getManifestVersionFromRawData(manifestData);
    if (!manifestVersion)
      return logger34.error(`ERROR: Manifest version mismatch. Expected "${Object.keys(MANIFEST_SCHEMAS).join(" or ")}", found "${manifestVersion}"`), logger34.error("  Please update the manifest_version in your manifest.json to a supported version"), !1;
    manifest = MANIFEST_SCHEMAS[manifestVersion].parse(manifestData);
  } catch (error44) {
    if (logger34.error("ERROR: Failed to parse manifest.json"), error44 instanceof Error)
      logger34.error(`  ${error44.message}`);
    return !1;
  }
  let extensionName = basename8(resolvedPath5), finalOutputPath = outputPath ? resolve22(outputPath) : resolve22(`${extensionName}.mcpb`), outputDir = join40(finalOutputPath, "..");
  mkdirSync5(outputDir, { recursive: !0 });
  try {
    let mcpbIgnorePatterns = readMcpbIgnorePatterns(resolvedPath5), { files, ignoredCount } = getAllFilesWithCount(resolvedPath5, resolvedPath5, {}, mcpbIgnorePatterns);
    logger34.log(`
\uD83D\uDCE6  ${manifest.name}@${manifest.version}`), logger34.log("Archive Contents");
    let fileEntries = Object.entries(files), totalUnpackedSize = 0;
    fileEntries.sort(([a2], [b]) => a2.localeCompare(b));
    let directoryGroups = /* @__PURE__ */ new Map, shallowFiles = [];
    for (let [filePath, fileData] of fileEntries) {
      let relPath = relative6(resolvedPath5, filePath), content = fileData.data, size = typeof content === "string" ? Buffer.byteLength(content, "utf8") : content.length;
      totalUnpackedSize += size;
      let parts = relPath.split(sep11);
      if (parts.length > 3) {
        let groupKey = parts.slice(0, 3).join("/");
        if (!directoryGroups.has(groupKey))
          directoryGroups.set(groupKey, { files: [], totalSize: 0 });
        let group = directoryGroups.get(groupKey);
        group.files.push(relPath), group.totalSize += size;
      } else
        shallowFiles.push({ path: relPath, size });
    }
    for (let { path: path16, size } of shallowFiles)
      logger34.log(`${formatFileSize2(size).padStart(8)} ${path16}`);
    for (let [dir, { files: files2, totalSize }] of directoryGroups)
      if (files2.length === 1) {
        let filePath = files2[0], fileSize = totalSize;
        logger34.log(`${formatFileSize2(fileSize).padStart(8)} ${filePath}`);
      } else
        logger34.log(`${formatFileSize2(totalSize).padStart(8)} ${dir}/ [and ${files2.length} more files]`);
    let zipFiles = {}, isUnix = process.platform !== "win32";
    for (let [filePath, fileData] of Object.entries(files))
      if (isUnix)
        zipFiles[filePath] = [
          fileData.data,
          { os: 3, attrs: (fileData.mode & 511) << 16 }
        ];
      else
        zipFiles[filePath] = fileData.data;
    let zipData = zipSync(zipFiles, {
      level: 9,
      mtime: /* @__PURE__ */ new Date
    });
    writeFileSync6(finalOutputPath, zipData);
    let shasum = createHash5("sha1").update(zipData).digest("hex"), archiveName = `${sanitizeNameForFilename(manifest.name)}-${manifest.version}.mcpb`;
    return logger34.log(`
Archive Details`), logger34.log(`name: ${manifest.name}`), logger34.log(`version: ${manifest.version}`), logger34.log(`filename: ${archiveName}`), logger34.log(`package size: ${formatFileSize2(zipData.length)}`), logger34.log(`unpacked size: ${formatFileSize2(totalUnpackedSize)}`), logger34.log(`shasum: ${shasum}`), logger34.log(`total files: ${fileEntries.length}`), logger34.log(`ignored (.mcpbignore) files: ${ignoredCount}`), logger34.log(`
Output: ${finalOutputPath}`), !0;
  } catch (error44) {
    if (error44 instanceof Error)
      logger34.error(`ERROR: Archive error: ${error44.message}`);
    else
      logger34.error("ERROR: Unknown archive error occurred");
    return !1;
  }
}
