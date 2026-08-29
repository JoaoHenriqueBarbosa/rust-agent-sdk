// function: onHidden
function onHidden() {
  streams.forEach((channel) => {
    if (!channel)
      return;
    channel.state = "idle", disableChannel(channel);
  });
}
