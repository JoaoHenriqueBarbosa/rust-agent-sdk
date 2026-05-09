// function: onSSEError
function onSSEError(channel) {
  if (channel.state === "idle")
    return;
  if (channel.errors++, channel.errors > 3 || channel.src && channel.src.readyState === 2) {
    let delay4 = Math.pow(3, channel.errors - 3) * (1000 + Math.random() * 1000);
    disableChannel(channel), setTimeout(() => {
      if (["idle", "active"].includes(channel.state))
        return;
      enableChannel(channel);
    }, Math.min(delay4, 300000));
  }
}
