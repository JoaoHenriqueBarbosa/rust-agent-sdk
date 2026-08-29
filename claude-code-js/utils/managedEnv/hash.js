// function: hash
function hash(seed, value, version6) {
  if (version6 === 2)
    return hashFnv32a(hashFnv32a(seed + value) + "") % 1e4 / 1e4;
  if (version6 === 1)
    return hashFnv32a(value + seed) % 1000 / 1000;
  return null;
}
