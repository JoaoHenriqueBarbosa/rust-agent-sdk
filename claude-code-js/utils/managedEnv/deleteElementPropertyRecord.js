// function: deleteElementPropertyRecord
function deleteElementPropertyRecord(el, attr) {
  var element = elements.get(el);
  if (!element)
    return;
  if (attr === "html") {
    var _element$html, _element$html$observe;
    (_element$html = element.html) == null || (_element$html$observe = _element$html.observer) == null || _element$html$observe.disconnect(), delete element.html;
  } else if (attr === "class") {
    var _element$classes, _element$classes$obse;
    (_element$classes = element.classes) == null || (_element$classes$obse = _element$classes.observer) == null || _element$classes$obse.disconnect(), delete element.classes;
  } else if (attr === "position") {
    var _element$position, _element$position$obs;
    (_element$position = element.position) == null || (_element$position$obs = _element$position.observer) == null || _element$position$obs.disconnect(), delete element.position;
  } else {
    var _element$attributes, _element$attributes$a, _element$attributes$a2;
    (_element$attributes = element.attributes) == null || (_element$attributes$a = _element$attributes[attr]) == null || (_element$attributes$a2 = _element$attributes$a.observer) == null || _element$attributes$a2.disconnect(), delete element.attributes[attr];
  }
}
