// function: getBaseFileNames
async function getBaseFileNames(dirPath) {
  try {
    return (await fs17.readdir(dirPath, {
      withFileTypes: !0
    })).filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => {
      return path23.basename(entry.name, ".md");
    });
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Failed to read plugin components from ${dirPath}: ${errorMsg}`, {
      level: "error"
    }), logError2(toError(error44)), [];
  }
}
