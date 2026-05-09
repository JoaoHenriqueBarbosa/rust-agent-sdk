// var: init_ZlibHeaderTransformStream
var init_ZlibHeaderTransformStream = __esm(() => {
  ZlibHeaderTransformStream = class ZlibHeaderTransformStream extends stream2.Transform {
    __transform(chunk, encoding, callback) {
      this.push(chunk), callback();
    }
    _transform(chunk, encoding, callback) {
      if (chunk.length !== 0) {
        if (this._transform = this.__transform, chunk[0] !== 120) {
          let header = Buffer.alloc(2);
          header[0] = 120, header[1] = 156, this.push(header, encoding);
        }
      }
      this.__transform(chunk, encoding, callback);
    }
  };
  ZlibHeaderTransformStream_default = ZlibHeaderTransformStream;
});
