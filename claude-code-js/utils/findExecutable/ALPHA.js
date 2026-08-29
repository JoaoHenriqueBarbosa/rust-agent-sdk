// var: ALPHA
var ALPHA = "abcdefghijklmnopqrstuvwxyz", DIGIT = "0123456789", ALPHABET, generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "", { length } = alphabet, randomValues = new Uint32Array(size);
  crypto2.randomFillSync(randomValues);
  for (let i2 = 0;i2 < size; i2++)
    str += alphabet[randomValues[i2] % length];
  return str;
}, node_default;
