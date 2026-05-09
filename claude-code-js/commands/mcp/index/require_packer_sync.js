// var: require_packer_sync
var require_packer_sync = __commonJS((exports, module) => {
  var hasSyncZlib = !0, zlib4 = __require("zlib");
  if (!zlib4.deflateSync)
    hasSyncZlib = !1;
  var constants12 = require_constants5(), Packer = require_packer();
  module.exports = function(metaData, opt) {
    if (!hasSyncZlib)
      throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    let packer = new Packer(opt || {}), chunks = [];
    if (chunks.push(Buffer.from(constants12.PNG_SIGNATURE)), chunks.push(packer.packIHDR(metaData.width, metaData.height)), metaData.gamma)
      chunks.push(packer.packGAMA(metaData.gamma));
    let filteredData = packer.filterData(metaData.data, metaData.width, metaData.height), compressedData = zlib4.deflateSync(filteredData, packer.getDeflateOptions());
    if (filteredData = null, !compressedData || !compressedData.length)
      throw Error("bad png - invalid compressed data response");
    return chunks.push(packer.packIDAT(compressedData)), chunks.push(packer.packIEND()), Buffer.concat(chunks);
  };
});
