// function: stringEncaseCRLFWithFirstIndex
function stringEncaseCRLFWithFirstIndex(string4, prefix, postfix, index) {
  let endIndex = 0, returnValue = "";
  do {
    let gotCR = string4[index - 1] === "\r";
    returnValue += string4.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? `\r
` : `
`) + postfix, endIndex = index + 1, index = string4.indexOf(`
`, endIndex);
  } while (index !== -1);
  return returnValue += string4.slice(endIndex), returnValue;
}
