// function: waitForNetworkInitialization
async function waitForNetworkInitialization() {
  if (!config8)
    return !1;
  if (initializationPromise)
    try {
      return await initializationPromise, !0;
    } catch {
      return !1;
    }
  return managerContext !== void 0;
}
