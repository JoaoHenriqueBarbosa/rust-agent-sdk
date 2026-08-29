// function: findDoubleNewlineIndex
function findDoubleNewlineIndex(buffer) {
  for (let i = 0;i < buffer.length - 1; i++) {
    if (buffer[i] === 10 && buffer[i + 1] === 10)
      return i + 2;
    if (buffer[i] === 13 && buffer[i + 1] === 13)
      return i + 2;
    if (buffer[i] === 13 && buffer[i + 1] === 10 && i + 3 < buffer.length && buffer[i + 2] === 13 && buffer[i + 3] === 10)
      return i + 4;
  }
  return -1;
}
