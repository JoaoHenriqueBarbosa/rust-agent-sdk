// var: init_dist_es26
var init_dist_es26 = __esm(() => {
  SHORT_TO_HEX = {}, HEX_TO_SHORT = {};
  for (let i3 = 0;i3 < 256; i3++) {
    let encodedByte = i3.toString(16).toLowerCase();
    if (encodedByte.length === 1)
      encodedByte = `0${encodedByte}`;
    SHORT_TO_HEX[i3] = encodedByte, HEX_TO_SHORT[encodedByte] = i3;
  }
});
