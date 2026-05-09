// function: credentialLogger
function credentialLogger(title, log3 = logger8) {
  let credLogger = credentialLoggerInstance(title, void 0, log3);
  return {
    ...credLogger,
    parent: log3,
    getToken: credentialLoggerInstance("=> getToken()", credLogger, log3)
  };
}
