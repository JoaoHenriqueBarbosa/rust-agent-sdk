// Original: src/utils/model/modelCapabilities.ts
import { readFileSync as readFileSync8 } from "fs";
import { mkdir as mkdir3, writeFile as writeFile4 } from "fs/promises";
import { join as join21 } from "path";
function getCacheDir() {
  return join21(getClaudeConfigHomeDir(), "cache");
}
function getCachePath() {
  return join21(getCacheDir(), "model-capabilities.json");
}
function isModelCapabilitiesEligible() {
  return !1;
}
function sortForMatching(models) {
  return [...models].sort((a2, b) => b.id.length - a2.id.length || a2.id.localeCompare(b.id));
}
function getModelCapability(model) {
  if (!isModelCapabilitiesEligible())
    return;
  let cached2 = loadCache(getCachePath());
  if (!cached2 || cached2.length === 0)
    return;
  let m4 = model.toLowerCase(), exact = cached2.find((c3) => c3.id.toLowerCase() === m4);
  if (exact)
    return exact;
  return cached2.find((c3) => m4.includes(c3.id.toLowerCase()));
}
async function refreshModelCapabilities() {
  if (!isModelCapabilitiesEligible())
    return;
  if (isEssentialTrafficOnly())
    return;
  try {
    let anthropic = await getAnthropicClient({ maxRetries: 1 }), betas = isClaudeAISubscriber() ? [OAUTH_BETA_HEADER] : void 0, parsed = [];
    for await (let entry of anthropic.models.list({ betas })) {
      let result = ModelCapabilitySchema().safeParse(entry);
      if (result.success)
        parsed.push(result.data);
    }
    if (parsed.length === 0)
      return;
    let path12 = getCachePath(), models = sortForMatching(parsed);
    if (isEqual_default(loadCache(path12), models)) {
      logForDebugging("[modelCapabilities] cache unchanged, skipping write");
      return;
    }
    await mkdir3(getCacheDir(), { recursive: !0 }), await writeFile4(path12, jsonStringify({ models, timestamp: Date.now() }), {
      encoding: "utf-8",
      mode: 384
    }), loadCache.cache.delete(path12), logForDebugging(`[modelCapabilities] cached ${models.length} models`);
  } catch (error44) {
    logForDebugging(`[modelCapabilities] fetch failed: ${error44 instanceof Error ? error44.message : "unknown"}`);
  }
}
var ModelCapabilitySchema, CacheFileSchema, loadCache;
var init_modelCapabilities = __esm(() => {
  init_isEqual();
  init_memoize();
  init_v4();
  init_oauth();
  init_client17();
  init_auth14();
  init_debug();
  init_envUtils();
  init_json();
  init_slowOperations();
  init_providers();
  ModelCapabilitySchema = lazySchema(() => exports_external.object({
    id: exports_external.string(),
    max_input_tokens: exports_external.number().optional(),
    max_tokens: exports_external.number().optional()
  }).strip()), CacheFileSchema = lazySchema(() => exports_external.object({
    models: exports_external.array(ModelCapabilitySchema()),
    timestamp: exports_external.number()
  }));
  loadCache = memoize_default((path12) => {
    try {
      let raw = readFileSync8(path12, "utf-8"), parsed = CacheFileSchema().safeParse(safeParseJSON(raw, !1));
      return parsed.success ? parsed.data.models : null;
    } catch {
      return null;
    }
  }, (path12) => path12);
});
