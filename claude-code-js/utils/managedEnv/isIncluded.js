// function: isIncluded
function isIncluded(include) {
  try {
    return include();
  } catch (e) {
    return console.error(e), !1;
  }
}
