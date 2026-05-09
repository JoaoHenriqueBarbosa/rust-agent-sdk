// function: postProcess2
function postProcess2(output) {
  var self2 = this;
  return this.rules.forEach(function(rule) {
    if (typeof rule.append === "function")
      output = join85(output, rule.append(self2.options));
  }), output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
}
