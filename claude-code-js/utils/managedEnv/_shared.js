// Shared module state and imports
// Original: src/utils/managedEnv.ts
var ccdSpawnEnvKeys, TRUSTED_SETTING_SOURCES;

// node_modules/@growthbook/growthbook/dist/esm/util.mjs
var polyfills, base64ToBuf = (b) => Uint8Array.from(atob(b), (c3) => c3.charCodeAt(0));

// node_modules/@growthbook/growthbook/dist/esm/feature-repository.mjs
var cacheSettings, polyfills2, helpers2, subscribedInstances, cacheInitialized = !1, cache7, activeFetches, streams, supportsSSE;

// node_modules/dom-mutator/dist/dom-mutator.esm.js
var validAttributeName, nullController, elements, mutations, getHTMLValue = function(el) {
  return el.innerHTML;
}, setHTMLValue = function(el, value) {
  return el.innerHTML = value;
}, getElementPosition = function(el) {
  return {
    parentNode: el.parentElement,
    insertBeforeNode: el.nextElementSibling
  };
}, setElementPosition = function(el, value) {
  if (value.insertBeforeNode && !value.parentNode.contains(value.insertBeforeNode))
    return;
  value.parentNode.insertBefore(el, value.insertBeforeNode);
}, setClassValue = function(el, val) {
  return val ? el.className = val : el.removeAttribute("class");
}, getClassValue = function(el) {
  return el.className;
}, getAttrValue = function(attrName) {
  return function(el) {
    var _el$getAttribute;
    return (_el$getAttribute = el.getAttribute(attrName)) != null ? _el$getAttribute : null;
  };
}, setAttrValue = function(attrName) {
  return function(el, val) {
    return val !== null ? el.setAttribute(attrName, val) : el.removeAttribute(attrName);
  };
}, transformContainer, observer, index, dom_mutator_esm_default;

// node_modules/@growthbook/growthbook/dist/esm/mongrule.mjs
var _regexCache;

// node_modules/@growthbook/growthbook/dist/esm/core.mjs

// node_modules/@growthbook/growthbook/dist/esm/GrowthBook.mjs
var isBrowser2, SDK_VERSION3;

// node_modules/@growthbook/growthbook/dist/esm/index.mjs

