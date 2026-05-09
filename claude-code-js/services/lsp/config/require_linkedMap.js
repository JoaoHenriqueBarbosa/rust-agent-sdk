// var: require_linkedMap
var require_linkedMap = __commonJS((exports) => {
  var _a3;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
  var Touch;
  (function(Touch2) {
    Touch2.None = 0, Touch2.First = 1, Touch2.AsOld = Touch2.First, Touch2.Last = 2, Touch2.AsNew = Touch2.Last;
  })(Touch || (exports.Touch = Touch = {}));

  class LinkedMap {
    constructor() {
      this[_a3] = "LinkedMap", this._map = /* @__PURE__ */ new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0;
    }
    clear() {
      this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++;
    }
    isEmpty() {
      return !this._head && !this._tail;
    }
    get size() {
      return this._size;
    }
    get first() {
      return this._head?.value;
    }
    get last() {
      return this._tail?.value;
    }
    has(key2) {
      return this._map.has(key2);
    }
    get(key2, touch = Touch.None) {
      let item = this._map.get(key2);
      if (!item)
        return;
      if (touch !== Touch.None)
        this.touch(item, touch);
      return item.value;
    }
    set(key2, value, touch = Touch.None) {
      let item = this._map.get(key2);
      if (item) {
        if (item.value = value, touch !== Touch.None)
          this.touch(item, touch);
      } else {
        switch (item = { key: key2, value, next: void 0, previous: void 0 }, touch) {
          case Touch.None:
            this.addItemLast(item);
            break;
          case Touch.First:
            this.addItemFirst(item);
            break;
          case Touch.Last:
            this.addItemLast(item);
            break;
          default:
            this.addItemLast(item);
            break;
        }
        this._map.set(key2, item), this._size++;
      }
      return this;
    }
    delete(key2) {
      return !!this.remove(key2);
    }
    remove(key2) {
      let item = this._map.get(key2);
      if (!item)
        return;
      return this._map.delete(key2), this.removeItem(item), this._size--, item.value;
    }
    shift() {
      if (!this._head && !this._tail)
        return;
      if (!this._head || !this._tail)
        throw Error("Invalid list");
      let item = this._head;
      return this._map.delete(item.key), this.removeItem(item), this._size--, item.value;
    }
    forEach(callbackfn, thisArg) {
      let state3 = this._state, current = this._head;
      while (current) {
        if (thisArg)
          callbackfn.bind(thisArg)(current.value, current.key, this);
        else
          callbackfn(current.value, current.key, this);
        if (this._state !== state3)
          throw Error("LinkedMap got modified during iteration.");
        current = current.next;
      }
    }
    keys() {
      let state3 = this._state, current = this._head, iterator2 = {
        [Symbol.iterator]: () => {
          return iterator2;
        },
        next: () => {
          if (this._state !== state3)
            throw Error("LinkedMap got modified during iteration.");
          if (current) {
            let result = { value: current.key, done: !1 };
            return current = current.next, result;
          } else
            return { value: void 0, done: !0 };
        }
      };
      return iterator2;
    }
    values() {
      let state3 = this._state, current = this._head, iterator2 = {
        [Symbol.iterator]: () => {
          return iterator2;
        },
        next: () => {
          if (this._state !== state3)
            throw Error("LinkedMap got modified during iteration.");
          if (current) {
            let result = { value: current.value, done: !1 };
            return current = current.next, result;
          } else
            return { value: void 0, done: !0 };
        }
      };
      return iterator2;
    }
    entries() {
      let state3 = this._state, current = this._head, iterator2 = {
        [Symbol.iterator]: () => {
          return iterator2;
        },
        next: () => {
          if (this._state !== state3)
            throw Error("LinkedMap got modified during iteration.");
          if (current) {
            let result = { value: [current.key, current.value], done: !1 };
            return current = current.next, result;
          } else
            return { value: void 0, done: !0 };
        }
      };
      return iterator2;
    }
    [(_a3 = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries();
    }
    trimOld(newSize) {
      if (newSize >= this.size)
        return;
      if (newSize === 0) {
        this.clear();
        return;
      }
      let current = this._head, currentSize = this.size;
      while (current && currentSize > newSize)
        this._map.delete(current.key), current = current.next, currentSize--;
      if (this._head = current, this._size = currentSize, current)
        current.previous = void 0;
      this._state++;
    }
    addItemFirst(item) {
      if (!this._head && !this._tail)
        this._tail = item;
      else if (!this._head)
        throw Error("Invalid list");
      else
        item.next = this._head, this._head.previous = item;
      this._head = item, this._state++;
    }
    addItemLast(item) {
      if (!this._head && !this._tail)
        this._head = item;
      else if (!this._tail)
        throw Error("Invalid list");
      else
        item.previous = this._tail, this._tail.next = item;
      this._tail = item, this._state++;
    }
    removeItem(item) {
      if (item === this._head && item === this._tail)
        this._head = void 0, this._tail = void 0;
      else if (item === this._head) {
        if (!item.next)
          throw Error("Invalid list");
        item.next.previous = void 0, this._head = item.next;
      } else if (item === this._tail) {
        if (!item.previous)
          throw Error("Invalid list");
        item.previous.next = void 0, this._tail = item.previous;
      } else {
        let { next, previous } = item;
        if (!next || !previous)
          throw Error("Invalid list");
        next.previous = previous, previous.next = next;
      }
      item.next = void 0, item.previous = void 0, this._state++;
    }
    touch(item, touch) {
      if (!this._head || !this._tail)
        throw Error("Invalid list");
      if (touch !== Touch.First && touch !== Touch.Last)
        return;
      if (touch === Touch.First) {
        if (item === this._head)
          return;
        let { next, previous } = item;
        if (item === this._tail)
          previous.next = void 0, this._tail = previous;
        else
          next.previous = previous, previous.next = next;
        item.previous = void 0, item.next = this._head, this._head.previous = item, this._head = item, this._state++;
      } else if (touch === Touch.Last) {
        if (item === this._tail)
          return;
        let { next, previous } = item;
        if (item === this._head)
          next.previous = void 0, this._head = next;
        else
          next.previous = previous, previous.next = next;
        item.next = void 0, item.previous = this._tail, this._tail.next = item, this._tail = item, this._state++;
      }
    }
    toJSON() {
      let data = [];
      return this.forEach((value, key2) => {
        data.push([key2, value]);
      }), data;
    }
    fromJSON(data) {
      this.clear();
      for (let [key2, value] of data)
        this.set(key2, value);
    }
  }
  exports.LinkedMap = LinkedMap;

  class LRUCache extends LinkedMap {
    constructor(limit, ratio = 1) {
      super();
      this._limit = limit, this._ratio = Math.min(Math.max(0, ratio), 1);
    }
    get limit() {
      return this._limit;
    }
    set limit(limit) {
      this._limit = limit, this.checkTrim();
    }
    get ratio() {
      return this._ratio;
    }
    set ratio(ratio) {
      this._ratio = Math.min(Math.max(0, ratio), 1), this.checkTrim();
    }
    get(key2, touch = Touch.AsNew) {
      return super.get(key2, touch);
    }
    peek(key2) {
      return super.get(key2, Touch.None);
    }
    set(key2, value) {
      return super.set(key2, value, Touch.Last), this.checkTrim(), this;
    }
    checkTrim() {
      if (this.size > this._limit)
        this.trimOld(Math.round(this._limit * this._ratio));
    }
  }
  exports.LRUCache = LRUCache;
});
