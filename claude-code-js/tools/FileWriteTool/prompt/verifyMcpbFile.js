// function: verifyMcpbFile
async function verifyMcpbFile(mcpbPath) {
  try {
    let fileContent = readFileSync14(mcpbPath), { originalContent, pkcs7Signature } = extractSignatureBlock(fileContent);
    if (!pkcs7Signature)
      return { status: "unsigned" };
    let asn1 = import_node_forge.default.asn1.fromDer(pkcs7Signature.toString("binary")), p7Message = import_node_forge.default.pkcs7.messageFromAsn1(asn1);
    if (!("type" in p7Message) || p7Message.type !== import_node_forge.default.pki.oids.signedData)
      return { status: "unsigned" };
    let p7 = p7Message, certificates = p7.certificates || [];
    if (certificates.length === 0)
      return { status: "unsigned" };
    let signingCert = certificates[0], contentBuf = import_node_forge.default.util.createBuffer(originalContent);
    try {
      p7.verify({ authenticatedAttributes: !0 });
      let signerInfo = p7.signerInfos?.[0];
      if (signerInfo) {
        let md = import_node_forge.default.md.sha256.create();
        md.update(contentBuf.getBytes());
        let digest = md.digest().getBytes(), messageDigest = null;
        for (let attr of signerInfo.authenticatedAttributes)
          if (attr.type === import_node_forge.default.pki.oids.messageDigest) {
            messageDigest = attr.value;
            break;
          }
        if (!messageDigest || messageDigest !== digest)
          return { status: "unsigned" };
      }
    } catch (error44) {
      return { status: "unsigned" };
    }
    let certPem = import_node_forge.default.pki.certificateToPem(signingCert), intermediatePems = certificates.slice(1).map((cert) => Buffer.from(import_node_forge.default.pki.certificateToPem(cert)));
    if (!await verifyCertificateChain(Buffer.from(certPem), intermediatePems))
      return { status: "unsigned" };
    return {
      status: signingCert.issuer.getField("CN")?.value === signingCert.subject.getField("CN")?.value ? "self-signed" : "signed",
      publisher: signingCert.subject.getField("CN")?.value || "Unknown",
      issuer: signingCert.issuer.getField("CN")?.value || "Unknown",
      valid_from: signingCert.validity.notBefore.toISOString(),
      valid_to: signingCert.validity.notAfter.toISOString(),
      fingerprint: import_node_forge.default.md.sha256.create().update(import_node_forge.default.asn1.toDer(import_node_forge.default.pki.certificateToAsn1(signingCert)).getBytes()).digest().toHex()
    };
  } catch (error44) {
    throw Error(`Failed to verify MCPB file: ${error44}`);
  }
}
