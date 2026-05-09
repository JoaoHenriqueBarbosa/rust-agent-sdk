// function: buildSystemPromptBlocks
function buildSystemPromptBlocks(systemPrompt, enablePromptCaching, options2) {
  return splitSysPromptPrefix(systemPrompt, {
    skipGlobalCacheForSystemPrompt: options2?.skipGlobalCacheForSystemPrompt
  }).map((block2) => {
    return {
      type: "text",
      text: block2.text,
      ...enablePromptCaching && block2.cacheScope !== null && {
        cache_control: getCacheControl({
          scope: block2.cacheScope,
          querySource: options2?.querySource
        })
      }
    };
  });
}
