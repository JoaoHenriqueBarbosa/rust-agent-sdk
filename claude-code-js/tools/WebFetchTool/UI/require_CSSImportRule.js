// var: require_CSSImportRule
var require_CSSImportRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
    MediaList: require_MediaList().MediaList
  };
  CSSOM.CSSImportRule = function() {
    CSSOM.CSSRule.call(this), this.href = "", this.media = new CSSOM.MediaList, this.styleSheet = new CSSOM.CSSStyleSheet;
  };
  CSSOM.CSSImportRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSImportRule.prototype.constructor = CSSOM.CSSImportRule;
  CSSOM.CSSImportRule.prototype.type = 3;
  Object.defineProperty(CSSOM.CSSImportRule.prototype, "cssText", {
    get: function() {
      var mediaText = this.media.mediaText;
      return "@import url(" + this.href + ")" + (mediaText ? " " + mediaText : "") + ";";
    },
    set: function(cssText) {
      var i5 = 0, state3 = "", buffer = "", index;
      for (var character;character = cssText.charAt(i5); i5++)
        switch (character) {
          case " ":
          case "\t":
          case "\r":
          case `
`:
          case "\f":
            if (state3 === "after-import")
              state3 = "url";
            else
              buffer += character;
            break;
          case "@":
            if (!state3 && cssText.indexOf("@import", i5) === i5)
              state3 = "after-import", i5 += 6, buffer = "";
            break;
          case "u":
            if (state3 === "url" && cssText.indexOf("url(", i5) === i5) {
              if (index = cssText.indexOf(")", i5 + 1), index === -1)
                throw i5 + ': ")" not found';
              i5 += 4;
              var url3 = cssText.slice(i5, index);
              if (url3[0] === url3[url3.length - 1]) {
                if (url3[0] === '"' || url3[0] === "'")
                  url3 = url3.slice(1, -1);
              }
              this.href = url3, i5 = index, state3 = "media";
            }
            break;
          case '"':
            if (state3 === "url") {
              if (index = cssText.indexOf('"', i5 + 1), !index)
                throw i5 + `: '"' not found`;
              this.href = cssText.slice(i5 + 1, index), i5 = index, state3 = "media";
            }
            break;
          case "'":
            if (state3 === "url") {
              if (index = cssText.indexOf("'", i5 + 1), !index)
                throw i5 + `: "'" not found`;
              this.href = cssText.slice(i5 + 1, index), i5 = index, state3 = "media";
            }
            break;
          case ";":
            if (state3 === "media") {
              if (buffer)
                this.media.mediaText = buffer.trim();
            }
            break;
          default:
            if (state3 === "media")
              buffer += character;
            break;
        }
    }
  });
  exports.CSSImportRule = CSSOM.CSSImportRule;
});
