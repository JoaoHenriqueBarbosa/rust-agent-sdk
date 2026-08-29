// Original: src/components/CustomSelect/option-map.ts
var OptionMap;
var init_option_map = __esm(() => {
  OptionMap = class OptionMap extends Map {
    first;
    last;
    constructor(options2) {
      let items = [], firstItem, lastItem, previous, index = 0;
      for (let option of options2) {
        let item = {
          label: option.label,
          value: option.value,
          description: option.description,
          previous,
          next: void 0,
          index
        };
        if (previous)
          previous.next = item;
        firstItem ||= item, lastItem = item, items.push([option.value, item]), index++, previous = item;
      }
      super(items);
      this.first = firstItem, this.last = lastItem;
    }
  };
});
