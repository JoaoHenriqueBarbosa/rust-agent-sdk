// function: getClaudeSkillScope
function getClaudeSkillScope(filePath) {
  let absolutePath = expandPath(filePath), absolutePathLower = normalizeCaseForComparison2(absolutePath), bases = [
    {
      dir: expandPath(join136(getOriginalCwd(), ".claude", "skills")),
      prefix: "/.claude/skills/"
    },
    {
      dir: expandPath(join136(homedir34(), ".claude", "skills")),
      prefix: "~/.claude/skills/"
    }
  ];
  for (let { dir, prefix } of bases) {
    let dirLower = normalizeCaseForComparison2(dir);
    for (let s2 of [sep32, "/"])
      if (absolutePathLower.startsWith(dirLower + s2.toLowerCase())) {
        let rest = absolutePath.slice(dir.length + s2.length), slash = rest.indexOf("/"), bslash = sep32 === "\\" ? rest.indexOf("\\") : -1, cut = slash === -1 ? bslash : bslash === -1 ? slash : Math.min(slash, bslash);
        if (cut <= 0)
          return null;
        let skillName = rest.slice(0, cut);
        if (!skillName || skillName === "." || skillName.includes(".."))
          return null;
        if (/[*?[\]]/.test(skillName))
          return null;
        return { skillName, pattern: prefix + skillName + "/**" };
      }
  }
  return null;
}
