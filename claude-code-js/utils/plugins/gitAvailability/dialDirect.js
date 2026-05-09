// function: dialDirect
function dialDirect(host, port, timeoutMs = CONNECT_TIMEOUT_MS) {
  return new Promise((resolve15, reject) => {
    let s2 = netConnect(port, host), settled = !1, done = (err) => {
      if (settled)
        return;
      if (settled = !0, s2.setTimeout(0), err)
        s2.destroy(), reject(err);
      else
        resolve15(s2);
    };
    s2.setTimeout(timeoutMs, () => done(Error("connect timed out"))), s2.once("connect", () => done()), s2.once("error", done), s2.once("close", () => done(Error("socket closed before connect")));
  });
}
