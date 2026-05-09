// function: stripCommentLines
function stripCommentLines(command12) {
  let nonCommentLines = command12.split(`
`).filter((line) => {
    let trimmed = line.trim();
    return trimmed !== "" && !trimmed.startsWith("#");
  });
  if (nonCommentLines.length === 0)
    return command12;
  return nonCommentLines.join(`
`);
}
