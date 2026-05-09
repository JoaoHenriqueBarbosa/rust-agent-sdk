// var: init_trace
var init_trace = __esm(() => {
  init_internal6();
  init_utils9();
  JsonTraceSerializer = {
    serializeRequest: (arg) => {
      let request2 = createExportTraceServiceRequest(arg, JSON_ENCODER);
      return (/* @__PURE__ */ new TextEncoder()).encode(JSON.stringify(request2));
    },
    deserializeResponse: (arg) => {
      if (arg.length === 0)
        return {};
      return JSON.parse((/* @__PURE__ */ new TextDecoder()).decode(arg));
    }
  };
});
