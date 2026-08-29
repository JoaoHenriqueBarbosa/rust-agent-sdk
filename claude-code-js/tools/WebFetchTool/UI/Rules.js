// function: Rules
function Rules(options2) {
  this.options = options2, this._keep = [], this._remove = [], this.blankRule = {
    replacement: options2.blankReplacement
  }, this.keepReplacement = options2.keepReplacement, this.defaultRule = {
    replacement: options2.defaultReplacement
  }, this.array = [];
  for (var key3 in options2.rules)
    this.array.push(options2.rules[key3]);
}
