// var: require_URLUtils
var require_URLUtils = __commonJS((exports, module) => {
  var URL4 = require_URL();
  module.exports = URLUtils;
  function URLUtils() {}
  URLUtils.prototype = Object.create(Object.prototype, {
    _url: { get: function() {
      return new URL4(this.href);
    } },
    protocol: {
      get: function() {
        var url3 = this._url;
        if (url3 && url3.scheme)
          return url3.scheme + ":";
        else
          return ":";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute()) {
          if (v2 = v2.replace(/:+$/, ""), v2 = v2.replace(/[^-+\.a-zA-Z0-9]/g, URL4.percentEncode), v2.length > 0)
            url3.scheme = v2, output = url3.toString();
        }
        this.href = output;
      }
    },
    host: {
      get: function() {
        var url3 = this._url;
        if (url3.isAbsolute() && url3.isAuthorityBased())
          return url3.host + (url3.port ? ":" + url3.port : "");
        else
          return "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute() && url3.isAuthorityBased()) {
          if (v2 = v2.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, URL4.percentEncode), v2.length > 0)
            url3.host = v2, delete url3.port, output = url3.toString();
        }
        this.href = output;
      }
    },
    hostname: {
      get: function() {
        var url3 = this._url;
        if (url3.isAbsolute() && url3.isAuthorityBased())
          return url3.host;
        else
          return "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute() && url3.isAuthorityBased()) {
          if (v2 = v2.replace(/^\/+/, ""), v2 = v2.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, URL4.percentEncode), v2.length > 0)
            url3.host = v2, output = url3.toString();
        }
        this.href = output;
      }
    },
    port: {
      get: function() {
        var url3 = this._url;
        if (url3.isAbsolute() && url3.isAuthorityBased() && url3.port !== void 0)
          return url3.port;
        else
          return "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute() && url3.isAuthorityBased()) {
          if (v2 = "" + v2, v2 = v2.replace(/[^0-9].*$/, ""), v2 = v2.replace(/^0+/, ""), v2.length === 0)
            v2 = "0";
          if (parseInt(v2, 10) <= 65535)
            url3.port = v2, output = url3.toString();
        }
        this.href = output;
      }
    },
    pathname: {
      get: function() {
        var url3 = this._url;
        if (url3.isAbsolute() && url3.isHierarchical())
          return url3.path;
        else
          return "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute() && url3.isHierarchical()) {
          if (v2.charAt(0) !== "/")
            v2 = "/" + v2;
          v2 = v2.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, URL4.percentEncode), url3.path = v2, output = url3.toString();
        }
        this.href = output;
      }
    },
    search: {
      get: function() {
        var url3 = this._url;
        if (url3.isAbsolute() && url3.isHierarchical() && url3.query !== void 0)
          return "?" + url3.query;
        else
          return "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute() && url3.isHierarchical()) {
          if (v2.charAt(0) === "?")
            v2 = v2.substring(1);
          v2 = v2.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, URL4.percentEncode), url3.query = v2, output = url3.toString();
        }
        this.href = output;
      }
    },
    hash: {
      get: function() {
        var url3 = this._url;
        if (url3 == null || url3.fragment == null || url3.fragment === "")
          return "";
        else
          return "#" + url3.fragment;
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (v2.charAt(0) === "#")
          v2 = v2.substring(1);
        v2 = v2.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, URL4.percentEncode), url3.fragment = v2, output = url3.toString(), this.href = output;
      }
    },
    username: {
      get: function() {
        var url3 = this._url;
        return url3.username || "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute())
          v2 = v2.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, URL4.percentEncode), url3.username = v2, output = url3.toString();
        this.href = output;
      }
    },
    password: {
      get: function() {
        var url3 = this._url;
        return url3.password || "";
      },
      set: function(v2) {
        var output = this.href, url3 = new URL4(output);
        if (url3.isAbsolute()) {
          if (v2 === "")
            url3.password = null;
          else
            v2 = v2.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, URL4.percentEncode), url3.password = v2;
          output = url3.toString();
        }
        this.href = output;
      }
    },
    origin: { get: function() {
      var url3 = this._url;
      if (url3 == null)
        return "";
      var originForPort = function(defaultPort) {
        var origin2 = [url3.scheme, url3.host, +url3.port || defaultPort];
        return origin2[0] + "://" + origin2[1] + (origin2[2] === defaultPort ? "" : ":" + origin2[2]);
      };
      switch (url3.scheme) {
        case "ftp":
          return originForPort(21);
        case "gopher":
          return originForPort(70);
        case "http":
        case "ws":
          return originForPort(80);
        case "https":
        case "wss":
          return originForPort(443);
        default:
          return url3.scheme + "://";
      }
    } }
  });
  URLUtils._inherit = function(proto2) {
    Object.getOwnPropertyNames(URLUtils.prototype).forEach(function(p4) {
      if (p4 === "constructor" || p4 === "href")
        return;
      var desc = Object.getOwnPropertyDescriptor(URLUtils.prototype, p4);
      Object.defineProperty(proto2, p4, desc);
    });
  };
});
