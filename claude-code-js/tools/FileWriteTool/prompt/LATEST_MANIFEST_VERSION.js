// var: LATEST_MANIFEST_VERSION
var LATEST_MANIFEST_VERSION = "0.4", DEFAULT_MANIFEST_VERSION = "0.2", MANIFEST_SCHEMAS, MANIFEST_SCHEMAS_LOOSE;
var init_constants8 = __esm(() => {
  init_0_1();
  init_0_2();
  init_0_3();
  init_0_4();
  init_0_12();
  init_0_22();
  init_0_32();
  init_0_42();
  MANIFEST_SCHEMAS = {
    "0.1": McpbManifestSchema,
    "0.2": McpbManifestSchema2,
    "0.3": McpbManifestSchema3,
    "0.4": McpbManifestSchema4
  }, MANIFEST_SCHEMAS_LOOSE = {
    "0.1": McpbManifestSchema5,
    "0.2": McpbManifestSchema6,
    "0.3": McpbManifestSchema7,
    "0.4": McpbManifestSchema8
  };
});
