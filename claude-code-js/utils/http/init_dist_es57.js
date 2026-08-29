// var: init_dist_es57
var init_dist_es57 = __esm(() => {
  SHORT_TO_HEX3 = {}, HEX_TO_SHORT3 = {};
  for (let i4 = 0;i4 < 256; i4++) {
    let encodedByte = i4.toString(16).toLowerCase();
    if (encodedByte.length === 1)
      encodedByte = `0${encodedByte}`;
    SHORT_TO_HEX3[i4] = encodedByte, HEX_TO_SHORT3[encodedByte] = i4;
  }
});
