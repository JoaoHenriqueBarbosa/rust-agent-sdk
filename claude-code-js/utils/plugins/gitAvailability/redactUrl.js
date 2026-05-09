// function: redactUrl
function redactUrl(u5) {
  if (!u5)
    return "-";
  if (!u5.username && !u5.password)
    return u5.href;
  let c3 = new URL2(u5.href);
  return c3.username = "***", c3.password = "***", c3.href;
}
