// function: findLastCompactBoundaryIndex
function findLastCompactBoundaryIndex(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let message = messages[i5];
    if (message && isCompactBoundaryMessage(message))
      return i5;
  }
  return -1;
}
