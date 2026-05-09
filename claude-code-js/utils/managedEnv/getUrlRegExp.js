// function: getUrlRegExp
function getUrlRegExp(regexString) {
  try {
    let escaped = regexString.replace(/([^\\])\//g, "$1\\/");
    return new RegExp(escaped);
  } catch (e) {
    console.error(e);
    return;
  }
}
