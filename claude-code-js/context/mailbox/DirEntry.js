// class: DirEntry
class DirEntry {
  constructor(dir, removeWatcher) {
    this.path = dir, this._removeWatcher = removeWatcher, this.items = /* @__PURE__ */ new Set;
  }
  add(item) {
    let { items } = this;
    if (!items)
      return;
    if (item !== ONE_DOT && item !== TWO_DOTS)
      items.add(item);
  }
  async remove(item) {
    let { items } = this;
    if (!items)
      return;
    if (items.delete(item), items.size > 0)
      return;
    let dir = this.path;
    try {
      await readdir5(dir);
    } catch (err) {
      if (this._removeWatcher)
        this._removeWatcher(sysPath2.dirname(dir), sysPath2.basename(dir));
    }
  }
  has(item) {
    let { items } = this;
    if (!items)
      return;
    return items.has(item);
  }
  getChildren() {
    let { items } = this;
    if (!items)
      return [];
    return [...items.values()];
  }
  dispose() {
    this.items.clear(), this.path = "", this._removeWatcher = EMPTY_FN, this.items = EMPTY_SET, Object.freeze(this);
  }
}
