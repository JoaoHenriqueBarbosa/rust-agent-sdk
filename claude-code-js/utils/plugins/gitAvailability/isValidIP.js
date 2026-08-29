// function: isValidIP
function isValidIP(ip, version5) {
  if ((version5 === "v4" || !version5) && ipv4Regex.test(ip))
    return !0;
  if ((version5 === "v6" || !version5) && ipv6Regex.test(ip))
    return !0;
  return !1;
}
