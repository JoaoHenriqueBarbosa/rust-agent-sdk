// var: require_Location
var require_Location = __commonJS((exports, module) => {
  var URL4 = require_URL(), URLUtils = require_URLUtils();
  module.exports = Location;
  function Location(window3, href) {
    this._window = window3, this._href = href;
  }
  Location.prototype = Object.create(URLUtils.prototype, {
    constructor: { value: Location },
    href: {
      get: function() {
        return this._href;
      },
      set: function(v2) {
        this.assign(v2);
      }
    },
    assign: { value: function(url3) {
      var current = new URL4(this._href), newurl = current.resolve(url3);
      this._href = newurl;
    } },
    replace: { value: function(url3) {
      this.assign(url3);
    } },
    reload: { value: function() {
      this.assign(this.href);
    } },
    toString: { value: function() {
      return this.href;
    } }
  });
});
