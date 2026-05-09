// function: InstallOnMount
function InstallOnMount(t0) {
  let $3 = import_compiler_runtime167.c(4), {
    ide,
    onInstall
  } = t0, t1, t2;
  if ($3[0] !== ide || $3[1] !== onInstall)
    t1 = () => {
      onInstall(ide);
    }, t2 = [ide, onInstall], $3[0] = ide, $3[1] = onInstall, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  return import_react115.useEffect(t1, t2), null;
}
