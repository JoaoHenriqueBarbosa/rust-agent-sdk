// function: logPolicy2
function logPolicy2(options = {}) {
  return logPolicy({
    logger: logger12.info,
    ...options
  });
}
