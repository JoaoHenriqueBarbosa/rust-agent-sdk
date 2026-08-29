// var: require_ByteArrayCollector
var require_ByteArrayCollector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ByteArrayCollector = void 0;

  class ByteArrayCollector {
    allocByteArray;
    byteLength = 0;
    byteArrays = [];
    constructor(allocByteArray) {
      this.allocByteArray = allocByteArray;
    }
    push(byteArray) {
      this.byteArrays.push(byteArray), this.byteLength += byteArray.byteLength;
    }
    flush() {
      if (this.byteArrays.length === 1) {
        let bytes = this.byteArrays[0];
        return this.reset(), bytes;
      }
      let aggregation = this.allocByteArray(this.byteLength), cursor = 0;
      for (let i2 = 0;i2 < this.byteArrays.length; ++i2) {
        let bytes = this.byteArrays[i2];
        aggregation.set(bytes, cursor), cursor += bytes.byteLength;
      }
      return this.reset(), aggregation;
    }
    reset() {
      this.byteArrays = [], this.byteLength = 0;
    }
  }
  exports.ByteArrayCollector = ByteArrayCollector;
});
