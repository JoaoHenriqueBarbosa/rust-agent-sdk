// class: MaxHeap
class MaxHeap {
  constructor(limit) {
    this.limit = limit, this.heap = [];
  }
  get size() {
    return this.heap.length;
  }
  shouldInsert(score) {
    return this.size < this.limit || score < this.heap[0].score;
  }
  insert(item) {
    if (this.size < this.limit)
      this.heap.push(item), this._bubbleUp(this.size - 1);
    else if (item.score < this.heap[0].score)
      this.heap[0] = item, this._sinkDown(0);
  }
  extractSorted(sortFn) {
    return this.heap.sort(sortFn);
  }
  _bubbleUp(i5) {
    let heap = this.heap;
    while (i5 > 0) {
      let parent2 = i5 - 1 >> 1;
      if (heap[i5].score <= heap[parent2].score)
        break;
      let tmp = heap[i5];
      heap[i5] = heap[parent2], heap[parent2] = tmp, i5 = parent2;
    }
  }
  _sinkDown(i5) {
    let heap = this.heap, len = heap.length, largest = i5;
    do {
      i5 = largest;
      let left = 2 * i5 + 1, right = 2 * i5 + 2;
      if (left < len && heap[left].score > heap[largest].score)
        largest = left;
      if (right < len && heap[right].score > heap[largest].score)
        largest = right;
      if (largest !== i5) {
        let tmp = heap[i5];
        heap[i5] = heap[largest], heap[largest] = tmp;
      }
    } while (largest !== i5);
  }
}
