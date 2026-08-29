// Original: src/utils/swarm/backends/ITermBackend.ts
var exports_ITermBackend = {};
__export(exports_ITermBackend, {
  ITermBackend: () => ITermBackend
});
function acquirePaneCreationLock2() {
  let release, newLock = new Promise((resolve27) => {
    release = resolve27;
  }), previousLock = paneCreationLock2;
  return paneCreationLock2 = newLock, previousLock.then(() => release);
}
function runIt2(args) {
  return execFileNoThrow(IT2_COMMAND, args);
}
function parseSplitOutput(output) {
  let match = output.match(/Created new pane:\s*(.+)/);
  if (match && match[1])
    return match[1].trim();
  return "";
}
function getLeaderSessionId() {
  let itermSessionId = process.env.ITERM_SESSION_ID;
  if (!itermSessionId)
    return null;
  let colonIndex = itermSessionId.indexOf(":");
  if (colonIndex === -1)
    return null;
  return itermSessionId.slice(colonIndex + 1);
}

class ITermBackend {
  type = "iterm2";
  displayName = "iTerm2";
  supportsHideShow = !1;
  async isAvailable() {
    let inITerm2 = isInITerm2();
    if (logForDebugging(`[ITermBackend] isAvailable check: inITerm2=${inITerm2}`), !inITerm2)
      return logForDebugging("[ITermBackend] isAvailable: false (not in iTerm2)"), !1;
    let it2Available = await isIt2CliAvailable();
    return logForDebugging(`[ITermBackend] isAvailable: ${it2Available} (it2 CLI ${it2Available ? "found" : "not found"})`), it2Available;
  }
  async isRunningInside() {
    let result = isInITerm2();
    return logForDebugging(`[ITermBackend] isRunningInside: ${result}`), result;
  }
  async createTeammatePaneInSwarmView(name3, color2) {
    logForDebugging(`[ITermBackend] createTeammatePaneInSwarmView called for ${name3} with color ${color2}`);
    let releaseLock2 = await acquirePaneCreationLock2();
    try {
      while (!0) {
        let isFirstTeammate = !firstPaneUsed;
        logForDebugging(`[ITermBackend] Creating pane: isFirstTeammate=${isFirstTeammate}, existingPanes=${teammateSessionIds.length}`);
        let splitArgs, targetedTeammateId;
        if (isFirstTeammate) {
          let leaderSessionId = getLeaderSessionId();
          if (leaderSessionId)
            splitArgs = ["session", "split", "-v", "-s", leaderSessionId], logForDebugging(`[ITermBackend] First split from leader session: ${leaderSessionId}`);
          else
            splitArgs = ["session", "split", "-v"], logForDebugging("[ITermBackend] First split from active session (no leader ID)");
        } else if (targetedTeammateId = teammateSessionIds[teammateSessionIds.length - 1], targetedTeammateId)
          splitArgs = ["session", "split", "-s", targetedTeammateId], logForDebugging(`[ITermBackend] Subsequent split from teammate session: ${targetedTeammateId}`);
        else
          splitArgs = ["session", "split"], logForDebugging("[ITermBackend] Subsequent split from active session (no teammate ID)");
        let splitResult = await runIt2(splitArgs);
        if (splitResult.code !== 0) {
          if (targetedTeammateId) {
            let listResult = await runIt2(["session", "list"]);
            if (listResult.code === 0 && !listResult.stdout.includes(targetedTeammateId)) {
              logForDebugging(`[ITermBackend] Split failed targeting dead session ${targetedTeammateId}, pruning and retrying: ${splitResult.stderr}`);
              let idx = teammateSessionIds.indexOf(targetedTeammateId);
              if (idx !== -1)
                teammateSessionIds.splice(idx, 1);
              if (teammateSessionIds.length === 0)
                firstPaneUsed = !1;
              continue;
            }
          }
          throw Error(`Failed to create iTerm2 split pane: ${splitResult.stderr}`);
        }
        if (isFirstTeammate)
          firstPaneUsed = !0;
        let paneId = parseSplitOutput(splitResult.stdout);
        if (!paneId)
          throw Error(`Failed to parse session ID from split output: ${splitResult.stdout}`);
        return logForDebugging(`[ITermBackend] Created teammate pane for ${name3}: ${paneId}`), teammateSessionIds.push(paneId), { paneId, isFirstTeammate };
      }
    } finally {
      releaseLock2();
    }
  }
  async sendCommandToPane(paneId, command12, _useExternalSession) {
    let result = await runIt2(paneId ? ["session", "run", "-s", paneId, command12] : ["session", "run", command12]);
    if (result.code !== 0)
      throw Error(`Failed to send command to iTerm2 pane ${paneId}: ${result.stderr}`);
  }
  async setPaneBorderColor(_paneId, _color, _useExternalSession) {}
  async setPaneTitle(_paneId, _name, _color, _useExternalSession) {}
  async enablePaneBorderStatus(_windowTarget, _useExternalSession) {}
  async rebalancePanes(_windowTarget, _hasLeader) {
    logForDebugging("[ITermBackend] Pane rebalancing not implemented for iTerm2");
  }
  async killPane(paneId, _useExternalSession) {
    let result = await runIt2(["session", "close", "-f", "-s", paneId]), idx = teammateSessionIds.indexOf(paneId);
    if (idx !== -1)
      teammateSessionIds.splice(idx, 1);
    if (teammateSessionIds.length === 0)
      firstPaneUsed = !1;
    return result.code === 0;
  }
  async hidePane(_paneId, _useExternalSession) {
    return logForDebugging("[ITermBackend] hidePane not supported in iTerm2"), !1;
  }
  async showPane(_paneId, _targetWindowOrPane, _useExternalSession) {
    return logForDebugging("[ITermBackend] showPane not supported in iTerm2"), !1;
  }
}
var teammateSessionIds, firstPaneUsed = !1, paneCreationLock2;
var init_ITermBackend = __esm(() => {
  init_debug();
  init_execFileNoThrow();
  init_detection();
  init_registry();
  teammateSessionIds = [], paneCreationLock2 = Promise.resolve();
  registerITermBackend(ITermBackend);
});
