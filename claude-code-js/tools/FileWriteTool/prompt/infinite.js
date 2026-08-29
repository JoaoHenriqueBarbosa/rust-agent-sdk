// function: infinite
function infinite({ active, lastActive, total, pageSize, pointer }) {
  if (total <= pageSize)
    return active;
  if (lastActive < active && active - lastActive < pageSize)
    return Math.min(Math.floor(pageSize / 2), pointer + active - lastActive);
  return pointer;
}
