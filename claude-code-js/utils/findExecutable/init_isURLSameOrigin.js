// var: init_isURLSameOrigin
var init_isURLSameOrigin = __esm(() => {
  init_platform2();
  isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin2, isMSIE) => (url3) => {
    return url3 = new URL(url3, platform_default.origin), origin2.protocol === url3.protocol && origin2.host === url3.host && (isMSIE || origin2.port === url3.port);
  })(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => !0;
});
