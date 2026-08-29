// Original: src/utils/hooks/ssrfGuard.ts
import { lookup as dnsLookup } from "dns";
import { isIP as isIP3 } from "net";
function isBlockedAddress(address) {
  let v2 = isIP3(address);
  if (v2 === 4)
    return isBlockedV4(address);
  if (v2 === 6)
    return isBlockedV6(address);
  return !1;
}
function isBlockedV4(address) {
  let parts = address.split(".").map(Number), [a2, b] = parts;
  if (parts.length !== 4 || a2 === void 0 || b === void 0 || parts.some((n6) => Number.isNaN(n6)))
    return !1;
  if (a2 === 127)
    return !1;
  if (a2 === 0)
    return !0;
  if (a2 === 10)
    return !0;
  if (a2 === 169 && b === 254)
    return !0;
  if (a2 === 172 && b >= 16 && b <= 31)
    return !0;
  if (a2 === 100 && b >= 64 && b <= 127)
    return !0;
  if (a2 === 192 && b === 168)
    return !0;
  return !1;
}
function isBlockedV6(address) {
  let lower = address.toLowerCase();
  if (lower === "::1")
    return !1;
  if (lower === "::")
    return !0;
  let mappedV4 = extractMappedIPv4(lower);
  if (mappedV4 !== null)
    return isBlockedV4(mappedV4);
  if (lower.startsWith("fc") || lower.startsWith("fd"))
    return !0;
  let firstHextet = lower.split(":")[0];
  if (firstHextet && firstHextet.length === 4 && firstHextet >= "fe80" && firstHextet <= "febf")
    return !0;
  return !1;
}
function expandIPv6Groups(addr) {
  let tailHextets = [];
  if (addr.includes(".")) {
    let lastColon = addr.lastIndexOf(":"), v42 = addr.slice(lastColon + 1);
    addr = addr.slice(0, lastColon);
    let octets = v42.split(".").map(Number);
    if (octets.length !== 4 || octets.some((n6) => !Number.isInteger(n6) || n6 < 0 || n6 > 255))
      return null;
    tailHextets = [
      octets[0] << 8 | octets[1],
      octets[2] << 8 | octets[3]
    ];
  }
  let dbl = addr.indexOf("::"), head, tail;
  if (dbl === -1)
    head = addr.split(":"), tail = [];
  else {
    let headStr = addr.slice(0, dbl), tailStr = addr.slice(dbl + 2);
    head = headStr === "" ? [] : headStr.split(":"), tail = tailStr === "" ? [] : tailStr.split(":");
  }
  let fill = 8 - tailHextets.length - head.length - tail.length;
  if (fill < 0)
    return null;
  let nums = [...head, ...Array(fill).fill("0"), ...tail].map((h4) => parseInt(h4, 16));
  if (nums.some((n6) => Number.isNaN(n6) || n6 < 0 || n6 > 65535))
    return null;
  return nums.push(...tailHextets), nums.length === 8 ? nums : null;
}
function extractMappedIPv4(addr) {
  let g = expandIPv6Groups(addr);
  if (!g)
    return null;
  if (g[0] === 0 && g[1] === 0 && g[2] === 0 && g[3] === 0 && g[4] === 0 && g[5] === 65535) {
    let hi = g[6], lo = g[7];
    return `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
  }
  return null;
}
function ssrfGuardedLookup(hostname2, options2, callback) {
  let wantsAll = "all" in options2 && options2.all === !0, ipVersion = isIP3(hostname2);
  if (ipVersion !== 0) {
    if (isBlockedAddress(hostname2)) {
      callback(ssrfError(hostname2, hostname2), "");
      return;
    }
    let family = ipVersion === 6 ? 6 : 4;
    if (wantsAll)
      callback(null, [{ address: hostname2, family }]);
    else
      callback(null, hostname2, family);
    return;
  }
  dnsLookup(hostname2, { all: !0 }, (err2, addresses) => {
    if (err2) {
      callback(err2, "");
      return;
    }
    for (let { address } of addresses)
      if (isBlockedAddress(address)) {
        callback(ssrfError(hostname2, address), "");
        return;
      }
    let first = addresses[0];
    if (!first) {
      callback(Object.assign(Error(`ENOTFOUND ${hostname2}`), {
        code: "ENOTFOUND",
        hostname: hostname2
      }), "");
      return;
    }
    let family = first.family === 6 ? 6 : 4;
    if (wantsAll)
      callback(null, addresses.map((a2) => ({
        address: a2.address,
        family: a2.family === 6 ? 6 : 4
      })));
    else
      callback(null, first.address, family);
  });
}
function ssrfError(hostname2, address) {
  let err2 = Error(`HTTP hook blocked: ${hostname2} resolves to ${address} (private/link-local address). Loopback (127.0.0.1, ::1) is allowed for local dev.`);
  return Object.assign(err2, {
    code: "ERR_HTTP_HOOK_BLOCKED_ADDRESS",
    hostname: hostname2,
    address
  });
}
var init_ssrfGuard = () => {};
