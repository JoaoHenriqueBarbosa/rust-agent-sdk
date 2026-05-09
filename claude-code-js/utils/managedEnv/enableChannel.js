// function: enableChannel
function enableChannel(channel) {
  channel.src = helpers2.eventSourceCall({
    host: channel.host,
    clientKey: channel.clientKey,
    headers: channel.headers
  }), channel.state = "active", channel.src.addEventListener("features", channel.cb), channel.src.addEventListener("features-updated", channel.cb), channel.src.onerror = () => onSSEError(channel), channel.src.onopen = () => {
    channel.errors = 0;
  };
}
