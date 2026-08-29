// var: resolveClientEndpointParameters
var resolveClientEndpointParameters = (options) => {
  return Object.assign(options, {
    useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
    useFipsEndpoint: options.useFipsEndpoint ?? !1,
    defaultSigningName: "bedrock"
  });
}, commonParams;
