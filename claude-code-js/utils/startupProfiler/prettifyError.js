// function: prettifyError
function prettifyError(error2) {
  let lines = [], issues = [...error2.issues].sort((a, b) => a.path.length - b.path.length);
  for (let issue2 of issues)
    if (lines.push(`\u2716 ${issue2.message}`), issue2.path?.length)
      lines.push(`  \u2192 at ${toDotPath(issue2.path)}`);
  return lines.join(`
`);
}
