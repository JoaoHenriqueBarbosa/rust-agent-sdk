// var: resolveWebSocketConfig
var resolveWebSocketConfig = (input) => {
  let { signer } = input;
  return Object.assign(input, {
    signer: async (authScheme) => {
      let signerObj = await signer(authScheme);
      if (validateSigner(signerObj))
        return new WebsocketSignatureV4({ signer: signerObj });
      throw Error("Expected WebsocketSignatureV4 signer, please check the client constructor.");
    }
  });
}, validateSigner = (signer) => !!signer;
