// function: _loadDOMNodes
function _loadDOMNodes(_ref) {
  var { parentSelector, insertBeforeSelector } = _ref, parentNode = document.querySelector(parentSelector);
  if (!parentNode)
    return null;
  var insertBeforeNode2 = insertBeforeSelector ? document.querySelector(insertBeforeSelector) : null;
  if (insertBeforeSelector && !insertBeforeNode2)
    return null;
  return {
    parentNode,
    insertBeforeNode: insertBeforeNode2
  };
}
