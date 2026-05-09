// function: parseFileWithSchema
async function parseFileWithSchema(filePath, schema5) {
  let content = await getFsImplementation().readFile(filePath, { encoding: "utf-8" }), data;
  try {
    data = jsonParse(content);
  } catch (error44) {
    throw new ConfigParseError(`Invalid JSON in ${filePath}: ${errorMessage(error44)}`, filePath, content);
  }
  let result = schema5.safeParse(data);
  if (!result.success)
    throw new ConfigParseError(`Invalid schema: ${filePath} ${result.error?.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`, filePath, data);
  return result.data;
}
