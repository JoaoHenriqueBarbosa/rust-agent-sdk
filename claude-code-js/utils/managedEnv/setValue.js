// function: setValue
function setValue(m4, el) {
  m4.html && setPropertyValue(el, "html", m4.html), m4.classes && setPropertyValue(el, "class", m4.classes), m4.position && setPropertyValue(el, "position", m4.position), Object.keys(m4.attributes).forEach(function(attr) {
    setPropertyValue(el, attr, m4.attributes[attr]);
  });
}
