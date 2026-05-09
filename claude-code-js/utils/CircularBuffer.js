// Original: src/utils/CircularBuffer.ts
class CircularBuffer {
  capacity;
  buffer;
  head = 0;
  size = 0;
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = Array(capacity);
  }
  add(item) {
    if (this.buffer[this.head] = item, this.head = (this.head + 1) % this.capacity, this.size < this.capacity)
      this.size++;
  }
  addAll(items) {
    for (let item of items)
      this.add(item);
  }
  getRecent(count3) {
    let result = [], start = this.size < this.capacity ? 0 : this.head, available = Math.min(count3, this.size);
    for (let i5 = 0;i5 < available; i5++) {
      let index = (start + this.size - available + i5) % this.capacity;
      result.push(this.buffer[index]);
    }
    return result;
  }
  toArray() {
    if (this.size === 0)
      return [];
    let result = [], start = this.size < this.capacity ? 0 : this.head;
    for (let i5 = 0;i5 < this.size; i5++) {
      let index = (start + i5) % this.capacity;
      result.push(this.buffer[index]);
    }
    return result;
  }
  clear() {
    this.buffer.length = 0, this.head = 0, this.size = 0;
  }
  length() {
    return this.size;
  }
}
