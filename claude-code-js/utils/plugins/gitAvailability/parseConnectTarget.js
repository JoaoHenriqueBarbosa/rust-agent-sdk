// function: parseConnectTarget
function parseConnectTarget(target) {
  let m4 = /^\[([^\]]+)\]:(\d+)$/.exec(target) ?? /^([^:]+):(\d+)$/.exec(target);
  if (!m4)
    return;
  let port = Number(m4[2]);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    return;
  return { hostname: m4[1], port };
}
