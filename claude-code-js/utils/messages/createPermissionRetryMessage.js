// function: createPermissionRetryMessage
function createPermissionRetryMessage(commands7) {
  return {
    type: "system",
    subtype: "permission_retry",
    content: `Allowed ${commands7.join(", ")}`,
    commands: commands7,
    level: "info",
    isMeta: !1,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22()
  };
}
