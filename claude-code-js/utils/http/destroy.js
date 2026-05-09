// function: destroy
function destroy() {
  let index = debuggers.indexOf(this);
  if (index >= 0)
    return debuggers.splice(index, 1), !0;
  return !1;
}
