// var: warningEmitted4
var warningEmitted4 = !1, emitWarningIfUnsupportedVersion7 = (version2) => {
  if (version2 && !warningEmitted4 && parseInt(version2.substring(1, version2.indexOf("."))) < 16)
    warningEmitted4 = !0;
};
