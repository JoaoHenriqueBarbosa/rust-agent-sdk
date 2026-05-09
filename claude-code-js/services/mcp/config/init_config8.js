// var: init_config8
var init_config8 = __esm(() => {
  init_mapValues();
  init_memoize();
  init_platform();
  init_common3();
  init_config4();
  init_cwd2();
  init_debug();
  init_errors();
  init_fsOperations();
  init_json();
  init_log3();
  init_mcpPluginIntegration();
  init_pluginLoader();
  init_constants2();
  init_managedPath();
  init_pluginOnlyPolicy();
  init_settings2();
  init_types3();
  init_slowOperations();
  init_claudeai();
  init_types2();
  init_utils7();
  CCR_PROXY_PATH_MARKERS = [
    "/v2/session_ingress/shttp/mcp/",
    "/v2/ccr-sessions/"
  ];
  doesEnterpriseMcpConfigExist = memoize_default(() => {
    let { config: config10 } = parseMcpConfigFromFilePath({
      filePath: getEnterpriseMcpFilePath(),
      expandVars: !0,
      scope: "enterprise"
    });
    return config10 !== null;
  });
});
