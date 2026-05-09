// function: isValidCidr
function isValidCidr(ip, version5) {
  if ((version5 === "v4" || !version5) && ipv4CidrRegex.test(ip))
    return !0;
  if ((version5 === "v6" || !version5) && ipv6CidrRegex.test(ip))
    return !0;
  return !1;
}
