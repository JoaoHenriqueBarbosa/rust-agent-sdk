// var: init_execa
var init_execa = __esm(() => {
  init_create();
  init_command2();
  init_node2();
  init_script();
  init_methods();
  execa = createExeca(() => ({})), execaSync = createExeca(() => ({ isSync: !0 })), execaCommand = createExeca(mapCommandAsync), execaCommandSync = createExeca(mapCommandSync), execaNode = createExeca(mapNode), $ = createExeca(mapScriptAsync, {}, deepScriptOptions, setScriptSync), {
    sendMessage: sendMessage2,
    getOneMessage: getOneMessage2,
    getEachMessage: getEachMessage2,
    getCancelSignal: getCancelSignal2
  } = getIpcExport();
});
