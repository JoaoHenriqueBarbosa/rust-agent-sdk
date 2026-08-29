// function: appendPath
function appendPath(url3, pathToAppend) {
  if (!pathToAppend)
    return url3;
  let parsedUrl = new URL(url3), newPath = parsedUrl.pathname;
  if (!newPath.endsWith("/"))
    newPath = `${newPath}/`;
  if (pathToAppend.startsWith("/"))
    pathToAppend = pathToAppend.substring(1);
  let searchStart = pathToAppend.indexOf("?");
  if (searchStart !== -1) {
    let path11 = pathToAppend.substring(0, searchStart), search = pathToAppend.substring(searchStart + 1);
    if (newPath = newPath + path11, search)
      parsedUrl.search = parsedUrl.search ? `${parsedUrl.search}&${search}` : search;
  } else
    newPath = newPath + pathToAppend;
  return parsedUrl.pathname = newPath, parsedUrl.toString();
}
