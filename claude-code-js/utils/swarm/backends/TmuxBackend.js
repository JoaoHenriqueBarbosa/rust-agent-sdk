// Original: src/utils/swarm/backends/TmuxBackend.ts
var exports_TmuxBackend = {};
__export(exports_TmuxBackend, {
  TmuxBackend: () => TmuxBackend
});
function waitForPaneShellReady() {
  return sleep3(PANE_SHELL_INIT_DELAY_MS);
}
function acquirePaneCreationLock() {
  let release, newLock = new Promise((resolve27) => {
    release = resolve27;
  }), previousLock = paneCreationLock;
  return paneCreationLock = newLock, previousLock.then(() => release);
}
function getTmuxColorName(color2) {
  return {
    red: "red",
    blue: "blue",
    green: "green",
    yellow: "yellow",
    purple: "magenta",
    orange: "colour208",
    pink: "colour205",
    cyan: "cyan"
  }[color2];
}
function runTmuxInUserSession(args) {
  return execFileNoThrow(TMUX_COMMAND, args);
}
function runTmuxInSwarm(args) {
  return execFileNoThrow(TMUX_COMMAND, ["-L", getSwarmSocketName(), ...args]);
}

class TmuxBackend {
  type = "tmux";
  displayName = "tmux";
  supportsHideShow = !0;
  async isAvailable() {
    return isTmuxAvailable();
  }
  async isRunningInside() {
    return isInsideTmux();
  }
  async createTeammatePaneInSwarmView(name3, color2) {
    let releaseLock2 = await acquirePaneCreationLock();
    try {
      if (await this.isRunningInside())
        return await this.createTeammatePaneWithLeader(name3, color2);
      return await this.createTeammatePaneExternal(name3, color2);
    } finally {
      releaseLock2();
    }
  }
  async sendCommandToPane(paneId, command12, useExternalSession = !1) {
    let result = await (useExternalSession ? runTmuxInSwarm : runTmuxInUserSession)(["send-keys", "-t", paneId, command12, "Enter"]);
    if (result.code !== 0)
      throw Error(`Failed to send command to pane ${paneId}: ${result.stderr}`);
  }
  async setPaneBorderColor(paneId, color2, useExternalSession = !1) {
    let tmuxColor = getTmuxColorName(color2), runTmux = useExternalSession ? runTmuxInSwarm : runTmuxInUserSession;
    await runTmux([
      "select-pane",
      "-t",
      paneId,
      "-P",
      `bg=default,fg=${tmuxColor}`
    ]), await runTmux([
      "set-option",
      "-p",
      "-t",
      paneId,
      "pane-border-style",
      `fg=${tmuxColor}`
    ]), await runTmux([
      "set-option",
      "-p",
      "-t",
      paneId,
      "pane-active-border-style",
      `fg=${tmuxColor}`
    ]);
  }
  async setPaneTitle(paneId, name3, color2, useExternalSession = !1) {
    let tmuxColor = getTmuxColorName(color2), runTmux = useExternalSession ? runTmuxInSwarm : runTmuxInUserSession;
    await runTmux(["select-pane", "-t", paneId, "-T", name3]), await runTmux([
      "set-option",
      "-p",
      "-t",
      paneId,
      "pane-border-format",
      `#[fg=${tmuxColor},bold] #{pane_title} #[default]`
    ]);
  }
  async enablePaneBorderStatus(windowTarget, useExternalSession = !1) {
    let target = windowTarget || await this.getCurrentWindowTarget();
    if (!target)
      return;
    await (useExternalSession ? runTmuxInSwarm : runTmuxInUserSession)([
      "set-option",
      "-w",
      "-t",
      target,
      "pane-border-status",
      "top"
    ]);
  }
  async rebalancePanes(windowTarget, hasLeader) {
    if (hasLeader)
      await this.rebalancePanesWithLeader(windowTarget);
    else
      await this.rebalancePanesTiled(windowTarget);
  }
  async killPane(paneId, useExternalSession = !1) {
    return (await (useExternalSession ? runTmuxInSwarm : runTmuxInUserSession)(["kill-pane", "-t", paneId])).code === 0;
  }
  async hidePane(paneId, useExternalSession = !1) {
    let runTmux = useExternalSession ? runTmuxInSwarm : runTmuxInUserSession;
    await runTmux(["new-session", "-d", "-s", HIDDEN_SESSION_NAME]);
    let result = await runTmux([
      "break-pane",
      "-d",
      "-s",
      paneId,
      "-t",
      `${HIDDEN_SESSION_NAME}:`
    ]);
    if (result.code === 0)
      logForDebugging(`[TmuxBackend] Hidden pane ${paneId}`);
    else
      logForDebugging(`[TmuxBackend] Failed to hide pane ${paneId}: ${result.stderr}`);
    return result.code === 0;
  }
  async showPane(paneId, targetWindowOrPane, useExternalSession = !1) {
    let runTmux = useExternalSession ? runTmuxInSwarm : runTmuxInUserSession, result = await runTmux([
      "join-pane",
      "-h",
      "-s",
      paneId,
      "-t",
      targetWindowOrPane
    ]);
    if (result.code !== 0)
      return logForDebugging(`[TmuxBackend] Failed to show pane ${paneId}: ${result.stderr}`), !1;
    logForDebugging(`[TmuxBackend] Showed pane ${paneId} in ${targetWindowOrPane}`), await runTmux(["select-layout", "-t", targetWindowOrPane, "main-vertical"]);
    let panes = (await runTmux([
      "list-panes",
      "-t",
      targetWindowOrPane,
      "-F",
      "#{pane_id}"
    ])).stdout.trim().split(`
`).filter(Boolean);
    if (panes[0])
      await runTmux(["resize-pane", "-t", panes[0], "-x", "30%"]);
    return !0;
  }
  async getCurrentPaneId() {
    let leaderPane = getLeaderPaneId();
    if (leaderPane)
      return leaderPane;
    let result = await execFileNoThrow(TMUX_COMMAND, [
      "display-message",
      "-p",
      "#{pane_id}"
    ]);
    if (result.code !== 0)
      return logForDebugging(`[TmuxBackend] Failed to get current pane ID (exit ${result.code}): ${result.stderr}`), null;
    return result.stdout.trim();
  }
  async getCurrentWindowTarget() {
    if (cachedLeaderWindowTarget)
      return cachedLeaderWindowTarget;
    let leaderPane = getLeaderPaneId(), args = ["display-message"];
    if (leaderPane)
      args.push("-t", leaderPane);
    args.push("-p", "#{session_name}:#{window_index}");
    let result = await execFileNoThrow(TMUX_COMMAND, args);
    if (result.code !== 0)
      return logForDebugging(`[TmuxBackend] Failed to get current window target (exit ${result.code}): ${result.stderr}`), null;
    return cachedLeaderWindowTarget = result.stdout.trim(), cachedLeaderWindowTarget;
  }
  async getCurrentWindowPaneCount(windowTarget, useSwarmSocket = !1) {
    let target = windowTarget || await this.getCurrentWindowTarget();
    if (!target)
      return null;
    let args = ["list-panes", "-t", target, "-F", "#{pane_id}"], result = useSwarmSocket ? await runTmuxInSwarm(args) : await runTmuxInUserSession(args);
    if (result.code !== 0)
      return logError2(Error(`[TmuxBackend] Failed to get pane count for ${target} (exit ${result.code}): ${result.stderr}`)), null;
    return count2(result.stdout.trim().split(`
`), Boolean);
  }
  async hasSessionInSwarm(sessionName) {
    return (await runTmuxInSwarm(["has-session", "-t", sessionName])).code === 0;
  }
  async createExternalSwarmSession() {
    if (!await this.hasSessionInSwarm(SWARM_SESSION_NAME)) {
      let result = await runTmuxInSwarm([
        "new-session",
        "-d",
        "-s",
        SWARM_SESSION_NAME,
        "-n",
        SWARM_VIEW_WINDOW_NAME,
        "-P",
        "-F",
        "#{pane_id}"
      ]);
      if (result.code !== 0)
        throw Error(`Failed to create swarm session: ${result.stderr || "Unknown error"}`);
      let paneId = result.stdout.trim(), windowTarget2 = `${SWARM_SESSION_NAME}:${SWARM_VIEW_WINDOW_NAME}`;
      return logForDebugging(`[TmuxBackend] Created external swarm session with window ${windowTarget2}, pane ${paneId}`), { windowTarget: windowTarget2, paneId };
    }
    let windows2 = (await runTmuxInSwarm([
      "list-windows",
      "-t",
      SWARM_SESSION_NAME,
      "-F",
      "#{window_name}"
    ])).stdout.trim().split(`
`).filter(Boolean), windowTarget = `${SWARM_SESSION_NAME}:${SWARM_VIEW_WINDOW_NAME}`;
    if (windows2.includes(SWARM_VIEW_WINDOW_NAME)) {
      let panes = (await runTmuxInSwarm([
        "list-panes",
        "-t",
        windowTarget,
        "-F",
        "#{pane_id}"
      ])).stdout.trim().split(`
`).filter(Boolean);
      return { windowTarget, paneId: panes[0] || "" };
    }
    let createResult = await runTmuxInSwarm([
      "new-window",
      "-t",
      SWARM_SESSION_NAME,
      "-n",
      SWARM_VIEW_WINDOW_NAME,
      "-P",
      "-F",
      "#{pane_id}"
    ]);
    if (createResult.code !== 0)
      throw Error(`Failed to create swarm-view window: ${createResult.stderr || "Unknown error"}`);
    return { windowTarget, paneId: createResult.stdout.trim() };
  }
  async createTeammatePaneWithLeader(teammateName, teammateColor) {
    let currentPaneId = await this.getCurrentPaneId(), windowTarget = await this.getCurrentWindowTarget();
    if (!currentPaneId || !windowTarget)
      throw Error("Could not determine current tmux pane/window");
    let paneCount = await this.getCurrentWindowPaneCount(windowTarget);
    if (paneCount === null)
      throw Error("Could not determine pane count for current window");
    let isFirstTeammate = paneCount === 1, splitResult;
    if (isFirstTeammate)
      splitResult = await execFileNoThrow(TMUX_COMMAND, [
        "split-window",
        "-t",
        currentPaneId,
        "-h",
        "-l",
        "70%",
        "-P",
        "-F",
        "#{pane_id}"
      ]);
    else {
      let teammatePanes = (await execFileNoThrow(TMUX_COMMAND, [
        "list-panes",
        "-t",
        windowTarget,
        "-F",
        "#{pane_id}"
      ])).stdout.trim().split(`
`).filter(Boolean).slice(1), teammateCount = teammatePanes.length, splitVertically = teammateCount % 2 === 1, targetPaneIndex = Math.floor((teammateCount - 1) / 2), targetPane = teammatePanes[targetPaneIndex] || teammatePanes[teammatePanes.length - 1];
      splitResult = await execFileNoThrow(TMUX_COMMAND, [
        "split-window",
        "-t",
        targetPane,
        splitVertically ? "-v" : "-h",
        "-P",
        "-F",
        "#{pane_id}"
      ]);
    }
    if (splitResult.code !== 0)
      throw Error(`Failed to create teammate pane: ${splitResult.stderr}`);
    let paneId = splitResult.stdout.trim();
    return logForDebugging(`[TmuxBackend] Created teammate pane for ${teammateName}: ${paneId}`), await this.setPaneBorderColor(paneId, teammateColor), await this.setPaneTitle(paneId, teammateName, teammateColor), await this.rebalancePanesWithLeader(windowTarget), await waitForPaneShellReady(), { paneId, isFirstTeammate };
  }
  async createTeammatePaneExternal(teammateName, teammateColor) {
    let { windowTarget, paneId: firstPaneId } = await this.createExternalSwarmSession(), paneCount = await this.getCurrentWindowPaneCount(windowTarget, !0);
    if (paneCount === null)
      throw Error("Could not determine pane count for swarm window");
    let isFirstTeammate = !firstPaneUsedForExternal && paneCount === 1, paneId;
    if (isFirstTeammate)
      paneId = firstPaneId, firstPaneUsedForExternal = !0, logForDebugging(`[TmuxBackend] Using initial pane for first teammate ${teammateName}: ${paneId}`), await this.enablePaneBorderStatus(windowTarget, !0);
    else {
      let panes = (await runTmuxInSwarm([
        "list-panes",
        "-t",
        windowTarget,
        "-F",
        "#{pane_id}"
      ])).stdout.trim().split(`
`).filter(Boolean), teammateCount = panes.length, splitVertically = teammateCount % 2 === 1, targetPaneIndex = Math.floor((teammateCount - 1) / 2), targetPane = panes[targetPaneIndex] || panes[panes.length - 1], splitResult = await runTmuxInSwarm([
        "split-window",
        "-t",
        targetPane,
        splitVertically ? "-v" : "-h",
        "-P",
        "-F",
        "#{pane_id}"
      ]);
      if (splitResult.code !== 0)
        throw Error(`Failed to create teammate pane: ${splitResult.stderr}`);
      paneId = splitResult.stdout.trim(), logForDebugging(`[TmuxBackend] Created teammate pane for ${teammateName}: ${paneId}`);
    }
    return await this.setPaneBorderColor(paneId, teammateColor, !0), await this.setPaneTitle(paneId, teammateName, teammateColor, !0), await this.rebalancePanesTiled(windowTarget), await waitForPaneShellReady(), { paneId, isFirstTeammate };
  }
  async rebalancePanesWithLeader(windowTarget) {
    let panes = (await runTmuxInUserSession([
      "list-panes",
      "-t",
      windowTarget,
      "-F",
      "#{pane_id}"
    ])).stdout.trim().split(`
`).filter(Boolean);
    if (panes.length <= 2)
      return;
    await runTmuxInUserSession([
      "select-layout",
      "-t",
      windowTarget,
      "main-vertical"
    ]);
    let leaderPane = panes[0];
    await runTmuxInUserSession(["resize-pane", "-t", leaderPane, "-x", "30%"]), logForDebugging(`[TmuxBackend] Rebalanced ${panes.length - 1} teammate panes with leader`);
  }
  async rebalancePanesTiled(windowTarget) {
    let panes = (await runTmuxInSwarm([
      "list-panes",
      "-t",
      windowTarget,
      "-F",
      "#{pane_id}"
    ])).stdout.trim().split(`
`).filter(Boolean);
    if (panes.length <= 1)
      return;
    await runTmuxInSwarm(["select-layout", "-t", windowTarget, "tiled"]), logForDebugging(`[TmuxBackend] Rebalanced ${panes.length} teammate panes with tiled layout`);
  }
}
var firstPaneUsedForExternal = !1, cachedLeaderWindowTarget = null, paneCreationLock, PANE_SHELL_INIT_DELAY_MS = 200;
var init_TmuxBackend = __esm(() => {
  init_debug();
  init_execFileNoThrow();
  init_log3();
  init_detection();
  init_registry();
  paneCreationLock = Promise.resolve();
  registerTmuxBackend(TmuxBackend);
});
