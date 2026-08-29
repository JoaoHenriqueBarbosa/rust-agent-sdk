// var: require_crc
var require_crc = __commonJS((exports, module) => {
  var crcTable = [];
  (function() {
    for (let i5 = 0;i5 < 256; i5++) {
      let currentCrc = i5;
      for (let j4 = 0;j4 < 8; j4++)
        if (currentCrc & 1)
          currentCrc = 3988292384 ^ currentCrc >>> 1;
        else
          currentCrc = currentCrc >>> 1;
      crcTable[i5] = currentCrc;
    }
  })();
  var CrcCalculator = module.exports = function() {
    this._crc = -1;
  };
  CrcCalculator.prototype.write = function(data) {
    for (let i5 = 0;i5 < data.length; i5++)
      this._crc = crcTable[(this._crc ^ data[i5]) & 255] ^ this._crc >>> 8;
    return !0;
  };
  CrcCalculator.prototype.crc32 = function() {
    return this._crc ^ -1;
  };
  CrcCalculator.crc32 = function(buf) {
    let crc2 = -1;
    for (let i5 = 0;i5 < buf.length; i5++)
      crc2 = crcTable[(crc2 ^ buf[i5]) & 255] ^ crc2 >>> 8;
    return crc2 ^ -1;
  };
});
