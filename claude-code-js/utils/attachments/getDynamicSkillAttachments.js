// function: getDynamicSkillAttachments
async function getDynamicSkillAttachments(toolUseContext) {
  let attachments = [];
  if (toolUseContext.dynamicSkillDirTriggers && toolUseContext.dynamicSkillDirTriggers.size > 0) {
    let perDirResults = await Promise.all(Array.from(toolUseContext.dynamicSkillDirTriggers).map(async (skillDir) => {
      try {
        let candidates = (await readdir15(skillDir, { withFileTypes: !0 })).filter((e) => e.isDirectory() || e.isSymbolicLink()).map((e) => e.name), checked = await Promise.all(candidates.map(async (name3) => {
          try {
            return await stat29(resolve35(skillDir, name3, "SKILL.md")), name3;
          } catch {
            return null;
          }
        }));
        return {
          skillDir,
          skillNames: checked.filter((n5) => n5 !== null)
        };
      } catch {
        return { skillDir, skillNames: [] };
      }
    }));
    for (let { skillDir, skillNames } of perDirResults)
      if (skillNames.length > 0)
        attachments.push({
          type: "dynamic_skill",
          skillDir,
          skillNames,
          displayPath: relative19(getCwd(), skillDir)
        });
    toolUseContext.dynamicSkillDirTriggers.clear();
  }
  return attachments;
}
