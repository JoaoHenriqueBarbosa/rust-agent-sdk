// function: isWindsurfInstalled
async function isWindsurfInstalled() {
  return (await execFileNoThrow("windsurf", ["--version"])).code === 0;
}
