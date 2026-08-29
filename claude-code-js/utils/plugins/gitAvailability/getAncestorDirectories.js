// function: getAncestorDirectories
function getAncestorDirectories(pathStr) {
  let ancestors = [], currentPath = path15.dirname(pathStr);
  while (currentPath !== "/" && currentPath !== ".") {
    ancestors.push(currentPath);
    let parentPath = path15.dirname(currentPath);
    if (parentPath === currentPath)
      break;
    currentPath = parentPath;
  }
  return ancestors;
}
