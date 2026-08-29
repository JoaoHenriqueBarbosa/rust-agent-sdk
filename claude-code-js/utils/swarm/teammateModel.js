// Original: src/utils/swarm/teammateModel.ts
function getHardcodedTeammateModelFallback() {
  return CLAUDE_OPUS_4_6_CONFIG[getAPIProvider()];
}
var init_teammateModel = __esm(() => {
  init_configs();
  init_providers();
});
