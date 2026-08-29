// function: applyStylesToWrappedText
function applyStylesToWrappedText(wrappedPlain, segments, charToSegment, originalPlain, trimEnabled = !1) {
  let lines = wrappedPlain.split(`
`), resultLines = [], charIndex = 0;
  for (let lineIdx = 0;lineIdx < lines.length; lineIdx++) {
    let line = lines[lineIdx];
    if (trimEnabled && line.length > 0) {
      let lineStartsWithWhitespace = /\s/.test(line[0]);
      if (charIndex < originalPlain.length && /\s/.test(originalPlain[charIndex]) && !lineStartsWithWhitespace)
        while (charIndex < originalPlain.length && /\s/.test(originalPlain[charIndex]))
          charIndex++;
    }
    let styledLine = "", runStart = 0, runSegmentIndex = charToSegment[charIndex] ?? 0;
    for (let i4 = 0;i4 < line.length; i4++) {
      let currentSegmentIndex = charToSegment[charIndex] ?? runSegmentIndex;
      if (currentSegmentIndex !== runSegmentIndex) {
        let runText2 = line.slice(runStart, i4), segment2 = segments[runSegmentIndex];
        if (segment2) {
          let styled = applyTextStyles(runText2, segment2.styles);
          if (segment2.hyperlink)
            styled = wrapWithOsc8Link(styled, segment2.hyperlink);
          styledLine += styled;
        } else
          styledLine += runText2;
        runStart = i4, runSegmentIndex = currentSegmentIndex;
      }
      charIndex++;
    }
    let runText = line.slice(runStart), segment = segments[runSegmentIndex];
    if (segment) {
      let styled = applyTextStyles(runText, segment.styles);
      if (segment.hyperlink)
        styled = wrapWithOsc8Link(styled, segment.hyperlink);
      styledLine += styled;
    } else
      styledLine += runText;
    if (resultLines.push(styledLine), charIndex < originalPlain.length && originalPlain[charIndex] === `
`)
      charIndex++;
    if (trimEnabled && lineIdx < lines.length - 1) {
      let nextLine = lines[lineIdx + 1], nextLineFirstChar = nextLine.length > 0 ? nextLine[0] : null;
      while (charIndex < originalPlain.length && /\s/.test(originalPlain[charIndex])) {
        if (nextLineFirstChar !== null && originalPlain[charIndex] === nextLineFirstChar)
          break;
        charIndex++;
      }
    }
  }
  return resultLines.join(`
`);
}
