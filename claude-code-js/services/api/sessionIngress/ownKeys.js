// function: ownKeys
function ownKeys(e, r4) {
  var t2 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o5 = Object.getOwnPropertySymbols(e);
    r4 && (o5 = o5.filter(function(r5) {
      return Object.getOwnPropertyDescriptor(e, r5).enumerable;
    })), t2.push.apply(t2, o5);
  }
  return t2;
}
