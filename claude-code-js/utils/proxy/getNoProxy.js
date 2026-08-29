// function: getNoProxy
function getNoProxy(env4 = process.env) {
  return env4.no_proxy || env4.NO_PROXY;
}
