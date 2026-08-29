// var: require_numeric_data
var require_numeric_data = __commonJS((exports, module) => {
  var Mode = require_mode2();
  function NumericData(data) {
    this.mode = Mode.NUMERIC, this.data = data.toString();
  }
  NumericData.getBitsLength = function(length) {
    return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
  };
  NumericData.prototype.getLength = function() {
    return this.data.length;
  };
  NumericData.prototype.getBitsLength = function() {
    return NumericData.getBitsLength(this.data.length);
  };
  NumericData.prototype.write = function(bitBuffer) {
    let i5, group, value;
    for (i5 = 0;i5 + 3 <= this.data.length; i5 += 3)
      group = this.data.substr(i5, 3), value = parseInt(group, 10), bitBuffer.put(value, 10);
    let remainingNum = this.data.length - i5;
    if (remainingNum > 0)
      group = this.data.substr(i5), value = parseInt(group, 10), bitBuffer.put(value, remainingNum * 3 + 1);
  };
  module.exports = NumericData;
});
