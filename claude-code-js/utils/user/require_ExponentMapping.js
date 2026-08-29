// var: require_ExponentMapping
var require_ExponentMapping = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ExponentMapping = void 0;
  var ieee754 = require_ieee754(), util12 = require_util7(), types_1 = require_types4();

  class ExponentMapping {
    _shift;
    constructor(scale) {
      this._shift = -scale;
    }
    mapToIndex(value) {
      if (value < ieee754.MIN_VALUE)
        return this._minNormalLowerBoundaryIndex();
      let exp = ieee754.getNormalBase2(value), correction = this._rightShift(ieee754.getSignificand(value) - 1, ieee754.SIGNIFICAND_WIDTH);
      return exp + correction >> this._shift;
    }
    lowerBoundary(index) {
      let minIndex = this._minNormalLowerBoundaryIndex();
      if (index < minIndex)
        throw new types_1.MappingError(`underflow: ${index} is < minimum lower boundary: ${minIndex}`);
      let maxIndex = this._maxNormalLowerBoundaryIndex();
      if (index > maxIndex)
        throw new types_1.MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
      return util12.ldexp(1, index << this._shift);
    }
    get scale() {
      if (this._shift === 0)
        return 0;
      return -this._shift;
    }
    _minNormalLowerBoundaryIndex() {
      let index = ieee754.MIN_NORMAL_EXPONENT >> this._shift;
      if (this._shift < 2)
        index--;
      return index;
    }
    _maxNormalLowerBoundaryIndex() {
      return ieee754.MAX_NORMAL_EXPONENT >> this._shift;
    }
    _rightShift(value, shift) {
      return Math.floor(value * Math.pow(2, -shift));
    }
  }
  exports.ExponentMapping = ExponentMapping;
});
