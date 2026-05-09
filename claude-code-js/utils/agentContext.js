// Original: src/utils/agentContext.ts
import { AsyncLocalStorage as AsyncLocalStorage6 } from "async_hooks";
function getAgentContext() {
  return agentContextStorage.getStore();
}
function runWithAgentContext(context6, fn) {
  return agentContextStorage.run(context6, fn);
}
function isSubagentContext(context6) {
  return context6?.agentType === "subagent";
}
function getSubagentLogName() {
  let context6 = getAgentContext();
  if (!isSubagentContext(context6) || !context6.subagentName)
    return;
  return context6.isBuiltIn ? context6.subagentName : "user-defined";
}
function consumeInvokingRequestId() {
  let context6 = getAgentContext();
  if (!context6?.invokingRequestId || context6.invocationEmitted)
    return;
  return context6.invocationEmitted = !0, {
    invokingRequestId: context6.invokingRequestId,
    invocationKind: context6.invocationKind
  };
}
var agentContextStorage;
var init_agentContext = __esm(() => {
  init_agentSwarmsEnabled();
  agentContextStorage = new AsyncLocalStorage6;
});
