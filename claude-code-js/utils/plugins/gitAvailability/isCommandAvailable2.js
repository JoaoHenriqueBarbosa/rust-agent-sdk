// function: isCommandAvailable2
async function isCommandAvailable2(command12) {
  try {
    return !!await which(command12);
  } catch {
    return !1;
  }
}
