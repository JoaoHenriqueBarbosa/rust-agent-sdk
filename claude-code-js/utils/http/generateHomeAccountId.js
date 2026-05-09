// function: generateHomeAccountId
function generateHomeAccountId(serverClientInfo, authType, logger10, cryptoObj, correlationId, idTokenClaims) {
  if (!(authType === AuthorityType.Adfs || authType === AuthorityType.Dsts)) {
    if (serverClientInfo)
      try {
        let clientInfo = buildClientInfo(serverClientInfo, cryptoObj.base64Decode);
        if (clientInfo.uid && clientInfo.utid)
          return `${clientInfo.uid}.${clientInfo.utid}`;
      } catch (e) {}
    logger10.warning("No client info in response", correlationId);
  }
  return idTokenClaims?.sub || "";
}
