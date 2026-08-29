// class: Separator
class Separator {
  separator = import_yoctocolors_cjs2.default.dim(Array.from({ length: 15 }).join(esm_default2.line));
  type = "separator";
  constructor(separator) {
    if (separator)
      this.separator = separator;
  }
  static isSeparator(choice) {
    return Boolean(choice && typeof choice === "object" && "type" in choice && choice.type === "separator");
  }
}
