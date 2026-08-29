// function: optimize
function optimize(diff2) {
  if (diff2.length <= 1)
    return diff2;
  let result = [], len = 0;
  for (let patch of diff2) {
    let type = patch.type;
    if (type === "stdout") {
      if (patch.content === "")
        continue;
    } else if (type === "cursorMove") {
      if (patch.x === 0 && patch.y === 0)
        continue;
    } else if (type === "clear") {
      if (patch.count === 0)
        continue;
    }
    if (len > 0) {
      let lastIdx = len - 1, last = result[lastIdx], lastType = last.type;
      if (type === "cursorMove" && lastType === "cursorMove") {
        result[lastIdx] = {
          type: "cursorMove",
          x: last.x + patch.x,
          y: last.y + patch.y
        };
        continue;
      }
      if (type === "cursorTo" && lastType === "cursorTo") {
        result[lastIdx] = patch;
        continue;
      }
      if (type === "styleStr" && lastType === "styleStr") {
        result[lastIdx] = { type: "styleStr", str: last.str + patch.str };
        continue;
      }
      if (type === "hyperlink" && lastType === "hyperlink" && patch.uri === last.uri)
        continue;
      if (type === "cursorShow" && lastType === "cursorHide" || type === "cursorHide" && lastType === "cursorShow") {
        result.pop(), len--;
        continue;
      }
    }
    result.push(patch), len++;
  }
  return result;
}
