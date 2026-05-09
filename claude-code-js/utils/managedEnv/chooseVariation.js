// function: chooseVariation
function chooseVariation(n6, ranges) {
  for (let i5 = 0;i5 < ranges.length; i5++)
    if (inRange(n6, ranges[i5]))
      return i5;
  return -1;
}
