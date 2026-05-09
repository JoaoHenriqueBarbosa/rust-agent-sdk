// class: FuseIndex
class FuseIndex {
  constructor({
    getFn = Config2.getFn,
    fieldNormWeight = Config2.fieldNormWeight
  } = {}) {
    this.norm = norm(fieldNormWeight, 3), this.getFn = getFn, this.isCreated = !1, this.docs = [], this.keys = [], this._keysMap = {}, this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys3 = []) {
    this.keys = keys3, this._keysMap = {}, keys3.forEach((key3, idx) => {
      this._keysMap[key3.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length)
      return;
    if (this.isCreated = !0, isString2(this.docs[0]))
      this.docs.forEach((doc2, docIndex) => {
        this._addString(doc2, docIndex);
      });
    else
      this.docs.forEach((doc2, docIndex) => {
        this._addObject(doc2, docIndex);
      });
    this.norm.clear();
  }
  add(doc2) {
    let idx = this.size();
    if (isString2(doc2))
      this._addString(doc2, idx);
    else
      this._addObject(doc2, idx);
  }
  removeAt(idx) {
    this.records.splice(idx, 1);
    for (let i5 = idx, len = this.size();i5 < len; i5 += 1)
      this.records[i5].i -= 1;
  }
  removeAll(indices) {
    for (let i5 = indices.length - 1;i5 >= 0; i5 -= 1)
      this.records.splice(indices[i5], 1);
    for (let i5 = 0, len = this.records.length;i5 < len; i5 += 1)
      this.records[i5].i = i5;
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]];
  }
  size() {
    return this.records.length;
  }
  _addString(doc2, docIndex) {
    if (!isDefined2(doc2) || isBlank2(doc2))
      return;
    let record3 = {
      v: doc2,
      i: docIndex,
      n: this.norm.get(doc2)
    };
    this.records.push(record3);
  }
  _addObject(doc2, docIndex) {
    let record3 = {
      i: docIndex,
      $: {}
    };
    this.keys.forEach((key3, keyIndex) => {
      let value = key3.getFn ? key3.getFn(doc2) : this.getFn(doc2, key3.path);
      if (!isDefined2(value))
        return;
      if (isArray8(value)) {
        let subRecords = [];
        for (let i5 = 0, len = value.length;i5 < len; i5 += 1) {
          let item = value[i5];
          if (!isDefined2(item))
            continue;
          if (isString2(item)) {
            if (!isBlank2(item)) {
              let subRecord = {
                v: item,
                i: i5,
                n: this.norm.get(item)
              };
              subRecords.push(subRecord);
            }
          } else if (isDefined2(item.v)) {
            let text2 = isString2(item.v) ? item.v : toString8(item.v);
            if (!isBlank2(text2)) {
              let subRecord = {
                v: text2,
                i: item.i,
                n: this.norm.get(text2)
              };
              subRecords.push(subRecord);
            }
          }
        }
        record3.$[keyIndex] = subRecords;
      } else if (isString2(value) && !isBlank2(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };
        record3.$[keyIndex] = subRecord;
      }
    }), this.records.push(record3);
  }
  toJSON() {
    return {
      keys: this.keys.map(({
        getFn,
        ...key3
      }) => key3),
      records: this.records
    };
  }
}
