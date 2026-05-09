// Original: src/services/remoteManagedSettings/types.ts
var RemoteManagedSettingsResponseSchema;
var init_types18 = __esm(() => {
  init_v4();
  RemoteManagedSettingsResponseSchema = lazySchema(() => exports_external.object({
    uuid: exports_external.string(),
    checksum: exports_external.string(),
    settings: exports_external.record(exports_external.string(), exports_external.unknown())
  }));
});
