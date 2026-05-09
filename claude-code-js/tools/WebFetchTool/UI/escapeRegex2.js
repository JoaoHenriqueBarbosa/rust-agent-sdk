// function: escapeRegex2
function escapeRegex2(value) {
  return value.replace(reChars, "\\$&");
}
