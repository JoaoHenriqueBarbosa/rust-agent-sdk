// var: init_ZodError
var init_ZodError = __esm(() => {
  init_util8();
  ZodIssueCode2 = util10.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  ZodError2 = class ZodError2 extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [], this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      }, this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      let actualProto = new.target.prototype;
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(this, actualProto);
      else
        this.__proto__ = actualProto;
      this.name = "ZodError", this.issues = issues;
    }
    format(_mapper) {
      let mapper = _mapper || function(issue2) {
        return issue2.message;
      }, fieldErrors = { _errors: [] }, processError = (error44) => {
        for (let issue2 of error44.issues)
          if (issue2.code === "invalid_union")
            issue2.unionErrors.map(processError);
          else if (issue2.code === "invalid_return_type")
            processError(issue2.returnTypeError);
          else if (issue2.code === "invalid_arguments")
            processError(issue2.argumentsError);
          else if (issue2.path.length === 0)
            fieldErrors._errors.push(mapper(issue2));
          else {
            let curr = fieldErrors, i4 = 0;
            while (i4 < issue2.path.length) {
              let el = issue2.path[i4];
              if (i4 !== issue2.path.length - 1)
                curr[el] = curr[el] || { _errors: [] };
              else
                curr[el] = curr[el] || { _errors: [] }, curr[el]._errors.push(mapper(issue2));
              curr = curr[el], i4++;
            }
          }
      };
      return processError(this), fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError2))
        throw Error(`Not a ZodError: ${value}`);
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util10.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue2) => issue2.message) {
      let fieldErrors = {}, formErrors = [];
      for (let sub of this.issues)
        if (sub.path.length > 0) {
          let firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [], fieldErrors[firstEl].push(mapper(sub));
        } else
          formErrors.push(mapper(sub));
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  };
  ZodError2.create = (issues) => {
    return new ZodError2(issues);
  };
});
