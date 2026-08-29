// var: init__baseCreate
var init__baseCreate = __esm(() => {
  init_isObject();
  objectCreate = Object.create, baseCreate = function() {
    function object() {}
    return function(proto) {
      if (!isObject_default(proto))
        return {};
      if (objectCreate)
        return objectCreate(proto);
      object.prototype = proto;
      var result = new object;
      return object.prototype = void 0, result;
    };
  }(), _baseCreate_default = baseCreate;
});
