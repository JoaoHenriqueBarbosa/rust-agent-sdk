// function: extractSignatureBlock
function extractSignatureBlock(fileContent) {
  let footerBytes = Buffer.from(SIGNATURE_FOOTER, "utf-8"), footerIndex = fileContent.lastIndexOf(footerBytes);
  if (footerIndex === -1)
    return { originalContent: fileContent };
  let headerBytes = Buffer.from(SIGNATURE_HEADER2, "utf-8"), headerIndex = -1;
  for (let i5 = footerIndex - 1;i5 >= 0; i5--)
    if (fileContent.slice(i5, i5 + headerBytes.length).equals(headerBytes)) {
      headerIndex = i5;
      break;
    }
  if (headerIndex === -1)
    return { originalContent: fileContent };
  let originalContent = fileContent.slice(0, headerIndex), offset = headerIndex + headerBytes.length;
  try {
    let sigLength = fileContent.readUInt32LE(offset);
    offset += 4;
    let pkcs7Signature = fileContent.slice(offset, offset + sigLength);
    return {
      originalContent,
      pkcs7Signature
    };
  } catch {
    return { originalContent: fileContent };
  }
}
