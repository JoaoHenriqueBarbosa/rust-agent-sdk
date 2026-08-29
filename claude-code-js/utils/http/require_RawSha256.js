// var: require_RawSha256
var require_RawSha256 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.RawSha256 = void 0;
  var constants_1 = require_constants(), RawSha256 = function() {
    function RawSha2562() {
      this.state = Int32Array.from(constants_1.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1;
    }
    return RawSha2562.prototype.update = function(data) {
      if (this.finished)
        throw Error("Attempted to update an already finished hash.");
      var position = 0, byteLength = data.byteLength;
      if (this.bytesHashed += byteLength, this.bytesHashed * 8 > constants_1.MAX_HASHABLE_LENGTH)
        throw Error("Cannot hash more than 2^53 - 1 bits");
      while (byteLength > 0)
        if (this.buffer[this.bufferLength++] = data[position++], byteLength--, this.bufferLength === constants_1.BLOCK_SIZE)
          this.hashBuffer(), this.bufferLength = 0;
    }, RawSha2562.prototype.digest = function() {
      if (!this.finished) {
        var bitsHashed = this.bytesHashed * 8, bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength), undecoratedLength = this.bufferLength;
        if (bufferView.setUint8(this.bufferLength++, 128), undecoratedLength % constants_1.BLOCK_SIZE >= constants_1.BLOCK_SIZE - 8) {
          for (var i4 = this.bufferLength;i4 < constants_1.BLOCK_SIZE; i4++)
            bufferView.setUint8(i4, 0);
          this.hashBuffer(), this.bufferLength = 0;
        }
        for (var i4 = this.bufferLength;i4 < constants_1.BLOCK_SIZE - 8; i4++)
          bufferView.setUint8(i4, 0);
        bufferView.setUint32(constants_1.BLOCK_SIZE - 8, Math.floor(bitsHashed / 4294967296), !0), bufferView.setUint32(constants_1.BLOCK_SIZE - 4, bitsHashed), this.hashBuffer(), this.finished = !0;
      }
      var out = new Uint8Array(constants_1.DIGEST_LENGTH);
      for (var i4 = 0;i4 < 8; i4++)
        out[i4 * 4] = this.state[i4] >>> 24 & 255, out[i4 * 4 + 1] = this.state[i4] >>> 16 & 255, out[i4 * 4 + 2] = this.state[i4] >>> 8 & 255, out[i4 * 4 + 3] = this.state[i4] >>> 0 & 255;
      return out;
    }, RawSha2562.prototype.hashBuffer = function() {
      var _a2 = this, buffer = _a2.buffer, state = _a2.state, state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
      for (var i4 = 0;i4 < constants_1.BLOCK_SIZE; i4++) {
        if (i4 < 16)
          this.temp[i4] = (buffer[i4 * 4] & 255) << 24 | (buffer[i4 * 4 + 1] & 255) << 16 | (buffer[i4 * 4 + 2] & 255) << 8 | buffer[i4 * 4 + 3] & 255;
        else {
          var u5 = this.temp[i4 - 2], t1_1 = (u5 >>> 17 | u5 << 15) ^ (u5 >>> 19 | u5 << 13) ^ u5 >>> 10;
          u5 = this.temp[i4 - 15];
          var t2_1 = (u5 >>> 7 | u5 << 25) ^ (u5 >>> 18 | u5 << 14) ^ u5 >>> 3;
          this.temp[i4] = (t1_1 + this.temp[i4 - 7] | 0) + (t2_1 + this.temp[i4 - 16] | 0);
        }
        var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (constants_1.KEY[i4] + this.temp[i4] | 0) | 0) | 0, t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
        state7 = state6, state6 = state5, state5 = state4, state4 = state3 + t1 | 0, state3 = state2, state2 = state1, state1 = state0, state0 = t1 + t2 | 0;
      }
      state[0] += state0, state[1] += state1, state[2] += state2, state[3] += state3, state[4] += state4, state[5] += state5, state[6] += state6, state[7] += state7;
    }, RawSha2562;
  }();
  exports.RawSha256 = RawSha256;
});
