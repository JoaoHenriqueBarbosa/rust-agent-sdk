// Original: src/tools/AgentTool/agentMemorySnapshot.ts
var snapshotMetaSchema, syncedMetaSchema;
var init_agentMemorySnapshot = __esm(() => {
  init_v4();
  init_cwd2();
  init_debug();
  init_slowOperations();
  init_agentMemory();
  snapshotMetaSchema = lazySchema(() => exports_external.object({
    updatedAt: exports_external.string().min(1)
  })), syncedMetaSchema = lazySchema(() => exports_external.object({
    syncedFrom: exports_external.string().min(1)
  }));
});
