// Original: src/services/policyLimits/types.ts
var PolicyLimitsResponseSchema;
var init_types17 = __esm(() => {
  init_v4();
  PolicyLimitsResponseSchema = lazySchema(() => exports_external.object({
    restrictions: exports_external.record(exports_external.string(), exports_external.object({ allowed: exports_external.boolean() }))
  }));
});
