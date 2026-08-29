// function: sessionIdExists
function sessionIdExists(sessionId) {
  let projectDir = getProjectDir2(getOriginalCwd()), sessionFile = join134(projectDir, `${sessionId}.jsonl`), fs18 = getFsImplementation();
  try {
    return fs18.statSync(sessionFile), !0;
  } catch {
    return !1;
  }
}
