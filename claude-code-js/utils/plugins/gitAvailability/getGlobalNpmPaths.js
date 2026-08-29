// function: getGlobalNpmPaths
function getGlobalNpmPaths() {
  if (cachedGlobalNpmPaths)
    return cachedGlobalNpmPaths;
  let paths2 = [];
  try {
    let npmRoot = execSync("npm root -g", {
      encoding: "utf8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "ignore"]
    }).trim();
    if (npmRoot)
      paths2.push(join31(npmRoot, "@anthropic-ai", "sandbox-runtime"));
  } catch {}
  let home = homedir15();
  return paths2.push(join31("/usr", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), join31("/usr", "local", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), join31("/opt", "homebrew", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), join31(home, ".npm", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime"), join31(home, ".npm-global", "lib", "node_modules", "@anthropic-ai", "sandbox-runtime")), cachedGlobalNpmPaths = paths2, paths2;
}
