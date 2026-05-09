// var: require_parser_sync
var require_parser_sync = __commonJS((exports, module) => {
  var hasSyncZlib = !0, zlib4 = __require("zlib"), inflateSync2 = require_sync_inflate();
  if (!zlib4.deflateSync)
    hasSyncZlib = !1;
  var SyncReader = require_sync_reader(), FilterSync = require_filter_parse_sync(), Parser4 = require_parser6(), bitmapper = require_bitmapper(), formatNormaliser = require_format_normaliser();
  module.exports = function(buffer, options2) {
    if (!hasSyncZlib)
      throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
    let err2;
    function handleError(_err_) {
      err2 = _err_;
    }
    let metaData;
    function handleMetaData(_metaData_) {
      metaData = _metaData_;
    }
    function handleTransColor(transColor) {
      metaData.transColor = transColor;
    }
    function handlePalette(palette) {
      metaData.palette = palette;
    }
    function handleSimpleTransparency() {
      metaData.alpha = !0;
    }
    let gamma;
    function handleGamma(_gamma_) {
      gamma = _gamma_;
    }
    let inflateDataList = [];
    function handleInflateData(inflatedData2) {
      inflateDataList.push(inflatedData2);
    }
    let reader = new SyncReader(buffer);
    if (new Parser4(options2, {
      read: reader.read.bind(reader),
      error: handleError,
      metadata: handleMetaData,
      gamma: handleGamma,
      palette: handlePalette,
      transColor: handleTransColor,
      inflateData: handleInflateData,
      simpleTransparency: handleSimpleTransparency
    }).start(), reader.process(), err2)
      throw err2;
    let inflateData = Buffer.concat(inflateDataList);
    inflateDataList.length = 0;
    let inflatedData;
    if (metaData.interlace)
      inflatedData = zlib4.inflateSync(inflateData);
    else {
      let imageSize = ((metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1) * metaData.height;
      inflatedData = inflateSync2(inflateData, {
        chunkSize: imageSize,
        maxLength: imageSize
      });
    }
    if (inflateData = null, !inflatedData || !inflatedData.length)
      throw Error("bad png - invalid inflate data response");
    let unfilteredData = FilterSync.process(inflatedData, metaData);
    inflateData = null;
    let bitmapData = bitmapper.dataToBitMap(unfilteredData, metaData);
    unfilteredData = null;
    let normalisedBitmapData = formatNormaliser(bitmapData, metaData);
    return metaData.data = normalisedBitmapData, metaData.gamma = gamma || 0, metaData;
  };
});
