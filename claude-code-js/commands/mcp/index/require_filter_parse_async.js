// var: require_filter_parse_async
var require_filter_parse_async = __commonJS((exports, module) => {
  var util12 = __require("util"), ChunkStream = require_chunkstream(), Filter = require_filter_parse(), FilterAsync = module.exports = function(bitmapInfo) {
    ChunkStream.call(this);
    let buffers = [], that = this;
    this._filter = new Filter(bitmapInfo, {
      read: this.read.bind(this),
      write: function(buffer) {
        buffers.push(buffer);
      },
      complete: function() {
        that.emit("complete", Buffer.concat(buffers));
      }
    }), this._filter.start();
  };
  util12.inherits(FilterAsync, ChunkStream);
});
