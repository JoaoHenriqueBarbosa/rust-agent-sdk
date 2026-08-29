// function: isVSCodeInstalled
async function isVSCodeInstalled() {
  let result = await execFileNoThrow("code", ["--help"]);
  return result.code === 0 && Boolean(result.stdout?.includes("Visual Studio Code"));
}
