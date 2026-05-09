// var: require_Buckets
var require_Buckets = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Buckets = void 0;

  class Buckets {
    backing;
    indexBase;
    indexStart;
    indexEnd;
    constructor(backing = new BucketsBacking, indexBase = 0, indexStart = 0, indexEnd = 0) {
      this.backing = backing, this.indexBase = indexBase, this.indexStart = indexStart, this.indexEnd = indexEnd;
    }
    get offset() {
      return this.indexStart;
    }
    get length() {
      if (this.backing.length === 0)
        return 0;
      if (this.indexEnd === this.indexStart && this.at(0) === 0)
        return 0;
      return this.indexEnd - this.indexStart + 1;
    }
    counts() {
      return Array.from({ length: this.length }, (_, i5) => this.at(i5));
    }
    at(position) {
      let bias = this.indexBase - this.indexStart;
      if (position < bias)
        position += this.backing.length;
      return position -= bias, this.backing.countAt(position);
    }
    incrementBucket(bucketIndex, increment3) {
      this.backing.increment(bucketIndex, increment3);
    }
    decrementBucket(bucketIndex, decrement) {
      this.backing.decrement(bucketIndex, decrement);
    }
    trim() {
      for (let i5 = 0;i5 < this.length; i5++)
        if (this.at(i5) !== 0) {
          this.indexStart += i5;
          break;
        } else if (i5 === this.length - 1) {
          this.indexStart = this.indexEnd = this.indexBase = 0;
          return;
        }
      for (let i5 = this.length - 1;i5 >= 0; i5--)
        if (this.at(i5) !== 0) {
          this.indexEnd -= this.length - i5 - 1;
          break;
        }
      this._rotate();
    }
    downscale(by) {
      this._rotate();
      let size = 1 + this.indexEnd - this.indexStart, each = 1 << by, inpos = 0, outpos = 0;
      for (let pos = this.indexStart;pos <= this.indexEnd; ) {
        let mod = pos % each;
        if (mod < 0)
          mod += each;
        for (let i5 = mod;i5 < each && inpos < size; i5++)
          this._relocateBucket(outpos, inpos), inpos++, pos++;
        outpos++;
      }
      this.indexStart >>= by, this.indexEnd >>= by, this.indexBase = this.indexStart;
    }
    clone() {
      return new Buckets(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
    }
    _rotate() {
      let bias = this.indexBase - this.indexStart;
      if (bias === 0)
        return;
      else if (bias > 0)
        this.backing.reverse(0, this.backing.length), this.backing.reverse(0, bias), this.backing.reverse(bias, this.backing.length);
      else
        this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + bias);
      this.indexBase = this.indexStart;
    }
    _relocateBucket(dest, src) {
      if (dest === src)
        return;
      this.incrementBucket(dest, this.backing.emptyBucket(src));
    }
  }
  exports.Buckets = Buckets;

  class BucketsBacking {
    _counts;
    constructor(counts = [0]) {
      this._counts = counts;
    }
    get length() {
      return this._counts.length;
    }
    countAt(pos) {
      return this._counts[pos];
    }
    growTo(newSize, oldPositiveLimit, newPositiveLimit) {
      let tmp = Array(newSize).fill(0);
      tmp.splice(newPositiveLimit, this._counts.length - oldPositiveLimit, ...this._counts.slice(oldPositiveLimit)), tmp.splice(0, oldPositiveLimit, ...this._counts.slice(0, oldPositiveLimit)), this._counts = tmp;
    }
    reverse(from, limit) {
      let num = Math.floor((from + limit) / 2) - from;
      for (let i5 = 0;i5 < num; i5++) {
        let tmp = this._counts[from + i5];
        this._counts[from + i5] = this._counts[limit - i5 - 1], this._counts[limit - i5 - 1] = tmp;
      }
    }
    emptyBucket(src) {
      let tmp = this._counts[src];
      return this._counts[src] = 0, tmp;
    }
    increment(bucketIndex, increment3) {
      this._counts[bucketIndex] += increment3;
    }
    decrement(bucketIndex, decrement) {
      if (this._counts[bucketIndex] >= decrement)
        this._counts[bucketIndex] -= decrement;
      else
        this._counts[bucketIndex] = 0;
    }
    clone() {
      return new BucketsBacking([...this._counts]);
    }
  }
});
