// function: getAttribCheck
function getAttribCheck(attrib, value) {
  if (typeof value === "function")
    return (elem) => isTag2(elem) && value(elem.attribs[attrib]);
  return (elem) => isTag2(elem) && elem.attribs[attrib] === value;
}
