// Original: src/hooks/useIdeConnectionStatus.ts
function useIdeConnectionStatus(mcpClients) {
  return import_react223.useMemo(() => {
    let ideClient = mcpClients?.find((client16) => client16.name === "ide");
    if (!ideClient)
      return { status: null, ideName: null };
    let config11 = ideClient.config, ideName = config11.type === "sse-ide" || config11.type === "ws-ide" ? config11.ideName : null;
    if (ideClient.type === "connected")
      return { status: "connected", ideName };
    if (ideClient.type === "pending")
      return { status: "pending", ideName };
    return { status: "disconnected", ideName };
  }, [mcpClients]);
}
var import_react223;
var init_useIdeConnectionStatus = __esm(() => {
  import_react223 = __toESM(require_react_development(), 1);
});
