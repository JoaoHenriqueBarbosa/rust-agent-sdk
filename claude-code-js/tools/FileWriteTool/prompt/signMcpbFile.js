// function: signMcpbFile
function signMcpbFile(mcpbPath, certPath, keyPath, intermediates) {
  let mcpbContent = readFileSync14(mcpbPath), certificatePem = readFileSync14(certPath, "utf-8"), privateKeyPem = readFileSync14(keyPath, "utf-8"), intermediatePems = intermediates?.map((path16) => readFileSync14(path16, "utf-8")), p7 = import_node_forge.default.pkcs7.createSignedData();
  p7.content = import_node_forge.default.util.createBuffer(mcpbContent);
  let signingCert = import_node_forge.default.pki.certificateFromPem(certificatePem), privateKey = import_node_forge.default.pki.privateKeyFromPem(privateKeyPem);
  if (p7.addCertificate(signingCert), intermediatePems)
    for (let pem of intermediatePems)
      p7.addCertificate(import_node_forge.default.pki.certificateFromPem(pem));
  p7.addSigner({
    key: privateKey,
    certificate: signingCert,
    digestAlgorithm: import_node_forge.default.pki.oids.sha256,
    authenticatedAttributes: [
      {
        type: import_node_forge.default.pki.oids.contentType,
        value: import_node_forge.default.pki.oids.data
      },
      {
        type: import_node_forge.default.pki.oids.messageDigest
      },
      {
        type: import_node_forge.default.pki.oids.signingTime
      }
    ]
  }), p7.sign({ detached: !0 });
  let asn1 = import_node_forge.default.asn1.toDer(p7.toAsn1()), pkcs7Signature = Buffer.from(asn1.getBytes(), "binary"), signatureBlock = createSignatureBlock(pkcs7Signature), signedContent = Buffer.concat([mcpbContent, signatureBlock]);
  writeFileSync4(mcpbPath, signedContent);
}
