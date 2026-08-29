// function: escapeMarkdown
function escapeMarkdown(string5) {
  return markdownEscapes.reduce(function(accumulator, escape5) {
    return accumulator.replace(escape5[0], escape5[1]);
  }, string5);
}
