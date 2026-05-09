// function: rotate
function rotate(count3, items) {
  let max = items.length, offset = (count3 % max + max) % max;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
