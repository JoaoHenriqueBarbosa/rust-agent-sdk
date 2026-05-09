// function: parseCertificate
async function parseCertificate(certificateConfiguration, sendCertificateChain) {
  let { certificate, certificatePath } = certificateConfiguration, certificateContents = certificate || await readFile7(certificatePath, "utf8"), x5c = sendCertificateChain ? certificateContents : void 0, certificatePattern = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, publicKeys = [], match;
  do
    if (match = certificatePattern.exec(certificateContents), match)
      publicKeys.push(match[3]);
  while (match);
  if (publicKeys.length === 0)
    throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
  let thumbprint = createHash3("sha1").update(Buffer.from(publicKeys[0], "base64")).digest("hex").toUpperCase(), thumbprintSha256 = createHash3("sha256").update(Buffer.from(publicKeys[0], "base64")).digest("hex").toUpperCase();
  return {
    certificateContents,
    thumbprintSha256,
    thumbprint,
    x5c
  };
}
