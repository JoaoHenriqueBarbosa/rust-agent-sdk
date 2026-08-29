// Original: src/services/mcp/channelPermissions.ts
function isChannelPermissionRelayEnabled() {
  return !1;
}
function hashToId(input) {
  let h4 = 2166136261;
  for (let i5 = 0;i5 < input.length; i5++)
    h4 ^= input.charCodeAt(i5), h4 = Math.imul(h4, 16777619);
  h4 = h4 >>> 0;
  let s2 = "";
  for (let i5 = 0;i5 < 5; i5++)
    s2 += ID_ALPHABET[h4 % 25], h4 = Math.floor(h4 / 25);
  return s2;
}
function shortRequestId(toolUseID) {
  let candidate = hashToId(toolUseID);
  for (let salt = 0;salt < 10; salt++) {
    if (!ID_AVOID_SUBSTRINGS.some((bad) => candidate.includes(bad)))
      return candidate;
    candidate = hashToId(`${toolUseID}:${salt}`);
  }
  return candidate;
}
function truncateForPreview(input) {
  try {
    let s2 = jsonStringify(input);
    return s2.length > 200 ? s2.slice(0, 200) + "\u2026" : s2;
  } catch {
    return "(unserializable)";
  }
}
function filterPermissionRelayClients(clients, isInAllowlist) {
  return clients.filter((c3) => c3.type === "connected" && isInAllowlist(c3.name) && c3.capabilities?.experimental?.["claude/channel"] !== void 0 && c3.capabilities?.experimental?.["claude/channel/permission"] !== void 0);
}
function createChannelPermissionCallbacks() {
  let pending = /* @__PURE__ */ new Map;
  return {
    onResponse(requestId, handler4) {
      let key3 = requestId.toLowerCase();
      return pending.set(key3, handler4), () => {
        pending.delete(key3);
      };
    },
    resolve(requestId, behavior, fromServer) {
      let key3 = requestId.toLowerCase(), resolver = pending.get(key3);
      if (!resolver)
        return !1;
      return pending.delete(key3), resolver({ behavior, fromServer }), !0;
    }
  };
}
var ID_ALPHABET = "abcdefghijkmnopqrstuvwxyz", ID_AVOID_SUBSTRINGS;
var init_channelPermissions = __esm(() => {
  init_slowOperations();
  ID_AVOID_SUBSTRINGS = [
    "fuck",
    "shit",
    "cunt",
    "cock",
    "dick",
    "twat",
    "piss",
    "crap",
    "bitch",
    "whore",
    "ass",
    "tit",
    "cum",
    "fag",
    "dyke",
    "nig",
    "kike",
    "rape",
    "nazi",
    "damn",
    "poo",
    "pee",
    "wank",
    "anus"
  ];
});
