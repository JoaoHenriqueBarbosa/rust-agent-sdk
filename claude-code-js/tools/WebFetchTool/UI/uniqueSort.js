// function: uniqueSort
function uniqueSort(nodes) {
  return nodes = nodes.filter((node2, i5, arr) => !arr.includes(node2, i5 + 1)), nodes.sort((a2, b) => {
    let relative18 = compareDocumentPosition(a2, b);
    if (relative18 & DocumentPosition.PRECEDING)
      return -1;
    else if (relative18 & DocumentPosition.FOLLOWING)
      return 1;
    return 0;
  }), nodes;
}
