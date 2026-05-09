// var: isArrayBuffer4
var isArrayBuffer4 = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

// node_modules/@smithy/util-buffer-from/dist-es/index.js
import { Buffer as Buffer9 } from "buffer";
