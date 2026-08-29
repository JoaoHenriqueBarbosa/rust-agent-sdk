// function: isValidHost
function isValidHost(h4) {
  if (!h4 || h4.length > 255)
    return !1;
  let bare = stripBrackets(h4);
  if (bare.includes("%"))
    return !1;
  if (isIP(bare))
    return !0;
  return /^[A-Za-z0-9._-]+$/.test(bare);
}
