// Original: src/utils/bash/specs/alias.ts
var alias, alias_default;
var init_alias = __esm(() => {
  alias = {
    name: "alias",
    description: "Create or list command aliases",
    args: {
      name: "definition",
      description: "Alias definition in the form name=value",
      isOptional: !0,
      isVariadic: !0
    }
  }, alias_default = alias;
});
