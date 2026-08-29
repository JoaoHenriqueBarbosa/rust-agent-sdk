// function: getAsyncHookResponseAttachments
async function getAsyncHookResponseAttachments() {
  let responses = await checkForAsyncHookResponses();
  if (responses.length === 0)
    return [];
  logForDebugging(`Hooks: getAsyncHookResponseAttachments found ${responses.length} responses`);
  let attachments = responses.map(({
    processId,
    response: response7,
    hookName,
    hookEvent,
    toolName,
    pluginId,
    stdout,
    stderr,
    exitCode
  }) => {
    return logForDebugging(`Hooks: Creating attachment for ${processId} (${hookName}): ${jsonStringify(response7)}`), {
      type: "async_hook_response",
      processId,
      hookName,
      hookEvent,
      toolName,
      response: response7,
      stdout,
      stderr,
      exitCode
    };
  });
  if (responses.length > 0) {
    let processIds = responses.map((r4) => r4.processId);
    removeDeliveredAsyncHooks(processIds), logForDebugging(`Hooks: Removed ${processIds.length} delivered hooks from registry`);
  }
  return logForDebugging(`Hooks: getAsyncHookResponseAttachments found ${attachments.length} attachments`), attachments;
}
