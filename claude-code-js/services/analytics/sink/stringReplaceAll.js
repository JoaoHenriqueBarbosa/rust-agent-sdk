// function: stringReplaceAll
function stringReplaceAll(string4, substring, replacer) {
  let index = string4.indexOf(substring);
  if (index === -1)
    return string4;
  let substringLength = substring.length, endIndex = 0, returnValue = "";
  do
    returnValue += string4.slice(endIndex, index) + substring + replacer, endIndex = index + substringLength, index = string4.indexOf(substring, endIndex);
  while (index !== -1);
  return returnValue += string4.slice(endIndex), returnValue;
}
