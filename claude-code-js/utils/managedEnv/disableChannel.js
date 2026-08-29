// function: disableChannel
function disableChannel(channel) {
  if (!channel.src)
    return;
  if (channel.src.onopen = null, channel.src.onerror = null, channel.src.close(), channel.src = null, channel.state === "active")
    channel.state = "disabled";
}
