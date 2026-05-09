// var: init_cookies
var init_cookies = __esm(() => {
  init_utils();
  init_platform2();
  cookies_default = platform_default.hasStandardBrowserEnv ? {
    write(name, value, expires, path9, domain2, secure, sameSite) {
      if (typeof document > "u")
        return;
      let cookie = [`${name}=${encodeURIComponent(value)}`];
      if (utils_default.isNumber(expires))
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      if (utils_default.isString(path9))
        cookie.push(`path=${path9}`);
      if (utils_default.isString(domain2))
        cookie.push(`domain=${domain2}`);
      if (secure === !0)
        cookie.push("secure");
      if (utils_default.isString(sameSite))
        cookie.push(`SameSite=${sameSite}`);
      document.cookie = cookie.join("; ");
    },
    read(name) {
      if (typeof document > "u")
        return null;
      let match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 86400000, "/");
    }
  } : {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };
});
