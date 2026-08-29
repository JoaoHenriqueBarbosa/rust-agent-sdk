// function: detectRunningIDEs
async function detectRunningIDEs() {
  let result = await detectRunningIDEsImpl();
  return cachedRunningIDEs = result, result;
}
