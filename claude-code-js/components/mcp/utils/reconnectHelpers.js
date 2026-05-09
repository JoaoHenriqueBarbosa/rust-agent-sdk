// Original: src/components/mcp/utils/reconnectHelpers.tsx
function handleReconnectResult(result, serverName) {
  switch (result.client.type) {
    case "connected":
      return {
        message: `Reconnected to ${serverName}.`,
        success: !0
      };
    case "needs-auth":
      return {
        message: `${serverName} requires authentication. Use the 'Authenticate' option.`,
        success: !1
      };
    case "failed":
      return {
        message: `Failed to reconnect to ${serverName}.`,
        success: !1
      };
    default:
      return {
        message: `Unknown result when reconnecting to ${serverName}.`,
        success: !1
      };
  }
}
function handleReconnectError(error44, serverName) {
  let errorMessage3 = error44 instanceof Error ? error44.message : String(error44);
  return `Error reconnecting to ${serverName}: ${errorMessage3}`;
}
