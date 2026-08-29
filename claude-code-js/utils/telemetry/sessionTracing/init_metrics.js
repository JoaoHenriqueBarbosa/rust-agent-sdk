// var: init_metrics
var init_metrics = __esm(() => {
  init_internal5();
  init_utils9();
  JsonMetricsSerializer = {
    serializeRequest: (arg) => {
      let request2 = createExportMetricsServiceRequest([arg], JSON_ENCODER);
      return (/* @__PURE__ */ new TextEncoder()).encode(JSON.stringify(request2));
    },
    deserializeResponse: (arg) => {
      if (arg.length === 0)
        return {};
      return JSON.parse((/* @__PURE__ */ new TextDecoder()).decode(arg));
    }
  };
});
