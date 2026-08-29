// function: isMcpSessionExpiredError
function isMcpSessionExpiredError(error44) {
  if (("code" in error44 ? error44.code : void 0) !== 404)
    return !1;
  return error44.message.includes('"code":-32001') || error44.message.includes('"code": -32001');
}
