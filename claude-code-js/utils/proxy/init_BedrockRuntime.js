// var: init_BedrockRuntime
var init_BedrockRuntime = __esm(() => {
  init_dist_es32();
  init_BedrockRuntimeClient();
  init_ApplyGuardrailCommand();
  init_ConverseCommand();
  init_ConverseStreamCommand();
  init_CountTokensCommand();
  init_GetAsyncInvokeCommand();
  init_InvokeModelCommand();
  init_InvokeModelWithBidirectionalStreamCommand();
  init_InvokeModelWithResponseStreamCommand();
  init_ListAsyncInvokesCommand();
  init_StartAsyncInvokeCommand();
  init_ListAsyncInvokesPaginator();
  commands3 = {
    ApplyGuardrailCommand,
    ConverseCommand,
    ConverseStreamCommand,
    CountTokensCommand,
    GetAsyncInvokeCommand,
    InvokeModelCommand,
    InvokeModelWithBidirectionalStreamCommand,
    InvokeModelWithResponseStreamCommand,
    ListAsyncInvokesCommand,
    StartAsyncInvokeCommand
  }, paginators2 = {
    paginateListAsyncInvokes
  };
  BedrockRuntime = class BedrockRuntime extends BedrockRuntimeClient {
  };
  createAggregatedClient3(commands3, BedrockRuntime, { paginators: paginators2 });
});
