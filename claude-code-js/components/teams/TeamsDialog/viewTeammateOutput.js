// function: viewTeammateOutput
async function viewTeammateOutput(paneId, backendType) {
  if (backendType === "iterm2")
    await execFileNoThrow(IT2_COMMAND, ["session", "focus", "-s", paneId]);
  else {
    let args = isInsideTmuxSync() ? ["select-pane", "-t", paneId] : ["-L", getSwarmSocketName(), "select-pane", "-t", paneId];
    await execFileNoThrow(TMUX_COMMAND, args);
  }
}
