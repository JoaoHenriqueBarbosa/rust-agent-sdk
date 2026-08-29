// var: CONNECT_TIMEOUT_MS
var CONNECT_TIMEOUT_MS = 30000, HOP_BY_HOP, LOOPBACK;
var init_parent_proxy = __esm(() => {
  HOP_BY_HOP = /* @__PURE__ */ new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "proxy-connection",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade"
  ]);
  LOOPBACK = (() => {
    let bl = new BlockList;
    return bl.addSubnet("127.0.0.0", 8, "ipv4"), bl.addAddress("::1", "ipv6"), bl.addSubnet("::ffff:127.0.0.0", 104, "ipv6"), bl;
  })();
});
