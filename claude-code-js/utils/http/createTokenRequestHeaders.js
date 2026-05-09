// function: createTokenRequestHeaders
function createTokenRequestHeaders(logger10, preventCorsPreflight, ccsCred) {
  let headers = {};
  if (headers[HeaderNames.CONTENT_TYPE] = URL_FORM_CONTENT_TYPE, !preventCorsPreflight && ccsCred)
    switch (ccsCred.type) {
      case CcsCredentialType.HOME_ACCOUNT_ID:
        try {
          let clientInfo = buildClientInfoFromHomeAccountId(ccsCred.credential);
          headers[HeaderNames.CCS_HEADER] = `Oid:${clientInfo.uid}@${clientInfo.utid}`;
        } catch (e) {
          logger10.verbose(`Could not parse home account ID for CCS Header: '${e}'`, "");
        }
        break;
      case CcsCredentialType.UPN:
        headers[HeaderNames.CCS_HEADER] = `UPN: ${ccsCred.credential}`;
        break;
    }
  return headers;
}
