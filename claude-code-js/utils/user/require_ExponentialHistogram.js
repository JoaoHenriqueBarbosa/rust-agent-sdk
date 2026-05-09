// var: require_ExponentialHistogram
var require_ExponentialHistogram = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ExponentialHistogramAggregator = exports.ExponentialHistogramAccumulation = void 0;
  var types_1 = require_types3(), MetricData_1 = require_MetricData(), api_1 = require_src7(), Buckets_1 = require_Buckets(), getMapping_1 = require_getMapping(), util_1 = require_util7();

  class HighLow {
    static combine(h1, h22) {
      return new HighLow(Math.min(h1.low, h22.low), Math.max(h1.high, h22.high));
    }
    low;
    high;
    constructor(low, high) {
      this.low = low, this.high = high;
    }
  }
  var MAX_SCALE = 20, DEFAULT_MAX_SIZE = 160, MIN_MAX_SIZE = 2;

  class ExponentialHistogramAccumulation {
    startTime;
    _maxSize;
    _recordMinMax;
    _sum;
    _count;
    _zeroCount;
    _min;
    _max;
    _positive;
    _negative;
    _mapping;
    constructor(startTime, maxSize = DEFAULT_MAX_SIZE, recordMinMax = !0, sum = 0, count3 = 0, zeroCount = 0, min = Number.POSITIVE_INFINITY, max2 = Number.NEGATIVE_INFINITY, positive = new Buckets_1.Buckets, negative = new Buckets_1.Buckets, mapping = (0, getMapping_1.getMapping)(MAX_SCALE)) {
      if (this.startTime = startTime, this._maxSize = maxSize, this._recordMinMax = recordMinMax, this._sum = sum, this._count = count3, this._zeroCount = zeroCount, this._min = min, this._max = max2, this._positive = positive, this._negative = negative, this._mapping = mapping, this._maxSize < MIN_MAX_SIZE)
        api_1.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${MIN_MAX_SIZE}`), this._maxSize = MIN_MAX_SIZE;
    }
    record(value) {
      this.updateByIncrement(value, 1);
    }
    setStartTime(startTime) {
      this.startTime = startTime;
    }
    toPointValue() {
      return {
        hasMinMax: this._recordMinMax,
        min: this.min,
        max: this.max,
        sum: this.sum,
        positive: {
          offset: this.positive.offset,
          bucketCounts: this.positive.counts()
        },
        negative: {
          offset: this.negative.offset,
          bucketCounts: this.negative.counts()
        },
        count: this.count,
        scale: this.scale,
        zeroCount: this.zeroCount
      };
    }
    get sum() {
      return this._sum;
    }
    get min() {
      return this._min;
    }
    get max() {
      return this._max;
    }
    get count() {
      return this._count;
    }
    get zeroCount() {
      return this._zeroCount;
    }
    get scale() {
      if (this._count === this._zeroCount)
        return 0;
      return this._mapping.scale;
    }
    get positive() {
      return this._positive;
    }
    get negative() {
      return this._negative;
    }
    updateByIncrement(value, increment3) {
      if (Number.isNaN(value))
        return;
      if (value > this._max)
        this._max = value;
      if (value < this._min)
        this._min = value;
      if (this._count += increment3, value === 0) {
        this._zeroCount += increment3;
        return;
      }
      if (this._sum += value * increment3, value > 0)
        this._updateBuckets(this._positive, value, increment3);
      else
        this._updateBuckets(this._negative, -value, increment3);
    }
    merge(previous) {
      if (this._count === 0)
        this._min = previous.min, this._max = previous.max;
      else if (previous.count !== 0) {
        if (previous.min < this.min)
          this._min = previous.min;
        if (previous.max > this.max)
          this._max = previous.max;
      }
      this.startTime = previous.startTime, this._sum += previous.sum, this._count += previous.count, this._zeroCount += previous.zeroCount;
      let minScale = this._minScale(previous);
      this._downscale(this.scale - minScale), this._mergeBuckets(this.positive, previous, previous.positive, minScale), this._mergeBuckets(this.negative, previous, previous.negative, minScale);
    }
    diff(other2) {
      this._min = 1 / 0, this._max = -1 / 0, this._sum -= other2.sum, this._count -= other2.count, this._zeroCount -= other2.zeroCount;
      let minScale = this._minScale(other2);
      this._downscale(this.scale - minScale), this._diffBuckets(this.positive, other2, other2.positive, minScale), this._diffBuckets(this.negative, other2, other2.negative, minScale);
    }
    clone() {
      return new ExponentialHistogramAccumulation(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
    }
    _updateBuckets(buckets, value, increment3) {
      let index = this._mapping.mapToIndex(value), rescalingNeeded = !1, high = 0, low = 0;
      if (buckets.length === 0)
        buckets.indexStart = index, buckets.indexEnd = buckets.indexStart, buckets.indexBase = buckets.indexStart;
      else if (index < buckets.indexStart && buckets.indexEnd - index >= this._maxSize)
        rescalingNeeded = !0, low = index, high = buckets.indexEnd;
      else if (index > buckets.indexEnd && index - buckets.indexStart >= this._maxSize)
        rescalingNeeded = !0, low = buckets.indexStart, high = index;
      if (rescalingNeeded) {
        let change = this._changeScale(high, low);
        this._downscale(change), index = this._mapping.mapToIndex(value);
      }
      this._incrementIndexBy(buckets, index, increment3);
    }
    _incrementIndexBy(buckets, index, increment3) {
      if (increment3 === 0)
        return;
      if (buckets.length === 0)
        buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
      if (index < buckets.indexStart) {
        let span = buckets.indexEnd - index;
        if (span >= buckets.backing.length)
          this._grow(buckets, span + 1);
        buckets.indexStart = index;
      } else if (index > buckets.indexEnd) {
        let span = index - buckets.indexStart;
        if (span >= buckets.backing.length)
          this._grow(buckets, span + 1);
        buckets.indexEnd = index;
      }
      let bucketIndex = index - buckets.indexBase;
      if (bucketIndex < 0)
        bucketIndex += buckets.backing.length;
      buckets.incrementBucket(bucketIndex, increment3);
    }
    _grow(buckets, needed) {
      let size = buckets.backing.length, bias = buckets.indexBase - buckets.indexStart, oldPositiveLimit = size - bias, newSize = (0, util_1.nextGreaterSquare)(needed);
      if (newSize > this._maxSize)
        newSize = this._maxSize;
      let newPositiveLimit = newSize - bias;
      buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
    }
    _changeScale(high, low) {
      let change = 0;
      while (high - low >= this._maxSize)
        high >>= 1, low >>= 1, change++;
      return change;
    }
    _downscale(change) {
      if (change === 0)
        return;
      if (change < 0)
        throw Error(`impossible change of scale: ${this.scale}`);
      let newScale = this._mapping.scale - change;
      this._positive.downscale(change), this._negative.downscale(change), this._mapping = (0, getMapping_1.getMapping)(newScale);
    }
    _minScale(other2) {
      let minScale = Math.min(this.scale, other2.scale), highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other2.positive, other2.scale, minScale)), highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other2.negative, other2.scale, minScale));
      return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
    }
    _highLowAtScale(buckets, currentScale, newScale) {
      if (buckets.length === 0)
        return new HighLow(0, -1);
      let shift = currentScale - newScale;
      return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
    }
    _mergeBuckets(ours, other2, theirs, scale) {
      let theirOffset = theirs.offset, theirChange = other2.scale - scale;
      for (let i5 = 0;i5 < theirs.length; i5++)
        this._incrementIndexBy(ours, theirOffset + i5 >> theirChange, theirs.at(i5));
    }
    _diffBuckets(ours, other2, theirs, scale) {
      let theirOffset = theirs.offset, theirChange = other2.scale - scale;
      for (let i5 = 0;i5 < theirs.length; i5++) {
        let bucketIndex = (theirOffset + i5 >> theirChange) - ours.indexBase;
        if (bucketIndex < 0)
          bucketIndex += ours.backing.length;
        ours.decrementBucket(bucketIndex, theirs.at(i5));
      }
      ours.trim();
    }
  }
  exports.ExponentialHistogramAccumulation = ExponentialHistogramAccumulation;

  class ExponentialHistogramAggregator {
    kind = types_1.AggregatorKind.EXPONENTIAL_HISTOGRAM;
    _maxSize;
    _recordMinMax;
    constructor(maxSize, recordMinMax) {
      this._maxSize = maxSize, this._recordMinMax = recordMinMax;
    }
    createAccumulation(startTime) {
      return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
    }
    merge(previous, delta) {
      let result = delta.clone();
      return result.merge(previous), result;
    }
    diff(previous, current) {
      let result = current.clone();
      return result.diff(previous), result;
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
      return {
        descriptor,
        aggregationTemporality,
        dataPointType: MetricData_1.DataPointType.EXPONENTIAL_HISTOGRAM,
        dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
          let pointValue2 = accumulation.toPointValue(), allowsNegativeValues = descriptor.type === MetricData_1.InstrumentType.GAUGE || descriptor.type === MetricData_1.InstrumentType.UP_DOWN_COUNTER || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_GAUGE || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes,
            startTime: accumulation.startTime,
            endTime,
            value: {
              min: pointValue2.hasMinMax ? pointValue2.min : void 0,
              max: pointValue2.hasMinMax ? pointValue2.max : void 0,
              sum: !allowsNegativeValues ? pointValue2.sum : void 0,
              positive: {
                offset: pointValue2.positive.offset,
                bucketCounts: pointValue2.positive.bucketCounts
              },
              negative: {
                offset: pointValue2.negative.offset,
                bucketCounts: pointValue2.negative.bucketCounts
              },
              count: pointValue2.count,
              scale: pointValue2.scale,
              zeroCount: pointValue2.zeroCount
            }
          };
        })
      };
    }
  }
  exports.ExponentialHistogramAggregator = ExponentialHistogramAggregator;
});
