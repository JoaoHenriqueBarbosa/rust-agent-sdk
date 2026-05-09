// function: promiseTimeout
async function promiseTimeout(promise3, timeout) {
  return new Promise((resolve45) => {
    let resolved = !1, timer, finish = (data) => {
      if (resolved)
        return;
      resolved = !0, timer && clearTimeout(timer), resolve45(data || null);
    };
    if (timeout)
      timer = setTimeout(() => finish(), timeout);
    promise3.then((data) => finish(data)).catch(() => finish());
  });
}
