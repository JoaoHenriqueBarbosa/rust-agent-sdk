// function: canonicalizeHost
function canonicalizeHost(h4) {
  try {
    let bare = stripBrackets(h4), bracketed = isIP(bare) === 6 ? `[${bare}]` : bare, out = new URL2(`http://${bracketed}/`).hostname;
    return stripBrackets(out).replace(/\.$/, "");
  } catch {
    return;
  }
}
