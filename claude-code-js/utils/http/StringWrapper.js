// var: StringWrapper
var StringWrapper = function() {
  let Class2 = Object.getPrototypeOf(this).constructor, instance = new (Function.bind.apply(String, [null, ...arguments]));
  return Object.setPrototypeOf(instance, Class2.prototype), instance;
};
