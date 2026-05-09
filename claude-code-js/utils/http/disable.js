// function: disable
function disable() {
  let result = enabledString || "";
  return enable(""), result;
}
