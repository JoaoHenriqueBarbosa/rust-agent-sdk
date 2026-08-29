// function: execSync_DEPRECATED
function execSync_DEPRECATED(command, options) {
  let __stack = [];
  try {
    const _ = __using(__stack, slowLogging`execSync: ${command.slice(0, 100)}`, 0);
    return nodeExecSync(command, options);
  } catch (_catch3) {
    var _err = _catch3, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
