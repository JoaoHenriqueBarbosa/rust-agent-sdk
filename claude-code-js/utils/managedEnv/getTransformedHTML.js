// function: getTransformedHTML
function getTransformedHTML(html2) {
  if (!transformContainer)
    transformContainer = document.createElement("div");
  return transformContainer.innerHTML = html2, transformContainer.innerHTML;
}
