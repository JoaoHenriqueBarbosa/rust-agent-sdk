// function: renderCdata
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
