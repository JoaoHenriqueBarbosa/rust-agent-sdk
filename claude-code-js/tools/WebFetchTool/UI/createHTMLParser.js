// function: createHTMLParser
function createHTMLParser() {
  var Parser4 = function() {};
  {
    var domino = require_lib9();
    Parser4.prototype.parseFromString = function(string5) {
      return domino.createDocument(string5);
    };
  }
  return Parser4;
}
