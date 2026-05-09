// function: getRandomIntegerInclusive
function getRandomIntegerInclusive(min, max) {
  return min = Math.ceil(min), max = Math.floor(max), Math.floor(Math.random() * (max - min + 1)) + min;
}
