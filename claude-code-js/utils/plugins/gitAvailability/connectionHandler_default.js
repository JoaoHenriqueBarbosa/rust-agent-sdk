// function: connectionHandler_default
function connectionHandler_default(connection7, sendStatus) {
  if (connection7.command !== "connect")
    return sendStatus("COMMAND_NOT_SUPPORTED");
  connection7.socket.on("error", () => {});
  let stream10 = net.createConnection({
    host: connection7.destAddress,
    port: connection7.destPort
  });
  stream10.setNoDelay();
  let streamOpened = !1;
  return stream10.on("error", (err) => {
    if (!streamOpened)
      switch (err.code) {
        case "EINVAL":
        case "ENOENT":
        case "ENOTFOUND":
        case "ETIMEDOUT":
        case "EADDRNOTAVAIL":
        case "EHOSTUNREACH":
          sendStatus("HOST_UNREACHABLE");
          break;
        case "ENETUNREACH":
          sendStatus("NETWORK_UNREACHABLE");
          break;
        case "ECONNREFUSED":
          sendStatus("CONNECTION_REFUSED");
          break;
        default:
          sendStatus("GENERAL_FAILURE");
      }
  }), stream10.on("ready", () => {
    streamOpened = !0, sendStatus("REQUEST_GRANTED"), connection7.socket.pipe(stream10).pipe(connection7.socket);
  }), connection7.socket.on("close", () => stream10.destroy()), stream10;
}
