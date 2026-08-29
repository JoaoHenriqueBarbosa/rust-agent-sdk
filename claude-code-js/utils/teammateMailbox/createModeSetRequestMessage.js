// function: createModeSetRequestMessage
function createModeSetRequestMessage(params) {
  return {
    type: "mode_set_request",
    mode: params.mode,
    from: params.from
  };
}
