// function: resolveEventStreamConfig
function resolveEventStreamConfig(input) {
  let { signer: eventSigner, signer: messageSigner } = input, newInput = Object.assign(input, {
    eventSigner,
    messageSigner
  }), eventStreamPayloadHandler = newInput.eventStreamPayloadHandlerProvider(newInput);
  return Object.assign(newInput, {
    eventStreamPayloadHandler
  });
}
