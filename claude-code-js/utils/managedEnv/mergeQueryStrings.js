// function: mergeQueryStrings
function mergeQueryStrings(oldUrl, newUrl) {
  let currUrl, redirectUrl;
  try {
    currUrl = new URL(oldUrl), redirectUrl = new URL(newUrl);
  } catch (e) {
    return console.error(`Unable to merge query strings: ${e}`), newUrl;
  }
  return currUrl.searchParams.forEach((value, key3) => {
    if (redirectUrl.searchParams.has(key3))
      return;
    redirectUrl.searchParams.set(key3, value);
  }), redirectUrl.toString();
}
