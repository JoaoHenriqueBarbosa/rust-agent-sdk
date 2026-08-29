// function: prepareUserContent
function prepareUserContent({
  inputString,
  precedingInputBlocks
}) {
  if (precedingInputBlocks.length === 0)
    return inputString;
  return [
    ...precedingInputBlocks,
    {
      text: inputString,
      type: "text"
    }
  ];
}
