// function: negate
function negate(bytes) {
  for (let i3 = 0;i3 < 8; i3++)
    bytes[i3] ^= 255;
  for (let i3 = 7;i3 > -1; i3--)
    if (bytes[i3]++, bytes[i3] !== 0)
      break;
}
