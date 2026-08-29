// Original: src/utils/dxt/helpers.ts
async function validateManifest2(manifestJson) {
  let { McpbManifestSchema: McpbManifestSchema10 } = await Promise.resolve().then(() => (init_dist7(), exports_dist2)), parseResult = McpbManifestSchema10.safeParse(manifestJson);
  if (!parseResult.success) {
    let errors8 = parseResult.error.flatten(), errorMessages = [
      ...Object.entries(errors8.fieldErrors).map(([field, errs]) => `${field}: ${errs?.join(", ")}`),
      ...errors8.formErrors || []
    ].filter(Boolean).join("; ");
    throw Error(`Invalid manifest: ${errorMessages}`);
  }
  return parseResult.data;
}
async function parseAndValidateManifestFromText(manifestText) {
  let manifestJson;
  try {
    manifestJson = jsonParse(manifestText);
  } catch (error44) {
    throw Error(`Invalid JSON in manifest.json: ${errorMessage(error44)}`);
  }
  return validateManifest2(manifestJson);
}
async function parseAndValidateManifestFromBytes(manifestData) {
  let manifestText = (/* @__PURE__ */ new TextDecoder()).decode(manifestData);
  return parseAndValidateManifestFromText(manifestText);
}
var init_helpers2 = __esm(() => {
  init_errors();
  init_slowOperations();
});
