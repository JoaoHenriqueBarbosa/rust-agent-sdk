// function: getBackupFileName
function getBackupFileName(filePath, version5) {
  return `${createHash15("sha256").update(filePath).digest("hex").slice(0, 16)}@v${version5}`;
}
