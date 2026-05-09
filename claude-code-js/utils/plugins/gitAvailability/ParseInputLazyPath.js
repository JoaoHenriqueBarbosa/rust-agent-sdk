// class: ParseInputLazyPath
class ParseInputLazyPath {
  constructor(parent, value, path16, key) {
    this._cachedPath = [], this.parent = parent, this.data = value, this._path = path16, this._key = key;
  }
  get path() {
    if (!this._cachedPath.length)
      if (Array.isArray(this._key))
        this._cachedPath.push(...this._path, ...this._key);
      else
        this._cachedPath.push(...this._path, this._key);
    return this._cachedPath;
  }
}
