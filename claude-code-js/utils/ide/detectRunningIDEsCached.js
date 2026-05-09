// function: detectRunningIDEsCached
async function detectRunningIDEsCached() {
  if (cachedRunningIDEs === null)
    return detectRunningIDEs();
  return cachedRunningIDEs;
}
