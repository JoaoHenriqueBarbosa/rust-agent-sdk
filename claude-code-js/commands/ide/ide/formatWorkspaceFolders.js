// function: formatWorkspaceFolders
function formatWorkspaceFolders(folders, maxLength = 100) {
  if (folders.length === 0)
    return "";
  let cwd2 = getCwd(), foldersToShow = folders.slice(0, 2), hasMore = folders.length > 2, ellipsisOverhead = hasMore ? 3 : 0, separatorOverhead = (foldersToShow.length - 1) * 2, availableLength = maxLength - separatorOverhead - ellipsisOverhead, maxLengthPerPath = Math.floor(availableLength / foldersToShow.length), cwdNFC = cwd2.normalize("NFC"), result = foldersToShow.map((folder) => {
    let folderNFC = folder.normalize("NFC");
    if (folderNFC.startsWith(cwdNFC + path22.sep))
      folder = folderNFC.slice(cwdNFC.length + 1);
    if (folder.length <= maxLengthPerPath)
      return folder;
    return "\u2026" + folder.slice(-(maxLengthPerPath - 1));
  }).join(", ");
  if (hasMore)
    result += ", \u2026";
  return result;
}
