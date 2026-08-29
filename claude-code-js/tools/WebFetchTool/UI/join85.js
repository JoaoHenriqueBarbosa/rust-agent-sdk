// function: join85
function join85(output, replacement) {
  var s1 = trimTrailingNewlines(output), s2 = trimLeadingNewlines(replacement), nls = Math.max(output.length - s1.length, replacement.length - s2.length), separator = `

`.substring(0, nls);
  return s1 + separator + s2;
}
