// function: isTmuxAvailable2
async function isTmuxAvailable2() {
  let { code } = await execFileNoThrow("tmux", ["-V"]);
  return code === 0;
}
