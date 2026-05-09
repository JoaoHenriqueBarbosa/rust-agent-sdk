// function: extractDirectories
function extractDirectories(updates) {
  if (!updates)
    return [];
  return updates.flatMap((update2) => {
    switch (update2.type) {
      case "addDirectories":
        return update2.directories;
      default:
        return [];
    }
  });
}
