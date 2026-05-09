// var: resolveClientEndpointParameters2
var resolveClientEndpointParameters2 = (options) => {
  return Object.assign(options, {
    useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
    useFipsEndpoint: options.useFipsEndpoint ?? !1,
    defaultSigningName: "bedrock"
  });
}, commonParams2;
