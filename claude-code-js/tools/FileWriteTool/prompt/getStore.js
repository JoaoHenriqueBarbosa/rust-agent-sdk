// function: getStore
function getStore() {
  let store = hookStorage.getStore();
  if (!store)
    throw new HookError("[Inquirer] Hook functions can only be called from within a prompt");
  return store;
}
