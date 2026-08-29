// function: IDECommandFlow
function IDECommandFlow({
  availableIDEs,
  unavailableIDEs,
  currentIDE,
  dynamicMcpConfig,
  onChangeDynamicMcpConfig,
  onDone
}) {
  let [connectingIDE, setConnectingIDE] = import_react115.useState(null), ideClient = useAppState((s2) => s2.mcp.clients.find((c3) => c3.name === "ide")), setAppState = useSetAppState(), isFirstCheckRef = import_react115.useRef(!0);
  import_react115.useEffect(() => {
    if (!connectingIDE)
      return;
    if (isFirstCheckRef.current) {
      isFirstCheckRef.current = !1;
      return;
    }
    if (!ideClient || ideClient.type === "pending")
      return;
    if (ideClient.type === "connected")
      onDone(`Connected to ${connectingIDE.name}.`);
    else if (ideClient.type === "failed")
      onDone(`Failed to connect to ${connectingIDE.name}.`);
  }, [ideClient, connectingIDE, onDone]), import_react115.useEffect(() => {
    if (!connectingIDE)
      return;
    let timer = setTimeout(onDone, IDE_CONNECTION_TIMEOUT_MS, `Connection to ${connectingIDE.name} timed out.`);
    return () => clearTimeout(timer);
  }, [connectingIDE, onDone]);
  let handleSelectIDE = import_react115.useCallback((selectedIDE) => {
    if (!onChangeDynamicMcpConfig) {
      onDone("Error connecting to IDE.");
      return;
    }
    let newConfig = {
      ...dynamicMcpConfig || {}
    };
    if (currentIDE)
      delete newConfig.ide;
    if (!selectedIDE) {
      if (ideClient && ideClient.type === "connected" && currentIDE)
        ideClient.client.onclose = () => {}, clearServerCache("ide", ideClient.config), setAppState((prev) => ({
          ...prev,
          mcp: {
            ...prev.mcp,
            clients: prev.mcp.clients.filter((c_0) => c_0.name !== "ide"),
            tools: prev.mcp.tools.filter((t2) => !t2.name?.startsWith("mcp__ide__")),
            commands: prev.mcp.commands.filter((c_1) => !c_1.name?.startsWith("mcp__ide__"))
          }
        }));
      onChangeDynamicMcpConfig(newConfig), onDone(currentIDE ? `Disconnected from ${currentIDE.name}.` : "No IDE selected.");
      return;
    }
    let url3 = selectedIDE.url;
    newConfig.ide = {
      type: url3.startsWith("ws:") ? "ws-ide" : "sse-ide",
      url: url3,
      ideName: selectedIDE.name,
      authToken: selectedIDE.authToken,
      ideRunningInWindows: selectedIDE.ideRunningInWindows,
      scope: "dynamic"
    }, isFirstCheckRef.current = !0, setConnectingIDE(selectedIDE), onChangeDynamicMcpConfig(newConfig);
  }, [dynamicMcpConfig, currentIDE, ideClient, setAppState, onChangeDynamicMcpConfig, onDone]);
  if (connectingIDE)
    return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Connecting to ",
        connectingIDE.name,
        "\u2026"
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(IDEScreen, {
    availableIDEs,
    unavailableIDEs,
    selectedIDE: currentIDE,
    onClose: () => onDone("IDE selection cancelled", {
      display: "system"
    }),
    onSelect: handleSelectIDE
  }, void 0, !1, void 0, this);
}
