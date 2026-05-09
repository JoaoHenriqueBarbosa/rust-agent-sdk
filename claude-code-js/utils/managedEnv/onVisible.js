// function: onVisible
function onVisible() {
  streams.forEach((channel) => {
    if (!channel)
      return;
    if (channel.state !== "idle")
      return;
    enableChannel(channel);
  });
}
