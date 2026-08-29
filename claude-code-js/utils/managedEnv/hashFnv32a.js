// function: hashFnv32a
function hashFnv32a(str2) {
  let hval = 2166136261, l3 = str2.length;
  for (let i5 = 0;i5 < l3; i5++)
    hval ^= str2.charCodeAt(i5), hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  return hval >>> 0;
}
