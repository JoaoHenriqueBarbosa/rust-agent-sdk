// function: getApiHosts
function getApiHosts(options2) {
  let defaultHost = options2.apiHost || "https://cdn.growthbook.io";
  return {
    apiHost: defaultHost.replace(/\/*$/, ""),
    streamingHost: (options2.streamingHost || defaultHost).replace(/\/*$/, ""),
    apiRequestHeaders: options2.apiHostRequestHeaders,
    streamingHostRequestHeaders: options2.streamingHostRequestHeaders
  };
}
