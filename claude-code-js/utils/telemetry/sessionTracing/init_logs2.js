// var: init_logs2
var init_logs2 = __esm(() => {
  init_internal4();
  init_utils9();
  JsonLogsSerializer = {
    serializeRequest: (arg) => {
      let request2 = createExportLogsServiceRequest(arg, JSON_ENCODER);
      return (/* @__PURE__ */ new TextEncoder()).encode(JSON.stringify(request2));
    },
    deserializeResponse: (arg) => {
      if (arg.length === 0)
        return {};
      return JSON.parse((/* @__PURE__ */ new TextDecoder()).decode(arg));
    }
  };
});
