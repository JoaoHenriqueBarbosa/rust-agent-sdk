// var: require_alphanumeric_data
var require_alphanumeric_data = __commonJS((exports, module) => {
  var Mode = require_mode2(), ALPHA_NUM_CHARS = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
    "$",
    "%",
    "*",
    "+",
    "-",
    ".",
    "/",
    ":"
  ];
  function AlphanumericData(data) {
    this.mode = Mode.ALPHANUMERIC, this.data = data;
  }
  AlphanumericData.getBitsLength = function(length) {
    return 11 * Math.floor(length / 2) + 6 * (length % 2);
  };
  AlphanumericData.prototype.getLength = function() {
    return this.data.length;
  };
  AlphanumericData.prototype.getBitsLength = function() {
    return AlphanumericData.getBitsLength(this.data.length);
  };
  AlphanumericData.prototype.write = function(bitBuffer) {
    let i5;
    for (i5 = 0;i5 + 2 <= this.data.length; i5 += 2) {
      let value = ALPHA_NUM_CHARS.indexOf(this.data[i5]) * 45;
      value += ALPHA_NUM_CHARS.indexOf(this.data[i5 + 1]), bitBuffer.put(value, 11);
    }
    if (this.data.length % 2)
      bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i5]), 6);
  };
  module.exports = AlphanumericData;
});
