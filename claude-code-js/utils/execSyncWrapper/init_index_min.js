// var: init_index_min
var init_index_min = __esm(() => {
  S = I("lru-cache:metrics"), W = j("lru-cache"), G = typeof performance == "object" && performance && typeof performance.now == "function" ? performance : Date, M = /* @__PURE__ */ new Set, C = typeof process == "object" && process ? process : {}, $2 = Symbol("type"), O = class extends Array {
    constructor(e) {
      super(e), this.fill(0);
    }
  }, L = class u3 {
    #o;
    #u;
    #w;
    #x;
    #S;
    #M;
    #U;
    #m;
    get perf() {
      return this.#m;
    }
    ttl;
    ttlResolution;
    ttlAutopurge;
    updateAgeOnGet;
    updateAgeOnHas;
    allowStale;
    noDisposeOnSet;
    noUpdateTTL;
    maxEntrySize;
    sizeCalculation;
    noDeleteOnFetchRejection;
    noDeleteOnStaleGet;
    allowStaleOnFetchAbort;
    allowStaleOnFetchRejection;
    ignoreFetchAbort;
    #n;
    #b;
    #s;
    #i;
    #t;
    #a;
    #c;
    #l;
    #h;
    #y;
    #r;
    #_;
    #F;
    #d;
    #g;
    #T;
    #W;
    #f;
    #j;
    static unsafeExposeInternals(e) {
      return { starts: e.#F, ttls: e.#d, autopurgeTimers: e.#g, sizes: e.#_, keyMap: e.#s, keyList: e.#i, valList: e.#t, next: e.#a, prev: e.#c, get head() {
        return e.#l;
      }, get tail() {
        return e.#h;
      }, free: e.#y, isBackgroundFetch: (t) => e.#e(t), backgroundFetch: (t, i2, s, n2) => e.#P(t, i2, s, n2), moveToTail: (t) => e.#L(t), indexes: (t) => e.#A(t), rindexes: (t) => e.#z(t), isStale: (t) => e.#p(t) };
    }
    get max() {
      return this.#o;
    }
    get maxSize() {
      return this.#u;
    }
    get calculatedSize() {
      return this.#b;
    }
    get size() {
      return this.#n;
    }
    get fetchMethod() {
      return this.#M;
    }
    get memoMethod() {
      return this.#U;
    }
    get dispose() {
      return this.#w;
    }
    get onInsert() {
      return this.#x;
    }
    get disposeAfter() {
      return this.#S;
    }
    constructor(e) {
      let { max: t = 0, ttl: i2, ttlResolution: s = 1, ttlAutopurge: n2, updateAgeOnGet: o2, updateAgeOnHas: r, allowStale: h2, dispose: l, onInsert: c3, disposeAfter: f, noDisposeOnSet: g, noUpdateTTL: p, maxSize: T = 0, maxEntrySize: w = 0, sizeCalculation: y, fetchMethod: a2, memoMethod: m, noDeleteOnFetchRejection: _, noDeleteOnStaleGet: b, allowStaleOnFetchRejection: d, allowStaleOnFetchAbort: A, ignoreFetchAbort: z, perf: D } = e;
      if (D !== void 0 && typeof D?.now != "function")
        throw TypeError("perf option must have a now() method if specified");
      if (this.#m = D ?? G, t !== 0 && !F(t))
        throw TypeError("max option must be a nonnegative integer");
      let v = t ? U(t) : Array;
      if (!v)
        throw Error("invalid max value: " + t);
      if (this.#o = t, this.#u = T, this.maxEntrySize = w || this.#u, this.sizeCalculation = y, this.sizeCalculation) {
        if (!this.#u && !this.maxEntrySize)
          throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
        if (typeof this.sizeCalculation != "function")
          throw TypeError("sizeCalculation set to non-function");
      }
      if (m !== void 0 && typeof m != "function")
        throw TypeError("memoMethod must be a function if defined");
      if (this.#U = m, a2 !== void 0 && typeof a2 != "function")
        throw TypeError("fetchMethod must be a function if specified");
      if (this.#M = a2, this.#W = !!a2, this.#s = /* @__PURE__ */ new Map, this.#i = Array.from({ length: t }).fill(void 0), this.#t = Array.from({ length: t }).fill(void 0), this.#a = new v(t), this.#c = new v(t), this.#l = 0, this.#h = 0, this.#y = R.create(t), this.#n = 0, this.#b = 0, typeof l == "function" && (this.#w = l), typeof c3 == "function" && (this.#x = c3), typeof f == "function" ? (this.#S = f, this.#r = []) : (this.#S = void 0, this.#r = void 0), this.#T = !!this.#w, this.#j = !!this.#x, this.#f = !!this.#S, this.noDisposeOnSet = !!g, this.noUpdateTTL = !!p, this.noDeleteOnFetchRejection = !!_, this.allowStaleOnFetchRejection = !!d, this.allowStaleOnFetchAbort = !!A, this.ignoreFetchAbort = !!z, this.maxEntrySize !== 0) {
        if (this.#u !== 0 && !F(this.#u))
          throw TypeError("maxSize must be a positive integer if specified");
        if (!F(this.maxEntrySize))
          throw TypeError("maxEntrySize must be a positive integer if specified");
        this.#X();
      }
      if (this.allowStale = !!h2, this.noDeleteOnStaleGet = !!b, this.updateAgeOnGet = !!o2, this.updateAgeOnHas = !!r, this.ttlResolution = F(s) || s === 0 ? s : 1, this.ttlAutopurge = !!n2, this.ttl = i2 || 0, this.ttl) {
        if (!F(this.ttl))
          throw TypeError("ttl must be a positive integer if specified");
        this.#H();
      }
      if (this.#o === 0 && this.ttl === 0 && this.#u === 0)
        throw TypeError("At least one of max, maxSize, or ttl is required");
      if (!this.ttlAutopurge && !this.#o && !this.#u) {
        let E = "LRU_CACHE_UNBOUNDED";
        H(E) && (M.add(E), P("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", E, u3));
      }
    }
    getRemainingTTL(e) {
      return this.#s.has(e) ? 1 / 0 : 0;
    }
    #H() {
      let e = new O(this.#o), t = new O(this.#o);
      this.#d = e, this.#F = t;
      let i2 = this.ttlAutopurge ? Array.from({ length: this.#o }) : void 0;
      this.#g = i2, this.#N = (r, h2, l = this.#m.now()) => {
        t[r] = h2 !== 0 ? l : 0, e[r] = h2, s(r, h2);
      }, this.#D = (r) => {
        t[r] = e[r] !== 0 ? this.#m.now() : 0, s(r, e[r]);
      };
      let s = this.ttlAutopurge ? (r, h2) => {
        if (i2?.[r] && (clearTimeout(i2[r]), i2[r] = void 0), h2 && h2 !== 0 && i2) {
          let l = setTimeout(() => {
            this.#p(r) && this.#v(this.#i[r], "expire");
          }, h2 + 1);
          l.unref && l.unref(), i2[r] = l;
        }
      } : () => {};
      this.#E = (r, h2) => {
        if (e[h2]) {
          let l = e[h2], c3 = t[h2];
          if (!l || !c3)
            return;
          r.ttl = l, r.start = c3, r.now = n2 || o2();
          let f = r.now - c3;
          r.remainingTTL = l - f;
        }
      };
      let n2 = 0, o2 = () => {
        let r = this.#m.now();
        if (this.ttlResolution > 0) {
          n2 = r;
          let h2 = setTimeout(() => n2 = 0, this.ttlResolution);
          h2.unref && h2.unref();
        }
        return r;
      };
      this.getRemainingTTL = (r) => {
        let h2 = this.#s.get(r);
        if (h2 === void 0)
          return 0;
        let l = e[h2], c3 = t[h2];
        if (!l || !c3)
          return 1 / 0;
        let f = (n2 || o2()) - c3;
        return l - f;
      }, this.#p = (r) => {
        let h2 = t[r], l = e[r];
        return !!l && !!h2 && (n2 || o2()) - h2 > l;
      };
    }
    #D = () => {};
    #E = () => {};
    #N = () => {};
    #p = () => !1;
    #X() {
      let e = new O(this.#o);
      this.#b = 0, this.#_ = e, this.#R = (t) => {
        this.#b -= e[t], e[t] = 0;
      }, this.#k = (t, i2, s, n2) => {
        if (this.#e(i2))
          return 0;
        if (!F(s))
          if (n2) {
            if (typeof n2 != "function")
              throw TypeError("sizeCalculation must be a function");
            if (s = n2(i2, t), !F(s))
              throw TypeError("sizeCalculation return invalid (expect positive integer)");
          } else
            throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        return s;
      }, this.#I = (t, i2, s) => {
        if (e[t] = i2, this.#u) {
          let n2 = this.#u - e[t];
          for (;this.#b > n2; )
            this.#G(!0);
        }
        this.#b += e[t], s && (s.entrySize = i2, s.totalCalculatedSize = this.#b);
      };
    }
    #R = (e) => {};
    #I = (e, t, i2) => {};
    #k = (e, t, i2, s) => {
      if (i2 || s)
        throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      return 0;
    };
    *#A({ allowStale: e = this.allowStale } = {}) {
      if (this.#n)
        for (let t = this.#h;this.#V(t) && ((e || !this.#p(t)) && (yield t), t !== this.#l); )
          t = this.#c[t];
    }
    *#z({ allowStale: e = this.allowStale } = {}) {
      if (this.#n)
        for (let t = this.#l;this.#V(t) && ((e || !this.#p(t)) && (yield t), t !== this.#h); )
          t = this.#a[t];
    }
    #V(e) {
      return e !== void 0 && this.#s.get(this.#i[e]) === e;
    }
    *entries() {
      for (let e of this.#A())
        this.#t[e] !== void 0 && this.#i[e] !== void 0 && !this.#e(this.#t[e]) && (yield [this.#i[e], this.#t[e]]);
    }
    *rentries() {
      for (let e of this.#z())
        this.#t[e] !== void 0 && this.#i[e] !== void 0 && !this.#e(this.#t[e]) && (yield [this.#i[e], this.#t[e]]);
    }
    *keys() {
      for (let e of this.#A()) {
        let t = this.#i[e];
        t !== void 0 && !this.#e(this.#t[e]) && (yield t);
      }
    }
    *rkeys() {
      for (let e of this.#z()) {
        let t = this.#i[e];
        t !== void 0 && !this.#e(this.#t[e]) && (yield t);
      }
    }
    *values() {
      for (let e of this.#A())
        this.#t[e] !== void 0 && !this.#e(this.#t[e]) && (yield this.#t[e]);
    }
    *rvalues() {
      for (let e of this.#z())
        this.#t[e] !== void 0 && !this.#e(this.#t[e]) && (yield this.#t[e]);
    }
    [Symbol.iterator]() {
      return this.entries();
    }
    [Symbol.toStringTag] = "LRUCache";
    find(e, t = {}) {
      for (let i2 of this.#A()) {
        let s = this.#t[i2], n2 = this.#e(s) ? s.__staleWhileFetching : s;
        if (n2 !== void 0 && e(n2, this.#i[i2], this))
          return this.#C(this.#i[i2], t);
      }
    }
    forEach(e, t = this) {
      for (let i2 of this.#A()) {
        let s = this.#t[i2], n2 = this.#e(s) ? s.__staleWhileFetching : s;
        n2 !== void 0 && e.call(t, n2, this.#i[i2], this);
      }
    }
    rforEach(e, t = this) {
      for (let i2 of this.#z()) {
        let s = this.#t[i2], n2 = this.#e(s) ? s.__staleWhileFetching : s;
        n2 !== void 0 && e.call(t, n2, this.#i[i2], this);
      }
    }
    purgeStale() {
      let e = !1;
      for (let t of this.#z({ allowStale: !0 }))
        this.#p(t) && (this.#v(this.#i[t], "expire"), e = !0);
      return e;
    }
    info(e) {
      let t = this.#s.get(e);
      if (t === void 0)
        return;
      let i2 = this.#t[t], s = this.#e(i2) ? i2.__staleWhileFetching : i2;
      if (s === void 0)
        return;
      let n2 = { value: s };
      if (this.#d && this.#F) {
        let o2 = this.#d[t], r = this.#F[t];
        if (o2 && r) {
          let h2 = o2 - (this.#m.now() - r);
          n2.ttl = h2, n2.start = Date.now();
        }
      }
      return this.#_ && (n2.size = this.#_[t]), n2;
    }
    dump() {
      let e = [];
      for (let t of this.#A({ allowStale: !0 })) {
        let i2 = this.#i[t], s = this.#t[t], n2 = this.#e(s) ? s.__staleWhileFetching : s;
        if (n2 === void 0 || i2 === void 0)
          continue;
        let o2 = { value: n2 };
        if (this.#d && this.#F) {
          o2.ttl = this.#d[t];
          let r = this.#m.now() - this.#F[t];
          o2.start = Math.floor(Date.now() - r);
        }
        this.#_ && (o2.size = this.#_[t]), e.unshift([i2, o2]);
      }
      return e;
    }
    load(e) {
      this.clear();
      for (let [t, i2] of e) {
        if (i2.start) {
          let s = Date.now() - i2.start;
          i2.start = this.#m.now() - s;
        }
        this.#O(t, i2.value, i2);
      }
    }
    set(e, t, i2 = {}) {
      let { status: s = S.hasSubscribers ? {} : void 0 } = i2;
      i2.status = s, s && (s.op = "set", s.key = e, t !== void 0 && (s.value = t));
      let n2 = this.#O(e, t, i2);
      return s && S.hasSubscribers && S.publish(s), n2;
    }
    #O(e, t, i2 = {}) {
      let { ttl: s = this.ttl, start: n2, noDisposeOnSet: o2 = this.noDisposeOnSet, sizeCalculation: r = this.sizeCalculation, status: h2 } = i2;
      if (t === void 0)
        return h2 && (h2.set = "deleted"), this.delete(e), this;
      let { noUpdateTTL: l = this.noUpdateTTL } = i2;
      h2 && !this.#e(t) && (h2.value = t);
      let c3 = this.#k(e, t, i2.size || 0, r, h2);
      if (this.maxEntrySize && c3 > this.maxEntrySize)
        return this.#v(e, "set"), h2 && (h2.set = "miss", h2.maxEntrySizeExceeded = !0), this;
      let f = this.#n === 0 ? void 0 : this.#s.get(e);
      if (f === void 0)
        f = this.#n === 0 ? this.#h : this.#y.length !== 0 ? this.#y.pop() : this.#n === this.#o ? this.#G(!1) : this.#n, this.#i[f] = e, this.#t[f] = t, this.#s.set(e, f), this.#a[this.#h] = f, this.#c[f] = this.#h, this.#h = f, this.#n++, this.#I(f, c3, h2), h2 && (h2.set = "add"), l = !1, this.#j && this.#x?.(t, e, "add");
      else {
        this.#L(f);
        let g = this.#t[f];
        if (t !== g) {
          if (this.#W && this.#e(g)) {
            g.__abortController.abort(Error("replaced"));
            let { __staleWhileFetching: p } = g;
            p !== void 0 && !o2 && (this.#T && this.#w?.(p, e, "set"), this.#f && this.#r?.push([p, e, "set"]));
          } else
            o2 || (this.#T && this.#w?.(g, e, "set"), this.#f && this.#r?.push([g, e, "set"]));
          if (this.#R(f), this.#I(f, c3, h2), this.#t[f] = t, h2) {
            h2.set = "replace";
            let p = g && this.#e(g) ? g.__staleWhileFetching : g;
            p !== void 0 && (h2.oldValue = p);
          }
        } else
          h2 && (h2.set = "update");
        this.#j && this.onInsert?.(t, e, t === g ? "update" : "replace");
      }
      if (s !== 0 && !this.#d && this.#H(), this.#d && (l || this.#N(f, s, n2), h2 && this.#E(h2, f)), !o2 && this.#f && this.#r) {
        let g = this.#r, p;
        for (;p = g?.shift(); )
          this.#S?.(...p);
      }
      return this;
    }
    pop() {
      try {
        for (;this.#n; ) {
          let e = this.#t[this.#l];
          if (this.#G(!0), this.#e(e)) {
            if (e.__staleWhileFetching)
              return e.__staleWhileFetching;
          } else if (e !== void 0)
            return e;
        }
      } finally {
        if (this.#f && this.#r) {
          let e = this.#r, t;
          for (;t = e?.shift(); )
            this.#S?.(...t);
        }
      }
    }
    #G(e) {
      let t = this.#l, i2 = this.#i[t], s = this.#t[t];
      return this.#W && this.#e(s) ? s.__abortController.abort(Error("evicted")) : (this.#T || this.#f) && (this.#T && this.#w?.(s, i2, "evict"), this.#f && this.#r?.push([s, i2, "evict"])), this.#R(t), this.#g?.[t] && (clearTimeout(this.#g[t]), this.#g[t] = void 0), e && (this.#i[t] = void 0, this.#t[t] = void 0, this.#y.push(t)), this.#n === 1 ? (this.#l = this.#h = 0, this.#y.length = 0) : this.#l = this.#a[t], this.#s.delete(i2), this.#n--, t;
    }
    has(e, t = {}) {
      let { status: i2 = S.hasSubscribers ? {} : void 0 } = t;
      t.status = i2, i2 && (i2.op = "has", i2.key = e);
      let s = this.#Y(e, t);
      return S.hasSubscribers && S.publish(i2), s;
    }
    #Y(e, t = {}) {
      let { updateAgeOnHas: i2 = this.updateAgeOnHas, status: s } = t, n2 = this.#s.get(e);
      if (n2 !== void 0) {
        let o2 = this.#t[n2];
        if (this.#e(o2) && o2.__staleWhileFetching === void 0)
          return !1;
        if (this.#p(n2))
          s && (s.has = "stale", this.#E(s, n2));
        else
          return i2 && this.#D(n2), s && (s.has = "hit", this.#E(s, n2)), !0;
      } else
        s && (s.has = "miss");
      return !1;
    }
    peek(e, t = {}) {
      let { status: i2 = x() ? {} : void 0 } = t;
      i2 && (i2.op = "peek", i2.key = e), t.status = i2;
      let s = this.#J(e, t);
      return S.hasSubscribers && S.publish(i2), s;
    }
    #J(e, t) {
      let { status: i2, allowStale: s = this.allowStale } = t, n2 = this.#s.get(e);
      if (n2 === void 0 || !s && this.#p(n2)) {
        i2 && (i2.peek = n2 === void 0 ? "miss" : "stale");
        return;
      }
      let o2 = this.#t[n2], r = this.#e(o2) ? o2.__staleWhileFetching : o2;
      return i2 && (r !== void 0 ? (i2.peek = "hit", i2.value = r) : i2.peek = "miss"), r;
    }
    #P(e, t, i2, s) {
      let n2 = t === void 0 ? void 0 : this.#t[t];
      if (this.#e(n2))
        return n2;
      let o2 = new AbortController, { signal: r } = i2;
      r?.addEventListener("abort", () => o2.abort(r.reason), { signal: o2.signal });
      let h2 = { signal: o2.signal, options: i2, context: s }, l = (w, y = !1) => {
        let { aborted: a2 } = o2.signal, m = i2.ignoreFetchAbort && w !== void 0, _ = i2.ignoreFetchAbort || !!(i2.allowStaleOnFetchAbort && w !== void 0);
        if (i2.status && (a2 && !y ? (i2.status.fetchAborted = !0, i2.status.fetchError = o2.signal.reason, m && (i2.status.fetchAbortIgnored = !0)) : i2.status.fetchResolved = !0), a2 && !m && !y)
          return f(o2.signal.reason, _);
        let b = p, d = this.#t[t];
        return (d === p || d === void 0 && m && y) && (w === void 0 ? b.__staleWhileFetching !== void 0 ? this.#t[t] = b.__staleWhileFetching : this.#v(e, "fetch") : (i2.status && (i2.status.fetchUpdated = !0), this.#O(e, w, h2.options))), w;
      }, c3 = (w) => (i2.status && (i2.status.fetchRejected = !0, i2.status.fetchError = w), f(w, !1)), f = (w, y) => {
        let { aborted: a2 } = o2.signal, m = a2 && i2.allowStaleOnFetchAbort, _ = m || i2.allowStaleOnFetchRejection, b = _ || i2.noDeleteOnFetchRejection, d = p;
        if (this.#t[t] === p && (!b || !y && d.__staleWhileFetching === void 0 ? this.#v(e, "fetch") : m || (this.#t[t] = d.__staleWhileFetching)), _)
          return i2.status && d.__staleWhileFetching !== void 0 && (i2.status.returnedStale = !0), d.__staleWhileFetching;
        if (d.__returned === d)
          throw w;
      }, g = (w, y) => {
        let a2 = this.#M?.(e, n2, h2);
        a2 && a2 instanceof Promise && a2.then((m) => w(m === void 0 ? void 0 : m), y), o2.signal.addEventListener("abort", () => {
          (!i2.ignoreFetchAbort || i2.allowStaleOnFetchAbort) && (w(void 0), i2.allowStaleOnFetchAbort && (w = (m) => l(m, !0)));
        });
      };
      i2.status && (i2.status.fetchDispatched = !0);
      let p = new Promise(g).then(l, c3), T = Object.assign(p, { __abortController: o2, __staleWhileFetching: n2, __returned: void 0 });
      return t === void 0 ? (this.#O(e, T, { ...h2.options, status: void 0 }), t = this.#s.get(e)) : this.#t[t] = T, T;
    }
    #e(e) {
      if (!this.#W)
        return !1;
      let t = e;
      return !!t && t instanceof Promise && t.hasOwnProperty("__staleWhileFetching") && t.__abortController instanceof AbortController;
    }
    fetch(e, t = {}) {
      let i2 = W.hasSubscribers, { status: s = x() ? {} : void 0 } = t;
      t.status = s, s && t.context && (s.context = t.context);
      let n2 = this.#B(e, t);
      return s && x() && i2 && (s.trace = !0, W.tracePromise(() => n2, s).catch(() => {})), n2;
    }
    async#B(e, t = {}) {
      let { allowStale: i2 = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n2 = this.noDeleteOnStaleGet, ttl: o2 = this.ttl, noDisposeOnSet: r = this.noDisposeOnSet, size: h2 = 0, sizeCalculation: l = this.sizeCalculation, noUpdateTTL: c3 = this.noUpdateTTL, noDeleteOnFetchRejection: f = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: g = this.allowStaleOnFetchRejection, ignoreFetchAbort: p = this.ignoreFetchAbort, allowStaleOnFetchAbort: T = this.allowStaleOnFetchAbort, context: w, forceRefresh: y = !1, status: a2, signal: m } = t;
      if (a2 && (a2.op = "fetch", a2.key = e, y && (a2.forceRefresh = !0)), !this.#W)
        return a2 && (a2.fetch = "get"), this.#C(e, { allowStale: i2, updateAgeOnGet: s, noDeleteOnStaleGet: n2, status: a2 });
      let _ = { allowStale: i2, updateAgeOnGet: s, noDeleteOnStaleGet: n2, ttl: o2, noDisposeOnSet: r, size: h2, sizeCalculation: l, noUpdateTTL: c3, noDeleteOnFetchRejection: f, allowStaleOnFetchRejection: g, allowStaleOnFetchAbort: T, ignoreFetchAbort: p, status: a2, signal: m }, b = this.#s.get(e);
      if (b === void 0) {
        a2 && (a2.fetch = "miss");
        let d = this.#P(e, b, _, w);
        return d.__returned = d;
      } else {
        let d = this.#t[b];
        if (this.#e(d)) {
          let E = i2 && d.__staleWhileFetching !== void 0;
          return a2 && (a2.fetch = "inflight", E && (a2.returnedStale = !0)), E ? d.__staleWhileFetching : d.__returned = d;
        }
        let A = this.#p(b);
        if (!y && !A)
          return a2 && (a2.fetch = "hit"), this.#L(b), s && this.#D(b), a2 && this.#E(a2, b), d;
        let z = this.#P(e, b, _, w), v = z.__staleWhileFetching !== void 0 && i2;
        return a2 && (a2.fetch = A ? "stale" : "refresh", v && A && (a2.returnedStale = !0)), v ? z.__staleWhileFetching : z.__returned = z;
      }
    }
    forceFetch(e, t = {}) {
      let i2 = W.hasSubscribers, { status: s = x() ? {} : void 0 } = t;
      t.status = s, s && t.context && (s.context = t.context);
      let n2 = this.#K(e, t);
      return s && x() && i2 && (s.trace = !0, W.tracePromise(() => n2, s).catch(() => {})), n2;
    }
    async#K(e, t = {}) {
      let i2 = await this.#B(e, t);
      if (i2 === void 0)
        throw Error("fetch() returned undefined");
      return i2;
    }
    memo(e, t = {}) {
      let { status: i2 = S.hasSubscribers ? {} : void 0 } = t;
      t.status = i2, i2 && (i2.op = "memo", i2.key = e, t.context && (i2.context = t.context));
      let s = this.#Q(e, t);
      return i2 && (i2.value = s), S.hasSubscribers && S.publish(i2), s;
    }
    #Q(e, t = {}) {
      let i2 = this.#U;
      if (!i2)
        throw Error("no memoMethod provided to constructor");
      let { context: s, status: n2, forceRefresh: o2, ...r } = t;
      n2 && o2 && (n2.forceRefresh = !0);
      let h2 = this.#C(e, r), l = o2 || h2 === void 0;
      if (n2 && (n2.memo = l ? "miss" : "hit", l || (n2.value = h2)), !l)
        return h2;
      let c3 = i2(e, h2, { options: r, context: s });
      return n2 && (n2.value = c3), this.#O(e, c3, r), c3;
    }
    get(e, t = {}) {
      let { status: i2 = S.hasSubscribers ? {} : void 0 } = t;
      t.status = i2, i2 && (i2.op = "get", i2.key = e);
      let s = this.#C(e, t);
      return i2 && (s !== void 0 && (i2.value = s), S.hasSubscribers && S.publish(i2)), s;
    }
    #C(e, t = {}) {
      let { allowStale: i2 = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n2 = this.noDeleteOnStaleGet, status: o2 } = t, r = this.#s.get(e);
      if (r === void 0) {
        o2 && (o2.get = "miss");
        return;
      }
      let h2 = this.#t[r], l = this.#e(h2);
      return o2 && this.#E(o2, r), this.#p(r) ? l ? (o2 && (o2.get = "stale-fetching"), i2 && h2.__staleWhileFetching !== void 0 ? (o2 && (o2.returnedStale = !0), h2.__staleWhileFetching) : void 0) : (n2 || this.#v(e, "expire"), o2 && (o2.get = "stale"), i2 ? (o2 && (o2.returnedStale = !0), h2) : void 0) : (o2 && (o2.get = l ? "fetching" : "hit"), this.#L(r), s && this.#D(r), l ? h2.__staleWhileFetching : h2);
    }
    #$(e, t) {
      this.#c[t] = e, this.#a[e] = t;
    }
    #L(e) {
      e !== this.#h && (e === this.#l ? this.#l = this.#a[e] : this.#$(this.#c[e], this.#a[e]), this.#$(this.#h, e), this.#h = e);
    }
    delete(e) {
      return this.#v(e, "delete");
    }
    #v(e, t) {
      S.hasSubscribers && S.publish({ op: "delete", delete: t, key: e });
      let i2 = !1;
      if (this.#n !== 0) {
        let s = this.#s.get(e);
        if (s !== void 0)
          if (this.#g?.[s] && (clearTimeout(this.#g?.[s]), this.#g[s] = void 0), i2 = !0, this.#n === 1)
            this.#q(t);
          else {
            this.#R(s);
            let n2 = this.#t[s];
            if (this.#e(n2) ? n2.__abortController.abort(Error("deleted")) : (this.#T || this.#f) && (this.#T && this.#w?.(n2, e, t), this.#f && this.#r?.push([n2, e, t])), this.#s.delete(e), this.#i[s] = void 0, this.#t[s] = void 0, s === this.#h)
              this.#h = this.#c[s];
            else if (s === this.#l)
              this.#l = this.#a[s];
            else {
              let o2 = this.#c[s];
              this.#a[o2] = this.#a[s];
              let r = this.#a[s];
              this.#c[r] = this.#c[s];
            }
            this.#n--, this.#y.push(s);
          }
      }
      if (this.#f && this.#r?.length) {
        let s = this.#r, n2;
        for (;n2 = s?.shift(); )
          this.#S?.(...n2);
      }
      return i2;
    }
    clear() {
      return this.#q("delete");
    }
    #q(e) {
      for (let t of this.#z({ allowStale: !0 })) {
        let i2 = this.#t[t];
        if (this.#e(i2))
          i2.__abortController.abort(Error("deleted"));
        else {
          let s = this.#i[t];
          this.#T && this.#w?.(i2, s, e), this.#f && this.#r?.push([i2, s, e]);
        }
      }
      if (this.#s.clear(), this.#t.fill(void 0), this.#i.fill(void 0), this.#d && this.#F) {
        this.#d.fill(0), this.#F.fill(0);
        for (let t of this.#g ?? [])
          t !== void 0 && clearTimeout(t);
        this.#g?.fill(void 0);
      }
      if (this.#_ && this.#_.fill(0), this.#l = 0, this.#h = 0, this.#y.length = 0, this.#b = 0, this.#n = 0, this.#f && this.#r) {
        let t = this.#r, i2;
        for (;i2 = t?.shift(); )
          this.#S?.(...i2);
      }
    }
  };
});
