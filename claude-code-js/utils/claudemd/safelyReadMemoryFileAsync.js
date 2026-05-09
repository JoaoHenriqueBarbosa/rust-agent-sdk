// function: safelyReadMemoryFileAsync
async function safelyReadMemoryFileAsync(filePath, type, includeBasePath) {
  try {
    let rawContent2 = await getFsImplementation().readFile(filePath, { encoding: "utf-8" });
    return parseMemoryFileContent(rawContent2, filePath, type, includeBasePath);
  } catch (error44) {
    return handleMemoryFileReadError(error44, filePath), { info: null, includePaths: [] };
  }
}
