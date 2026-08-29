// function: urlIsValid
function urlIsValid(urlRegex, ctx) {
  let url3 = ctx.user.url;
  if (!url3)
    return !1;
  let pathOnly = url3.replace(/^https?:\/\//, "").replace(/^[^/]*\//, "/");
  if (urlRegex.test(url3))
    return !0;
  if (urlRegex.test(pathOnly))
    return !0;
  return !1;
}
