// function: isSelectable
function isSelectable(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}
