// var: warningEmitted2
var warningEmitted2 = !1, emitWarningIfUnsupportedVersion3 = (version2) => {
  if (version2 && !warningEmitted2 && parseInt(version2.substring(1, version2.indexOf("."))) < 16)
    warningEmitted2 = !0;
};
