// class: AjvJsonSchemaValidator
class AjvJsonSchemaValidator {
  constructor(ajv) {
    this._ajv = ajv ?? createDefaultAjvInstance();
  }
  getValidator(schema5) {
    let ajvValidator = "$id" in schema5 && typeof schema5.$id === "string" ? this._ajv.getSchema(schema5.$id) ?? this._ajv.compile(schema5) : this._ajv.compile(schema5);
    return (input) => {
      if (ajvValidator(input))
        return {
          valid: !0,
          data: input,
          errorMessage: void 0
        };
      else
        return {
          valid: !1,
          data: void 0,
          errorMessage: this._ajv.errorsText(ajvValidator.errors)
        };
    };
  }
}
