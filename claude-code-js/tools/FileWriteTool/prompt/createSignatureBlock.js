// function: createSignatureBlock
function createSignatureBlock(pkcs7Signature) {
  let parts = [];
  parts.push(Buffer.from(SIGNATURE_HEADER2, "utf-8"));
  let sigLengthBuffer = Buffer.alloc(4);
  return sigLengthBuffer.writeUInt32LE(pkcs7Signature.length, 0), parts.push(sigLengthBuffer), parts.push(pkcs7Signature), parts.push(Buffer.from(SIGNATURE_FOOTER, "utf-8")), Buffer.concat(parts);
}
