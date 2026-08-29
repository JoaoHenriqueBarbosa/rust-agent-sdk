// function: getMcpServerSignature
function getMcpServerSignature(config10) {
  let cmd = getServerCommandArray(config10);
  if (cmd)
    return `stdio:${jsonStringify(cmd)}`;
  let url3 = getServerUrl(config10);
  if (url3)
    return `url:${unwrapCcrProxyUrl(url3)}`;
  return null;
}
