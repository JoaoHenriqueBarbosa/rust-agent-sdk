// var: require_kanji_data
var require_kanji_data = __commonJS((exports, module) => {
  var Mode = require_mode2(), Utils = require_utils13();
  function KanjiData(data) {
    this.mode = Mode.KANJI, this.data = data;
  }
  KanjiData.getBitsLength = function(length) {
    return length * 13;
  };
  KanjiData.prototype.getLength = function() {
    return this.data.length;
  };
  KanjiData.prototype.getBitsLength = function() {
    return KanjiData.getBitsLength(this.data.length);
  };
  KanjiData.prototype.write = function(bitBuffer) {
    let i5;
    for (i5 = 0;i5 < this.data.length; i5++) {
      let value = Utils.toSJIS(this.data[i5]);
      if (value >= 33088 && value <= 40956)
        value -= 33088;
      else if (value >= 57408 && value <= 60351)
        value -= 49472;
      else
        throw Error("Invalid SJIS character: " + this.data[i5] + `
Make sure your charset is UTF-8`);
      value = (value >>> 8 & 255) * 192 + (value & 255), bitBuffer.put(value, 13);
    }
  };
  module.exports = KanjiData;
});
