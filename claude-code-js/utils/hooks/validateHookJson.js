// function: validateHookJson
function validateHookJson(jsonString) {
  let parsed = jsonParse(jsonString), validation = hookJSONOutputSchema().safeParse(parsed);
  if (validation.success)
    return logForDebugging("Successfully parsed and validated hook JSON output"), { json: validation.data };
  return {
    validationError: `Hook JSON output validation failed:
${validation.error.issues.map((err2) => `  - ${err2.path.join(".")}: ${err2.message}`).join(`
`)}

The hook's output was: ${jsonStringify(parsed, null, 2)}`
  };
}
