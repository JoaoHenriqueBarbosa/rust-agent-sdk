// var: init_legacy
var init_legacy = __esm(() => {
  init_esm27();
  init_querying();
  Checks = {
    tag_name(name3) {
      if (typeof name3 === "function")
        return (elem) => isTag2(elem) && name3(elem.name);
      else if (name3 === "*")
        return isTag2;
      return (elem) => isTag2(elem) && elem.name === name3;
    },
    tag_type(type) {
      if (typeof type === "function")
        return (elem) => type(elem.type);
      return (elem) => elem.type === type;
    },
    tag_contains(data) {
      if (typeof data === "function")
        return (elem) => isText(elem) && data(elem.data);
      return (elem) => isText(elem) && elem.data === data;
    }
  };
});
