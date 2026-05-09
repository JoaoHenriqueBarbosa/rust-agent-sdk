// Original: src/keybindings/match.ts
function getKeyName(input, key2) {
  if (key2.escape)
    return "escape";
  if (key2.return)
    return "enter";
  if (key2.tab)
    return "tab";
  if (key2.backspace)
    return "backspace";
  if (key2.delete)
    return "delete";
  if (key2.upArrow)
    return "up";
  if (key2.downArrow)
    return "down";
  if (key2.leftArrow)
    return "left";
  if (key2.rightArrow)
    return "right";
  if (key2.pageUp)
    return "pageup";
  if (key2.pageDown)
    return "pagedown";
  if (key2.wheelUp)
    return "wheelup";
  if (key2.wheelDown)
    return "wheeldown";
  if (key2.home)
    return "home";
  if (key2.end)
    return "end";
  if (input.length === 1)
    return input.toLowerCase();
  return null;
}
