// function: isHashedString
function isHashedString(str) {
  if (str.length !== 6)
    return !1;
  for (let i4 = 0;i4 < str.length; i4++) {
    let char = str[i4];
    if (!(char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char >= "0" && char <= "9"))
      return !1;
  }
  return !0;
}
