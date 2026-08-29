// var: require_filter_parse_sync
var require_filter_parse_sync = __commonJS((exports) => {
  var SyncReader = require_sync_reader(), Filter = require_filter_parse();
  exports.process = function(inBuffer, bitmapInfo) {
    let outBuffers = [], reader = new SyncReader(inBuffer);
    return new Filter(bitmapInfo, {
      read: reader.read.bind(reader),
      write: function(bufferPart) {
        outBuffers.push(bufferPart);
      },
      complete: function() {}
    }).start(), reader.process(), Buffer.concat(outBuffers);
  };
});
