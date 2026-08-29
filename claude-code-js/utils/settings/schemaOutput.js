// Original: src/utils/settings/schemaOutput.ts
function generateSettingsJSONSchema() {
  let jsonSchema = toJSONSchema(SettingsSchema(), { unrepresentable: "any" });
  return jsonStringify(jsonSchema, null, 2);
}
var init_schemaOutput = __esm(() => {
  init_v4();
  init_slowOperations();
  init_types3();
});
