// function: getSkillDirNames
async function getSkillDirNames(dirPath) {
  try {
    let entries2 = await fs17.readdir(dirPath, {
      withFileTypes: !0
    }), skillNames = [];
    for (let entry of entries2)
      if (entry.isDirectory() || entry.isSymbolicLink()) {
        let skillFilePath = path23.join(dirPath, entry.name, "SKILL.md");
        try {
          if ((await fs17.stat(skillFilePath)).isFile())
            skillNames.push(entry.name);
        } catch {}
      }
    return skillNames;
  } catch (error44) {
    let errorMsg = errorMessage(error44);
    return logForDebugging(`Failed to read skill directories from ${dirPath}: ${errorMsg}`, {
      level: "error"
    }), logError2(toError(error44)), [];
  }
}
