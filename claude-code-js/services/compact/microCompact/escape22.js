// function: escape22
function escape22(html2, encode9) {
  if (encode9) {
    if (other.escapeTest.test(html2))
      return html2.replace(other.escapeReplace, getEscapeReplacement);
  } else if (other.escapeTestNoEncode.test(html2))
    return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
  return html2;
}
