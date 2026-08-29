// function: formatFileSize2
function formatFileSize2(bytes) {
  if (bytes < 1024)
    return `${bytes}B`;
  else if (bytes < 1048576)
    return `${(bytes / 1024).toFixed(1)}kB`;
  else
    return `${(bytes / 1048576).toFixed(1)}MB`;
}
