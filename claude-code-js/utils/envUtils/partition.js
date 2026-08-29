// function: partition
function partition(str, delimiter) {
  let index = str.indexOf(delimiter);
  if (index !== -1)
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  return [str, "", ""];
}
