// function: isNetworkError
function isNetworkError(err) {
  if (err.errorCode === "network_error")
    return !0;
  if (err.code === "ENETUNREACH" || err.code === "EHOSTUNREACH")
    return !0;
  if (err.statusCode === 403 || err.code === 403) {
    if (err.message.includes("unreachable"))
      return !0;
  }
  return !1;
}
