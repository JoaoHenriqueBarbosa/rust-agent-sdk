// function: fromHex
function fromHex(encoded) {
  if (encoded.length % 2 !== 0)
    throw Error("Hex encoded strings must have an even number length");
  let out = new Uint8Array(encoded.length / 2);
  for (let i3 = 0;i3 < encoded.length; i3 += 2) {
    let encodedByte = encoded.slice(i3, i3 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT)
      out[i3 / 2] = HEX_TO_SHORT[encodedByte];
    else
      throw Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
  }
  return out;
}
