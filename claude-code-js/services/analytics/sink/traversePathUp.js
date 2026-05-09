// function: traversePathUp
function traversePathUp(startPath) {
  return {
    *[Symbol.iterator]() {
      let currentPath = path2.resolve(toPath(startPath)), previousPath;
      while (previousPath !== currentPath)
        yield currentPath, previousPath = currentPath, currentPath = path2.resolve(currentPath, "..");
    }
  };
}
