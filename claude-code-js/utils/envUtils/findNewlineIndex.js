// function: findNewlineIndex
function findNewlineIndex(buffer, startIndex) {
  for (let i = startIndex ?? 0;i < buffer.length; i++) {
    if (buffer[i] === 10)
      return { preceding: i, index: i + 1, carriage: !1 };
    if (buffer[i] === 13)
      return { preceding: i, index: i + 1, carriage: !0 };
  }
  return null;
}
