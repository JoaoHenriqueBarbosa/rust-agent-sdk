// var: warningEmitted3
var warningEmitted3 = !1, emitWarningIfUnsupportedVersion5 = (version2) => {
  if (version2 && !warningEmitted3 && parseInt(version2.substring(1, version2.indexOf("."))) < 16)
    warningEmitted3 = !0;
};
