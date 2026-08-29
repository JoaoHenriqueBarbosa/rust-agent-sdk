// var: init_exceptions4
var init_exceptions4 = __esm(() => {
  ServiceException4 = class ServiceException4 extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(options) {
      super(options.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = options.name, this.$fault = options.$fault, this.$metadata = options.$metadata;
    }
    static isInstance(value) {
      if (!value)
        return !1;
      let candidate = value;
      return ServiceException4.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
    }
    static [Symbol.hasInstance](instance) {
      if (!instance)
        return !1;
      let candidate = instance;
      if (this === ServiceException4)
        return ServiceException4.isInstance(instance);
      if (ServiceException4.isInstance(instance)) {
        if (candidate.name && this.name)
          return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
        return this.prototype.isPrototypeOf(instance);
      }
      return !1;
    }
  };
});
