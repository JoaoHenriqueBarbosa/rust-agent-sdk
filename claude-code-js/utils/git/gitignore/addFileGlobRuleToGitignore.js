// function: addFileGlobRuleToGitignore
async function addFileGlobRuleToGitignore(filename, cwd2 = getCwd()) {
  try {
    if (!await dirIsInGitRepo(cwd2))
      return;
    let gitignoreEntry = `**/${filename}`, testPath = filename.endsWith("/") ? `${filename}sample-file.txt` : filename;
    if (await isPathGitignored(testPath, cwd2))
      return;
    let globalGitignorePath = getGlobalGitignorePath(), configGitDir = dirname9(globalGitignorePath);
    await mkdir2(configGitDir, { recursive: !0 });
    try {
      if ((await readFile4(globalGitignorePath, { encoding: "utf-8" })).includes(gitignoreEntry))
        return;
      await appendFile2(globalGitignorePath, `
${gitignoreEntry}
`);
    } catch (e) {
      if (getErrnoCode(e) === "ENOENT")
        await writeFile(globalGitignorePath, `${gitignoreEntry}
`, "utf-8");
      else
        throw e;
    }
  } catch (error41) {
    logError2(error41);
  }
}
