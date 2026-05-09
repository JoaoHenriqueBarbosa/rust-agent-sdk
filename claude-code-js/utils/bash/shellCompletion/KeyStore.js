// class: KeyStore
class KeyStore {
  constructor(keys3) {
    this._keys = [], this._keyMap = {};
    let totalWeight = 0;
    keys3.forEach((key3) => {
      let obj = createKey(key3);
      this._keys.push(obj), this._keyMap[obj.id] = obj, totalWeight += obj.weight;
    }), this._keys.forEach((key3) => {
      key3.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
