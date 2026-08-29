// function: setProjectRoot
function setProjectRoot(cwd2) {
  STATE.projectRoot = cwd2.normalize("NFC");
}
