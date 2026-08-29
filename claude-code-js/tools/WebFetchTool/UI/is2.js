// function: is2
function is2(elem, query2, options2) {
  let opts = convertOptionFormats(options2);
  return (typeof query2 === "function" ? query2 : compile2(query2, opts))(elem);
}
