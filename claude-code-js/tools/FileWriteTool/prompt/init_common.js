// var: init_common
var init_common = __esm(() => {
  init_zod();
  McpbUserConfigValuesSchema = exports_external2.record(exports_external2.string(), exports_external2.union([exports_external2.string(), exports_external2.number(), exports_external2.boolean(), exports_external2.array(exports_external2.string())])), McpbSignatureInfoSchema = exports_external2.strictObject({
    status: exports_external2.enum(["signed", "unsigned", "self-signed"]),
    publisher: exports_external2.string().optional(),
    issuer: exports_external2.string().optional(),
    valid_from: exports_external2.string().optional(),
    valid_to: exports_external2.string().optional(),
    fingerprint: exports_external2.string().optional()
  });
});
