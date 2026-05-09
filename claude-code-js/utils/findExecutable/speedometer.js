// function: speedometer
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  let bytes = Array(samplesCount), timestamps2 = Array(samplesCount), head = 0, tail = 0, firstSampleTS;
  return min = min !== void 0 ? min : 1000, function(chunkLength) {
    let now = Date.now(), startedAt = timestamps2[tail];
    if (!firstSampleTS)
      firstSampleTS = now;
    bytes[head] = chunkLength, timestamps2[head] = now;
    let i2 = tail, bytesCount = 0;
    while (i2 !== head)
      bytesCount += bytes[i2++], i2 = i2 % samplesCount;
    if (head = (head + 1) % samplesCount, head === tail)
      tail = (tail + 1) % samplesCount;
    if (now - firstSampleTS < min)
      return;
    let passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1000 / passed) : void 0;
  };
}
