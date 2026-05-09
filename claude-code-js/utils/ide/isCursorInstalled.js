// function: isCursorInstalled
async function isCursorInstalled() {
  return (await execFileNoThrow("cursor", ["--version"])).code === 0;
}
