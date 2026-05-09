// var: require_LogarithmMapping
var require_LogarithmMapping = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.LogarithmMapping = void 0;
  var ieee754 = require_ieee754(), util12 = require_util7(), types_1 = require_types4();

  class LogarithmMapping {
    _scale;
    _scaleFactor;
    _inverseFactor;
    constructor(scale) {
      this._scale = scale, this._scaleFactor = util12.ldexp(Math.LOG2E, scale), this._inverseFactor = util12.ldexp(Math.LN2, -scale);
    }
    mapToIndex(value) {
      if (value <= ieee754.MIN_VALUE)
        return this._minNormalLowerBoundaryIndex() - 1;
      if (ieee754.getSignificand(value) === 0)
        return (ieee754.getNormalBase2(value) << this._scale) - 1;
      let index = Math.floor(Math.log(value) * this._scaleFactor), maxIndex = this._maxNormalLowerBoundaryIndex();
      if (index >= maxIndex)
        return maxIndex;
      return index;
    }
    lowerBoundary(index) {
      let maxIndex = this._maxNormalLowerBoundaryIndex();
      if (index >= maxIndex) {
        if (index === maxIndex)
          return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
        throw new types_1.MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
      }
      let minIndex = this._minNormalLowerBoundaryIndex();
      if (index <= minIndex) {
        if (index === minIndex)
          return ieee754.MIN_VALUE;
        else if (index === minIndex - 1)
          return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
        throw new types_1.MappingError(`overflow: ${index} is < minimum lower boundary: ${minIndex}`);
      }
      return Math.exp(index * this._inverseFactor);
    }
    get scale() {
      return this._scale;
    }
    _minNormalLowerBoundaryIndex() {
      return ieee754.MIN_NORMAL_EXPONENT << this._scale;
    }
    _maxNormalLowerBoundaryIndex() {
      return (ieee754.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1;
    }
  }
  exports.LogarithmMapping = LogarithmMapping;
});
