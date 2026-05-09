// function: getIdeClientName
function getIdeClientName(ideClient) {
  let config10 = ideClient?.config;
  return config10?.type === "sse-ide" || config10?.type === "ws-ide" ? config10.ideName : isSupportedTerminal() ? toIDEDisplayName(envDynamic.terminal) : null;
}
