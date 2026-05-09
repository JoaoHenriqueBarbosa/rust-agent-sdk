// var: init_convertToBuffer
var init_convertToBuffer = __esm(() => {
  init_dist_es25();
  fromUtf85 = typeof Buffer < "u" && Buffer.from ? function(input) {
    return Buffer.from(input, "utf8");
  } : fromUtf83;
});
