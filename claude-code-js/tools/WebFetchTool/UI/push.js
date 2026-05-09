// function: push
function push(value, key3) {
  if (key3 !== PRIVATE)
    this.push(`${key3}:${value}`);
}
