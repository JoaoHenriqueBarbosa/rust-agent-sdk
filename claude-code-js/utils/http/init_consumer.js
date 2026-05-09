// var: init_consumer
var init_consumer = __esm(() => {
  init_msalPlugins();
  pluginContext = {
    cachePluginControl: msalNodeFlowCacheControl,
    nativeBrokerPluginControl: msalNodeFlowNativeBrokerControl,
    vsCodeCredentialControl: msalNodeFlowVSCodeCredentialControl
  };
});
