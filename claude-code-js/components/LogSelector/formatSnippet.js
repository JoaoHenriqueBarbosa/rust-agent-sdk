// function: formatSnippet
function formatSnippet({
  before: before2,
  match,
  after: after2
}, highlightColor) {
  return source_default.dim(before2) + highlightColor(match) + source_default.dim(after2);
}
