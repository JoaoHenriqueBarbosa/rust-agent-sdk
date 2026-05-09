// var: resolveClientEndpointParameters3
var resolveClientEndpointParameters3 = (options) => {
  return Object.assign(options, {
    useDualstackEndpoint: options.useDualstackEndpoint ?? !1,
    useFipsEndpoint: options.useFipsEndpoint ?? !1,
    useGlobalEndpoint: options.useGlobalEndpoint ?? !1,
    defaultSigningName: "sts"
  });
}, commonParams3;
