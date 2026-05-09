// function: parseServerErrorNo
function parseServerErrorNo(serverResponse) {
  let errorCodePrefixIndex = serverResponse.error_uri?.lastIndexOf("code=");
  return errorCodePrefixIndex && errorCodePrefixIndex >= 0 ? serverResponse.error_uri?.substring(errorCodePrefixIndex + 5) : void 0;
}
