// var: require_EndpointParameters
var require_EndpointParameters = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.commonParams = exports.resolveClientEndpointParameters = void 0;
  var resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
      useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
      useFipsEndpoint: options.useFipsEndpoint ?? !1,
      useGlobalEndpoint: options.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    });
  };
  exports.resolveClientEndpointParameters = resolveClientEndpointParameters;
  exports.commonParams = {
    UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
  };
});
