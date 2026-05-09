// function: macGetMandatoryDenyPatterns
function macGetMandatoryDenyPatterns(allowGitConfig = !1) {
  let cwd2 = process.cwd(), denyPaths = [];
  for (let fileName of DANGEROUS_FILES)
    denyPaths.push(path15.resolve(cwd2, fileName)), denyPaths.push(`**/${fileName}`);
  for (let dirName of getDangerousDirectories())
    denyPaths.push(path15.resolve(cwd2, dirName)), denyPaths.push(`**/${dirName}/**`);
  if (denyPaths.push(path15.resolve(cwd2, ".git/hooks")), denyPaths.push("**/.git/hooks/**"), !allowGitConfig)
    denyPaths.push(path15.resolve(cwd2, ".git/config")), denyPaths.push("**/.git/config");
  return [...new Set(denyPaths)];
}
