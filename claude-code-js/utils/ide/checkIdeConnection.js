// function: checkIdeConnection
async function checkIdeConnection(host, port, timeout = 500) {
  try {
    return new Promise((resolve25) => {
      let socket = createConnection({
        host,
        port,
        timeout
      });
      socket.on("connect", () => {
        socket.destroy(), resolve25(!0);
      }), socket.on("error", () => {
        resolve25(!1);
      }), socket.on("timeout", () => {
        socket.destroy(), resolve25(!1);
      });
    });
  } catch (_) {
    return !1;
  }
}
