// Shared module state and imports
// Original: src/utils/execSyncWrapper.ts
import {
  execSync as nodeExecSync
} from "child_process";

// node_modules/lru-cache/dist/esm/node/index.min.js
import { tracingChannel as j, channel as I } from "diagnostics_channel";
var S, W, x = () => S.hasSubscribers || W.hasSubscribers, G, M, C, P = (u2, e, t, i2) => {
  typeof C.emitWarning == "function" ? C.emitWarning(u2, e, t, i2) : console.error(`[${t}] ${e}: ${u2}`);
}, H = (u2) => !M.has(u2), $2, F = (u2) => !!u2 && u2 === Math.floor(u2) && u2 > 0 && isFinite(u2), U = (u2) => F(u2) ? u2 <= Math.pow(2, 8) ? Uint8Array : u2 <= Math.pow(2, 16) ? Uint16Array : u2 <= Math.pow(2, 32) ? Uint32Array : u2 <= Number.MAX_SAFE_INTEGER ? O : null : null, O, R = class u2 {
  heap;
  length;
  static #o = !1;
  static create(e) {
    let t = U(e);
    if (!t)
      return [];
    u2.#o = !0;
    let i2 = new u2(e, t);
    return u2.#o = !1, i2;
  }
  constructor(e, t) {
    if (!u2.#o)
      throw TypeError("instantiate Stack using Stack.create(n)");
    this.heap = new t(e), this.length = 0;
  }
  push(e) {
    this.heap[this.length++] = e;
  }
  pop() {
    return this.heap[--this.length];
  }
}, L;

