// function: isAbsoluteURL2
function isAbsoluteURL2(url3) {
  if (typeof url3 !== "string")
    return !1;
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url3);
}
