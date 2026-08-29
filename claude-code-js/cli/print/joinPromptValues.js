// function: joinPromptValues
function joinPromptValues(values3) {
  if (values3.length === 1)
    return values3[0];
  if (values3.every((v2) => typeof v2 === "string"))
    return values3.join(`
`);
  return values3.flatMap(toBlocks);
}
