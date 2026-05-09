// function: safeCall
async function safeCall(fn) {
  try {
    await fn();
  } catch (e) {}
}
