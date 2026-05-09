// function: setMcpServerEnabled
function setMcpServerEnabled(name3, enabled2) {
  let isBuiltinStateChange = isDefaultDisabledBuiltin(name3) && isMcpServerDisabled(name3) === enabled2;
  if (saveCurrentProjectConfig((current) => {
    if (isDefaultDisabledBuiltin(name3)) {
      let prev2 = current.enabledMcpServers || [], next2 = toggleMembership(prev2, name3, enabled2);
      if (next2 === prev2)
        return current;
      return { ...current, enabledMcpServers: next2 };
    }
    let prev = current.disabledMcpServers || [], next = toggleMembership(prev, name3, !enabled2);
    if (next === prev)
      return current;
    return { ...current, disabledMcpServers: next };
  }), isBuiltinStateChange)
    logEvent("tengu_builtin_mcp_toggle", {
      serverName: name3,
      enabled: enabled2
    });
}
