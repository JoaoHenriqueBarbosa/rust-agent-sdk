// function: getSendCertificateChain
function getSendCertificateChain() {
  let sendCertificateChain = (process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN ?? "").toLowerCase(), result = sendCertificateChain === "true" || sendCertificateChain === "1";
  return logger17.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${result}`), result;
}
