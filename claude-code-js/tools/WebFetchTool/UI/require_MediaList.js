// var: require_MediaList
var require_MediaList = __commonJS((exports) => {
  var CSSOM = {};
  CSSOM.MediaList = function() {
    this.length = 0;
  };
  CSSOM.MediaList.prototype = {
    constructor: CSSOM.MediaList,
    get mediaText() {
      return Array.prototype.join.call(this, ", ");
    },
    set mediaText(value) {
      var values3 = value.split(","), length = this.length = values3.length;
      for (var i5 = 0;i5 < length; i5++)
        this[i5] = values3[i5].trim();
    },
    appendMedium: function(medium) {
      if (Array.prototype.indexOf.call(this, medium) === -1)
        this[this.length] = medium, this.length++;
    },
    deleteMedium: function(medium) {
      var index = Array.prototype.indexOf.call(this, medium);
      if (index !== -1)
        Array.prototype.splice.call(this, index, 1);
    }
  };
  exports.MediaList = CSSOM.MediaList;
});
