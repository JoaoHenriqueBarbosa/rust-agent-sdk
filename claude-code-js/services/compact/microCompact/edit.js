// function: edit
function edit(regex2, opt = "") {
  let source = typeof regex2 === "string" ? regex2 : regex2.source, obj = {
    replace: (name3, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      return valSource = valSource.replace(other.caret, "$1"), source = source.replace(name3, valSource), obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    }
  };
  return obj;
}
