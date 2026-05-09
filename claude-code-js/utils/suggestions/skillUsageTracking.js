// Original: src/utils/suggestions/skillUsageTracking.ts
function recordSkillUsage(skillName) {
  let now2 = Date.now(), lastWrite = lastWriteBySkill.get(skillName);
  if (lastWrite !== void 0 && now2 - lastWrite < SKILL_USAGE_DEBOUNCE_MS)
    return;
  lastWriteBySkill.set(skillName, now2), saveGlobalConfig((current) => {
    let existing = current.skillUsage?.[skillName];
    return {
      ...current,
      skillUsage: {
        ...current.skillUsage,
        [skillName]: {
          usageCount: (existing?.usageCount ?? 0) + 1,
          lastUsedAt: now2
        }
      }
    };
  });
}
function getSkillUsageScore(skillName) {
  let usage = getGlobalConfig().skillUsage?.[skillName];
  if (!usage)
    return 0;
  let daysSinceUse = (Date.now() - usage.lastUsedAt) / 86400000, recencyFactor = Math.pow(0.5, daysSinceUse / 7);
  return usage.usageCount * Math.max(recencyFactor, 0.1);
}
var SKILL_USAGE_DEBOUNCE_MS = 60000, lastWriteBySkill;
var init_skillUsageTracking = __esm(() => {
  init_config4();
  lastWriteBySkill = /* @__PURE__ */ new Map;
});
