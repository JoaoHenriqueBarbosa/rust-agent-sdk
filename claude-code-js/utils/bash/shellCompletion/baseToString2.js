// function: baseToString2
function baseToString2(value) {
  if (typeof value == "string")
    return value;
  if (typeof value === "bigint")
    return value.toString();
  let result = value + "";
  return result == "0" && 1 / value == -1 / 0 ? "-0" : result;
}
