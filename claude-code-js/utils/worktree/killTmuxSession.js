// function: killTmuxSession
async function killTmuxSession(sessionName) {
  let { code } = await execFileNoThrow("tmux", [
    "kill-session",
    "-t",
    sessionName
  ]);
  return code === 0;
}
