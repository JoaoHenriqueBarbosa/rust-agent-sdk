// function: isPossibleClaudeBinary
async function isPossibleClaudeBinary(filePath) {
  try {
    let stats = await stat19(filePath);
    if (!stats.isFile() || stats.size === 0)
      return !1;
    return await access3(filePath, fsConstants5.X_OK), !0;
  } catch {
    return !1;
  }
}
