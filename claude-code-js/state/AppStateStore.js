// Original: src/state/AppStateStore.ts
function getDefaultAppState() {
  let teammateUtils = (init_teammate(), __toCommonJS(exports_teammate)), initialMode = teammateUtils.isTeammate() && teammateUtils.isPlanModeRequired() ? "plan" : "default";
  return {
    settings: getInitialSettings(),
    tasks: {},
    agentNameRegistry: /* @__PURE__ */ new Map,
    verbose: !1,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: void 0,
    expandedView: "none",
    isBriefOnly: !1,
    showTeammateMessagePreview: !1,
    selectedIPAgentIndex: -1,
    coordinatorTaskIndex: -1,
    viewSelectionMode: "none",
    footerSelection: null,
    kairosEnabled: !1,
    remoteSessionUrl: void 0,
    remoteConnectionStatus: "connecting",
    remoteBackgroundTaskCount: 0,
    replBridgeEnabled: !1,
    replBridgeExplicit: !1,
    replBridgeOutboundOnly: !1,
    replBridgeConnected: !1,
    replBridgeSessionActive: !1,
    replBridgeReconnecting: !1,
    replBridgeConnectUrl: void 0,
    replBridgeSessionUrl: void 0,
    replBridgeEnvironmentId: void 0,
    replBridgeSessionId: void 0,
    replBridgeError: void 0,
    replBridgeInitialName: void 0,
    showRemoteCallout: !1,
    toolPermissionContext: {
      ...getEmptyToolPermissionContext(),
      mode: initialMode
    },
    agent: void 0,
    agentDefinitions: { activeAgents: [], allAgents: [] },
    fileHistory: {
      snapshots: [],
      trackedFiles: /* @__PURE__ */ new Set,
      snapshotSequence: 0
    },
    attribution: createEmptyAttributionState(),
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {},
      pluginReconnectKey: 0
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      },
      needsRefresh: !1
    },
    todos: {},
    remoteAgentTaskSuggestions: [],
    notifications: {
      current: null,
      queue: []
    },
    elicitation: {
      queue: []
    },
    thinkingEnabled: shouldEnableThinkingByDefault(),
    promptSuggestionEnabled: shouldEnablePromptSuggestion(),
    sessionHooks: /* @__PURE__ */ new Map,
    inbox: {
      messages: []
    },
    workerSandboxPermissions: {
      queue: [],
      selectedIndex: 0
    },
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,
    promptSuggestion: {
      text: null,
      promptId: null,
      shownAt: 0,
      acceptedAt: 0,
      generationRequestId: null
    },
    speculation: IDLE_SPECULATION_STATE,
    speculationSessionTimeSavedMs: 0,
    skillImprovement: {
      suggestion: null
    },
    authVersion: 0,
    initialMessage: null,
    effortValue: void 0,
    activeOverlays: /* @__PURE__ */ new Set,
    fastMode: !1
  };
}
var IDLE_SPECULATION_STATE;
var init_AppStateStore = __esm(() => {
  init_promptSuggestion();
  init_Tool();
  init_commitAttribution();
  init_settings2();
  init_thinking();
  IDLE_SPECULATION_STATE = { status: "idle" };
});
