// function: ghIsDangerousCallback
function ghIsDangerousCallback(_rawCommand, args) {
  for (let token of args) {
    if (!token)
      continue;
    let value = token;
    if (token.startsWith("-")) {
      let eqIdx = token.indexOf("=");
      if (eqIdx === -1)
        continue;
      if (value = token.slice(eqIdx + 1), !value)
        continue;
    }
    if (!value.includes("/") && !value.includes("://") && !value.includes("@"))
      continue;
    if (value.includes("://"))
      return !0;
    if (value.includes("@"))
      return !0;
    if ((value.match(/\//g) || []).length >= 2)
      return !0;
  }
  return !1;
}
