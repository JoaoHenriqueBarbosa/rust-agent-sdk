// function: hasAttrib
function hasAttrib(elem, name3) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name3) && elem.attribs[name3] != null;
}
