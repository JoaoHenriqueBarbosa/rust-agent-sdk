// function: getRussianPlural
function getRussianPlural(count, one, few, many) {
  let absCount = Math.abs(count), lastDigit = absCount % 10, lastTwoDigits = absCount % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19)
    return many;
  if (lastDigit === 1)
    return one;
  if (lastDigit >= 2 && lastDigit <= 4)
    return few;
  return many;
}
