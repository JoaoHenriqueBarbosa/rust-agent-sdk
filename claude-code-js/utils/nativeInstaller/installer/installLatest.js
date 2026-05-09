// function: installLatest
function installLatest(channelOrVersion, forceReinstall = !1) {
  if (forceReinstall)
    return installLatestImpl(channelOrVersion, forceReinstall);
  if (inFlightInstall)
    return logForDebugging("installLatest: joining in-flight call"), inFlightInstall;
  let promise3 = installLatestImpl(channelOrVersion, forceReinstall);
  inFlightInstall = promise3;
  let clear = () => {
    inFlightInstall = null;
  };
  return promise3.then(clear, clear), promise3;
}
