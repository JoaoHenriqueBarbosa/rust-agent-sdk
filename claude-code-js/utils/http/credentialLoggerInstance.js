// function: credentialLoggerInstance
function credentialLoggerInstance(title, parent, log3 = logger8) {
  let fullTitle = parent ? `${parent.fullTitle} ${title}` : title;
  function info(message) {
    log3.info(`${fullTitle} =>`, message);
  }
  function warning(message) {
    log3.warning(`${fullTitle} =>`, message);
  }
  function verbose(message) {
    log3.verbose(`${fullTitle} =>`, message);
  }
  function error43(message) {
    log3.error(`${fullTitle} =>`, message);
  }
  return {
    title,
    fullTitle,
    info,
    warning,
    verbose,
    error: error43
  };
}
