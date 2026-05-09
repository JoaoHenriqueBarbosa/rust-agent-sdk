// function: unpackExtension
async function unpackExtension({ mcpbPath, outputDir, silent }) {
  let logger34 = getLogger({ silent }), resolvedMcpbPath = resolve20(mcpbPath);
  if (!existsSync9(resolvedMcpbPath))
    return logger34.error(`ERROR: MCPB file not found: ${mcpbPath}`), !1;
  let finalOutputDir = outputDir ? resolve20(outputDir) : process.cwd();
  if (!existsSync9(finalOutputDir))
    mkdirSync4(finalOutputDir, { recursive: !0 });
  try {
    let fileContent = readFileSync15(resolvedMcpbPath), { originalContent } = extractSignatureBlock(fileContent), fileAttributes = /* @__PURE__ */ new Map, isUnix = process.platform !== "win32";
    if (isUnix) {
      let zipBuffer = originalContent, eocdOffset = -1;
      for (let i5 = zipBuffer.length - 22;i5 >= 0; i5--)
        if (zipBuffer.readUInt32LE(i5) === 101010256) {
          eocdOffset = i5;
          break;
        }
      if (eocdOffset !== -1) {
        let centralDirOffset = zipBuffer.readUInt32LE(eocdOffset + 16), centralDirEntries = zipBuffer.readUInt16LE(eocdOffset + 8), offset = centralDirOffset;
        for (let i5 = 0;i5 < centralDirEntries; i5++)
          if (zipBuffer.readUInt32LE(offset) === 33639248) {
            let externalAttrs = zipBuffer.readUInt32LE(offset + 38), filenameLength = zipBuffer.readUInt16LE(offset + 28), filename = zipBuffer.toString("utf8", offset + 46, offset + 46 + filenameLength), mode = externalAttrs >> 16 & 511;
            if (mode > 0)
              fileAttributes.set(filename, mode);
            let extraFieldLength = zipBuffer.readUInt16LE(offset + 30), commentLength = zipBuffer.readUInt16LE(offset + 32);
            offset += 46 + filenameLength + extraFieldLength + commentLength;
          } else
            break;
      }
    }
    let decompressed = unzipSync(originalContent);
    for (let relativePath in decompressed)
      if (Object.prototype.hasOwnProperty.call(decompressed, relativePath)) {
        let data = decompressed[relativePath], fullPath = join38(finalOutputDir, relativePath), normalizedPath = resolve20(fullPath), normalizedOutputDir = resolve20(finalOutputDir);
        if (!normalizedPath.startsWith(normalizedOutputDir + sep10) && normalizedPath !== normalizedOutputDir)
          throw Error(`Path traversal attempt detected: ${relativePath}`);
        let dir = join38(fullPath, "..");
        if (!existsSync9(dir))
          mkdirSync4(dir, { recursive: !0 });
        if (writeFileSync5(fullPath, data), isUnix && fileAttributes.has(relativePath))
          try {
            let mode = fileAttributes.get(relativePath);
            if (mode !== void 0)
              chmodSync3(fullPath, mode);
          } catch (error44) {}
      }
    return logger34.log(`Extension unpacked successfully to ${finalOutputDir}`), !0;
  } catch (error44) {
    if (error44 instanceof Error)
      logger34.error(`ERROR: Failed to unpack extension: ${error44.message}`);
    else
      logger34.error("ERROR: An unknown error occurred during unpacking.");
    return !1;
  }
}
