// var: require_mask_pattern
var require_mask_pattern = __commonJS((exports) => {
  exports.Patterns = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var PenaltyScores = {
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10
  };
  exports.isValid = function(mask) {
    return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
  };
  exports.from = function(value) {
    return exports.isValid(value) ? parseInt(value, 10) : void 0;
  };
  exports.getPenaltyN1 = function(data) {
    let size = data.size, points = 0, sameCountCol = 0, sameCountRow = 0, lastCol = null, lastRow = null;
    for (let row = 0;row < size; row++) {
      sameCountCol = sameCountRow = 0, lastCol = lastRow = null;
      for (let col = 0;col < size; col++) {
        let module2 = data.get(row, col);
        if (module2 === lastCol)
          sameCountCol++;
        else {
          if (sameCountCol >= 5)
            points += PenaltyScores.N1 + (sameCountCol - 5);
          lastCol = module2, sameCountCol = 1;
        }
        if (module2 = data.get(col, row), module2 === lastRow)
          sameCountRow++;
        else {
          if (sameCountRow >= 5)
            points += PenaltyScores.N1 + (sameCountRow - 5);
          lastRow = module2, sameCountRow = 1;
        }
      }
      if (sameCountCol >= 5)
        points += PenaltyScores.N1 + (sameCountCol - 5);
      if (sameCountRow >= 5)
        points += PenaltyScores.N1 + (sameCountRow - 5);
    }
    return points;
  };
  exports.getPenaltyN2 = function(data) {
    let size = data.size, points = 0;
    for (let row = 0;row < size - 1; row++)
      for (let col = 0;col < size - 1; col++) {
        let last2 = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
        if (last2 === 4 || last2 === 0)
          points++;
      }
    return points * PenaltyScores.N2;
  };
  exports.getPenaltyN3 = function(data) {
    let size = data.size, points = 0, bitsCol = 0, bitsRow = 0;
    for (let row = 0;row < size; row++) {
      bitsCol = bitsRow = 0;
      for (let col = 0;col < size; col++) {
        if (bitsCol = bitsCol << 1 & 2047 | data.get(row, col), col >= 10 && (bitsCol === 1488 || bitsCol === 93))
          points++;
        if (bitsRow = bitsRow << 1 & 2047 | data.get(col, row), col >= 10 && (bitsRow === 1488 || bitsRow === 93))
          points++;
      }
    }
    return points * PenaltyScores.N3;
  };
  exports.getPenaltyN4 = function(data) {
    let darkCount = 0, modulesCount = data.data.length;
    for (let i5 = 0;i5 < modulesCount; i5++)
      darkCount += data.data[i5];
    return Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10) * PenaltyScores.N4;
  };
  function getMaskAt(maskPattern, i5, j4) {
    switch (maskPattern) {
      case exports.Patterns.PATTERN000:
        return (i5 + j4) % 2 === 0;
      case exports.Patterns.PATTERN001:
        return i5 % 2 === 0;
      case exports.Patterns.PATTERN010:
        return j4 % 3 === 0;
      case exports.Patterns.PATTERN011:
        return (i5 + j4) % 3 === 0;
      case exports.Patterns.PATTERN100:
        return (Math.floor(i5 / 2) + Math.floor(j4 / 3)) % 2 === 0;
      case exports.Patterns.PATTERN101:
        return i5 * j4 % 2 + i5 * j4 % 3 === 0;
      case exports.Patterns.PATTERN110:
        return (i5 * j4 % 2 + i5 * j4 % 3) % 2 === 0;
      case exports.Patterns.PATTERN111:
        return (i5 * j4 % 3 + (i5 + j4) % 2) % 2 === 0;
      default:
        throw Error("bad maskPattern:" + maskPattern);
    }
  }
  exports.applyMask = function(pattern, data) {
    let size = data.size;
    for (let col = 0;col < size; col++)
      for (let row = 0;row < size; row++) {
        if (data.isReserved(row, col))
          continue;
        data.xor(row, col, getMaskAt(pattern, row, col));
      }
  };
  exports.getBestMask = function(data, setupFormatFunc) {
    let numPatterns = Object.keys(exports.Patterns).length, bestPattern = 0, lowerPenalty = 1 / 0;
    for (let p4 = 0;p4 < numPatterns; p4++) {
      setupFormatFunc(p4), exports.applyMask(p4, data);
      let penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
      if (exports.applyMask(p4, data), penalty < lowerPenalty)
        lowerPenalty = penalty, bestPattern = p4;
    }
    return bestPattern;
  };
});
