// function: randomInt
function randomInt(max) {
  return randomBytes2(4).readUInt32BE(0) % max;
}
