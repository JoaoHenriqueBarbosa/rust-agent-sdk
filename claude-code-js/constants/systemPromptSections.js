// Original: src/constants/systemPromptSections.ts
function systemPromptSection(name3, compute) {
  return { name: name3, compute, cacheBreak: !1 };
}
function DANGEROUS_uncachedSystemPromptSection(name3, compute, _reason) {
  return { name: name3, compute, cacheBreak: !0 };
}
async function resolveSystemPromptSections(sections) {
  let cache5 = getSystemPromptSectionCache();
  return Promise.all(sections.map(async (s2) => {
    if (!s2.cacheBreak && cache5.has(s2.name))
      return cache5.get(s2.name) ?? null;
    let value = await s2.compute();
    return setSystemPromptSectionCacheEntry(s2.name, value), value;
  }));
}
function clearSystemPromptSections() {
  clearSystemPromptSectionState(), clearBetaHeaderLatches();
}
var init_systemPromptSections = __esm(() => {
  init_state();
});
