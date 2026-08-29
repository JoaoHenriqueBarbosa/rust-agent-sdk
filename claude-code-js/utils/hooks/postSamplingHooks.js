// Original: src/utils/hooks/postSamplingHooks.ts
function registerPostSamplingHook(hook) {
  postSamplingHooks.push(hook);
}
async function executePostSamplingHooks(messages, systemPrompt, userContext, systemContext, toolUseContext, querySource) {
  let context3 = {
    messages,
    systemPrompt,
    userContext,
    systemContext,
    toolUseContext,
    querySource
  };
  for (let hook of postSamplingHooks)
    try {
      await hook(context3);
    } catch (error44) {
      logError2(toError(error44));
    }
}
var postSamplingHooks;
var init_postSamplingHooks = __esm(() => {
  init_errors();
  init_log3();
  postSamplingHooks = [];
});
