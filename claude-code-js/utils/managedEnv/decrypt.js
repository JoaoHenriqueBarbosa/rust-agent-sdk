// function: decrypt
async function decrypt(encryptedString, decryptionKey, subtle) {
  if (decryptionKey = decryptionKey || "", subtle = subtle || globalThis.crypto && globalThis.crypto.subtle || polyfills.SubtleCrypto, !subtle)
    throw Error("No SubtleCrypto implementation found");
  try {
    let key3 = await subtle.importKey("raw", base64ToBuf(decryptionKey), {
      name: "AES-CBC",
      length: 128
    }, !0, ["encrypt", "decrypt"]), [iv, cipherText] = encryptedString.split("."), plainTextBuffer = await subtle.decrypt({
      name: "AES-CBC",
      iv: base64ToBuf(iv)
    }, key3, base64ToBuf(cipherText));
    return (/* @__PURE__ */ new TextDecoder()).decode(plainTextBuffer);
  } catch (e) {
    throw Error("Failed to decrypt");
  }
}
