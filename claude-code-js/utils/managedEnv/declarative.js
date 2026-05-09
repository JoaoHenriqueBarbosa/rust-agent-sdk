// function: declarative
function declarative(_ref2) {
  var { selector, action: action2, value, attribute: attr, parentSelector, insertBeforeSelector } = _ref2;
  if (attr === "html") {
    if (action2 === "append")
      return html2(selector, function(val) {
        return val + (value != null ? value : "");
      });
    else if (action2 === "set")
      return html2(selector, function() {
        return value != null ? value : "";
      });
  } else if (attr === "class") {
    if (action2 === "append")
      return classes(selector, function(val) {
        if (value)
          val.add(value);
      });
    else if (action2 === "remove")
      return classes(selector, function(val) {
        if (value)
          val.delete(value);
      });
    else if (action2 === "set")
      return classes(selector, function(val) {
        if (val.clear(), value)
          val.add(value);
      });
  } else if (attr === "position") {
    if (action2 === "set" && parentSelector)
      return position(selector, function() {
        return {
          insertBeforeSelector,
          parentSelector
        };
      });
  } else if (action2 === "append")
    return attribute2(selector, attr, function(val) {
      return val !== null ? val + (value != null ? value : "") : value != null ? value : "";
    });
  else if (action2 === "set")
    return attribute2(selector, attr, function() {
      return value != null ? value : "";
    });
  else if (action2 === "remove")
    return attribute2(selector, attr, function() {
      return null;
    });
  return nullController;
}
