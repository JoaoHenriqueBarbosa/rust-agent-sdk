// function: stripHopByHop
function stripHopByHop(h4) {
  let extra = /* @__PURE__ */ new Set, connHeader = h4.connection;
  if (connHeader)
    for (let tok of String(connHeader).split(","))
      extra.add(tok.trim().toLowerCase());
  let out = {};
  for (let [k3, v2] of Object.entries(h4)) {
    let lk = k3.toLowerCase();
    if (!HOP_BY_HOP.has(lk) && !extra.has(lk))
      out[k3] = v2;
  }
  return out;
}
