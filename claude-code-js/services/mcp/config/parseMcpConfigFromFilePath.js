// function: parseMcpConfigFromFilePath
function parseMcpConfigFromFilePath(params) {
  let { filePath, expandVars, scope } = params, fs16 = getFsImplementation(), configContent;
  try {
    configContent = fs16.readFileSync(filePath, { encoding: "utf8" });
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return {
        config: null,
        errors: [
          {
            file: filePath,
            path: "",
            message: `MCP config file not found: ${filePath}`,
            suggestion: "Check that the file path is correct",
            mcpErrorMetadata: {
              scope,
              severity: "fatal"
            }
          }
        ]
      };
    return logForDebugging(`MCP config read error for ${filePath} (scope=${scope}): ${error44}`, { level: "error" }), {
      config: null,
      errors: [
        {
          file: filePath,
          path: "",
          message: `Failed to read file: ${error44}`,
          suggestion: "Check file permissions and ensure the file exists",
          mcpErrorMetadata: {
            scope,
            severity: "fatal"
          }
        }
      ]
    };
  }
  let parsedJson = safeParseJSON(configContent);
  if (!parsedJson)
    return logForDebugging(`MCP config is not valid JSON: ${filePath} (scope=${scope}, length=${configContent.length}, first100=${jsonStringify(configContent.slice(0, 100))})`, { level: "error" }), {
      config: null,
      errors: [
        {
          file: filePath,
          path: "",
          message: "MCP config is not a valid JSON",
          suggestion: "Fix the JSON syntax errors in the file",
          mcpErrorMetadata: {
            scope,
            severity: "fatal"
          }
        }
      ]
    };
  return parseMcpConfig({
    configObject: parsedJson,
    expandVars,
    scope,
    filePath
  });
}
