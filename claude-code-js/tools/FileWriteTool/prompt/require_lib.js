// var: require_lib
var require_lib = __commonJS((exports, module) => {
  var Stream4 = __require("stream");

  class MuteStream extends Stream4 {
    #isTTY = null;
    constructor(opts = {}) {
      super(opts);
      this.writable = this.readable = !0, this.muted = !1, this.on("pipe", this._onpipe), this.replace = opts.replace, this._prompt = opts.prompt || null, this._hadControl = !1;
    }
    #destSrc(key, def) {
      if (this._dest)
        return this._dest[key];
      if (this._src)
        return this._src[key];
      return def;
    }
    #proxy(method, ...args) {
      if (typeof this._dest?.[method] === "function")
        this._dest[method](...args);
      if (typeof this._src?.[method] === "function")
        this._src[method](...args);
    }
    get isTTY() {
      if (this.#isTTY !== null)
        return this.#isTTY;
      return this.#destSrc("isTTY", !1);
    }
    set isTTY(val) {
      this.#isTTY = val;
    }
    get rows() {
      return this.#destSrc("rows");
    }
    get columns() {
      return this.#destSrc("columns");
    }
    mute() {
      this.muted = !0;
    }
    unmute() {
      this.muted = !1;
    }
    _onpipe(src) {
      this._src = src;
    }
    pipe(dest, options) {
      return this._dest = dest, super.pipe(dest, options);
    }
    pause() {
      if (this._src)
        return this._src.pause();
    }
    resume() {
      if (this._src)
        return this._src.resume();
    }
    write(c3) {
      if (this.muted) {
        if (!this.replace)
          return !0;
        if (c3.match(/^\u001b/)) {
          if (c3.indexOf(this._prompt) === 0)
            c3 = c3.slice(this._prompt.length), c3 = c3.replace(/./g, this.replace), c3 = this._prompt + c3;
          return this._hadControl = !0, this.emit("data", c3);
        } else {
          if (this._prompt && this._hadControl && c3.indexOf(this._prompt) === 0)
            this._hadControl = !1, this.emit("data", this._prompt), c3 = c3.slice(this._prompt.length);
          c3 = c3.toString().replace(/./g, this.replace);
        }
      }
      this.emit("data", c3);
    }
    end(c3) {
      if (this.muted)
        if (c3 && this.replace)
          c3 = c3.toString().replace(/./g, this.replace);
        else
          c3 = null;
      if (c3)
        this.emit("data", c3);
      this.emit("end");
    }
    destroy(...args) {
      return this.#proxy("destroy", ...args);
    }
    destroySoon(...args) {
      return this.#proxy("destroySoon", ...args);
    }
    close(...args) {
      return this.#proxy("close", ...args);
    }
  }
  module.exports = MuteStream;
});
