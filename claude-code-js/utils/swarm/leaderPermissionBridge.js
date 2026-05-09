// Original: src/utils/swarm/leaderPermissionBridge.ts
function registerLeaderToolUseConfirmQueue(setter) {
  registeredSetter = setter;
}
function getLeaderToolUseConfirmQueue() {
  return registeredSetter;
}
function unregisterLeaderToolUseConfirmQueue() {
  registeredSetter = null;
}
function registerLeaderSetToolPermissionContext(setter) {
  registeredPermissionContextSetter = setter;
}
function getLeaderSetToolPermissionContext() {
  return registeredPermissionContextSetter;
}
function unregisterLeaderSetToolPermissionContext() {
  registeredPermissionContextSetter = null;
}
var registeredSetter = null, registeredPermissionContextSetter = null;
