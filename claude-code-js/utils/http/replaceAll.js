// function: replaceAll
function replaceAll(input, replacements2) {
  let result = input;
  for (let [searchValue, replaceValue] of replacements2)
    result = result.split(searchValue).join(replaceValue);
  return result;
}
