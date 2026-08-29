// function: buildWellKnownPath
function buildWellKnownPath(wellKnownPrefix, pathname = "", options2 = {}) {
  if (pathname.endsWith("/"))
    pathname = pathname.slice(0, -1);
  return options2.prependPathname ? `${pathname}/.well-known/${wellKnownPrefix}` : `/.well-known/${wellKnownPrefix}${pathname}`;
}
