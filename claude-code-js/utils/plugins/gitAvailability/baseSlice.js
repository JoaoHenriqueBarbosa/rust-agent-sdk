// function: baseSlice
function baseSlice(array2, start, end) {
  var index = -1, length = array2.length;
  if (start < 0)
    start = -start > length ? 0 : length + start;
  if (end = end > length ? length : end, end < 0)
    end += length;
  length = start > end ? 0 : end - start >>> 0, start >>>= 0;
  var result = Array(length);
  while (++index < length)
    result[index] = array2[index + start];
  return result;
}
