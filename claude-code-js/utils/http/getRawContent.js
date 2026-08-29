// function: getRawContent
function getRawContent(blob) {
  if (hasRawContent(blob))
    return blob[rawContent]();
  else
    return blob;
}
