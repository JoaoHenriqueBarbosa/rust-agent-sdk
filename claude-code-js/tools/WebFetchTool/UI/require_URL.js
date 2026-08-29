// var: require_URL
var require_URL = __commonJS((exports, module) => {
  module.exports = URL4;
  function URL4(url3) {
    if (!url3)
      return Object.create(URL4.prototype);
    this.url = url3.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
    var match = URL4.pattern.exec(this.url);
    if (match) {
      if (match[2])
        this.scheme = match[2];
      if (match[4]) {
        var userinfo = match[4].match(URL4.userinfoPattern);
        if (userinfo)
          this.username = userinfo[1], this.password = userinfo[3], match[4] = match[4].substring(userinfo[0].length);
        if (match[4].match(URL4.portPattern)) {
          var pos = match[4].lastIndexOf(":");
          this.host = match[4].substring(0, pos), this.port = match[4].substring(pos + 1);
        } else
          this.host = match[4];
      }
      if (match[5])
        this.path = match[5];
      if (match[6])
        this.query = match[7];
      if (match[8])
        this.fragment = match[9];
    }
  }
  URL4.pattern = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
  URL4.userinfoPattern = /^([^@:]*)(:([^@]*))?@/;
  URL4.portPattern = /:\d+$/;
  URL4.authorityPattern = /^[^:\/?#]+:\/\//;
  URL4.hierarchyPattern = /^[^:\/?#]+:\//;
  URL4.percentEncode = function(s2) {
    var c3 = s2.charCodeAt(0);
    if (c3 < 256)
      return "%" + c3.toString(16);
    else
      throw Error("can't percent-encode codepoints > 255 yet");
  };
  URL4.prototype = {
    constructor: URL4,
    isAbsolute: function() {
      return !!this.scheme;
    },
    isAuthorityBased: function() {
      return URL4.authorityPattern.test(this.url);
    },
    isHierarchical: function() {
      return URL4.hierarchyPattern.test(this.url);
    },
    toString: function() {
      var s2 = "";
      if (this.scheme !== void 0)
        s2 += this.scheme + ":";
      if (this.isAbsolute()) {
        if (s2 += "//", this.username || this.password) {
          if (s2 += this.username || "", this.password)
            s2 += ":" + this.password;
          s2 += "@";
        }
        if (this.host)
          s2 += this.host;
      }
      if (this.port !== void 0)
        s2 += ":" + this.port;
      if (this.path !== void 0)
        s2 += this.path;
      if (this.query !== void 0)
        s2 += "?" + this.query;
      if (this.fragment !== void 0)
        s2 += "#" + this.fragment;
      return s2;
    },
    resolve: function(relative18) {
      var base2 = this, r4 = new URL4(relative18), t2 = new URL4;
      if (r4.scheme !== void 0)
        t2.scheme = r4.scheme, t2.username = r4.username, t2.password = r4.password, t2.host = r4.host, t2.port = r4.port, t2.path = remove_dot_segments(r4.path), t2.query = r4.query;
      else if (t2.scheme = base2.scheme, r4.host !== void 0)
        t2.username = r4.username, t2.password = r4.password, t2.host = r4.host, t2.port = r4.port, t2.path = remove_dot_segments(r4.path), t2.query = r4.query;
      else if (t2.username = base2.username, t2.password = base2.password, t2.host = base2.host, t2.port = base2.port, !r4.path)
        if (t2.path = base2.path, r4.query !== void 0)
          t2.query = r4.query;
        else
          t2.query = base2.query;
      else {
        if (r4.path.charAt(0) === "/")
          t2.path = remove_dot_segments(r4.path);
        else
          t2.path = merge4(base2.path, r4.path), t2.path = remove_dot_segments(t2.path);
        t2.query = r4.query;
      }
      return t2.fragment = r4.fragment, t2.toString();
      function merge4(basepath, refpath) {
        if (base2.host !== void 0 && !base2.path)
          return "/" + refpath;
        var lastslash = basepath.lastIndexOf("/");
        if (lastslash === -1)
          return refpath;
        else
          return basepath.substring(0, lastslash + 1) + refpath;
      }
      function remove_dot_segments(path19) {
        if (!path19)
          return path19;
        var output = "";
        while (path19.length > 0) {
          if (path19 === "." || path19 === "..") {
            path19 = "";
            break;
          }
          var twochars = path19.substring(0, 2), threechars = path19.substring(0, 3), fourchars = path19.substring(0, 4);
          if (threechars === "../")
            path19 = path19.substring(3);
          else if (twochars === "./")
            path19 = path19.substring(2);
          else if (threechars === "/./")
            path19 = "/" + path19.substring(3);
          else if (twochars === "/." && path19.length === 2)
            path19 = "/";
          else if (fourchars === "/../" || threechars === "/.." && path19.length === 3)
            path19 = "/" + path19.substring(4), output = output.replace(/\/?[^\/]*$/, "");
          else {
            var segment = path19.match(/(\/?([^\/]*))/)[0];
            output += segment, path19 = path19.substring(segment.length);
          }
        }
        return output;
      }
    }
  };
});
