// function: getPath2
function getPath2(obj, path25) {
  let parts = path25.split("."), current = obj;
  for (let i5 = 0;i5 < parts.length; i5++)
    if (current && typeof current === "object" && parts[i5] in current)
      current = current[parts[i5]];
    else
      return null;
  return current;
}
