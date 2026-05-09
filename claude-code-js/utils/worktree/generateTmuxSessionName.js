// function: generateTmuxSessionName
function generateTmuxSessionName(repoPath, branch2) {
  return `${basename42(repoPath)}_${branch2}`.replace(/[/.]/g, "_");
}
