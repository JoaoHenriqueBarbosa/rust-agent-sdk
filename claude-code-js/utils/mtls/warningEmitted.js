// var: warningEmitted
var warningEmitted = !1, emitWarningIfUnsupportedVersion = (version2) => {
  if (version2 && !warningEmitted && parseInt(version2.substring(1, version2.indexOf("."))) < 16)
    warningEmitted = !0;
};
