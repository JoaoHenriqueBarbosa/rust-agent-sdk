// function: getLanguageFromPath
function getLanguageFromPath(filePath) {
  let ext = extname12(filePath).toLowerCase();
  return EXTENSION_TO_LANGUAGE[ext] || null;
}
