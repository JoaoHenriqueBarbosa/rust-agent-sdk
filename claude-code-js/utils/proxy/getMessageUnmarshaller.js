// function: getMessageUnmarshaller
function getMessageUnmarshaller(deserializer, toUtf83) {
  return async function(message) {
    let { value: messageType } = message.headers[":message-type"];
    if (messageType === "error") {
      let unmodeledError = Error(message.headers[":error-message"].value || "UnknownError");
      throw unmodeledError.name = message.headers[":error-code"].value, unmodeledError;
    } else if (messageType === "exception") {
      let code = message.headers[":exception-type"].value, exception = { [code]: message }, deserializedException = await deserializer(exception);
      if (deserializedException.$unknown) {
        let error41 = Error(toUtf83(message.body));
        throw error41.name = code, error41;
      }
      throw deserializedException[code];
    } else if (messageType === "event") {
      let event = {
        [message.headers[":event-type"].value]: message
      }, deserialized = await deserializer(event);
      if (deserialized.$unknown)
        return;
      return deserialized;
    } else
      throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
  };
}
