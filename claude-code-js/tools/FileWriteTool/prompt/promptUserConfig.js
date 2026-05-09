// function: promptUserConfig
async function promptUserConfig() {
  if (!await esm_default3({
    message: "Add user-configurable options?",
    default: !1
  }))
    return {};
  let userConfig = {}, addMore = !0;
  while (addMore) {
    let optionKey = await esm_default4({
      message: "Configuration option key (unique identifier):",
      validate: (value) => {
        if (!value.trim())
          return "Key is required";
        if (userConfig[value])
          return "Key must be unique";
        return !0;
      }
    }), optionType = await esm_default5({
      message: "Option type:",
      choices: [
        { name: "String", value: "string" },
        { name: "Number", value: "number" },
        { name: "Boolean", value: "boolean" },
        { name: "Directory", value: "directory" },
        { name: "File", value: "file" }
      ]
    }), optionTitle = await esm_default4({
      message: "Option title (human-readable name):",
      validate: (value) => value.trim().length > 0 || "Title is required"
    }), optionDescription = await esm_default4({
      message: "Option description:",
      validate: (value) => value.trim().length > 0 || "Description is required"
    }), optionRequired = await esm_default3({
      message: "Is this option required?",
      default: !1
    }), optionSensitive = await esm_default3({
      message: "Is this option sensitive (like a password)?",
      default: !1
    }), option = {
      type: optionType,
      title: optionTitle,
      description: optionDescription,
      required: optionRequired,
      sensitive: optionSensitive
    };
    if (!optionRequired) {
      let defaultValue;
      if (optionType === "boolean")
        defaultValue = await esm_default3({
          message: "Default value:",
          default: !1
        });
      else if (optionType === "number") {
        let defaultStr = await esm_default4({
          message: "Default value (number):",
          validate: (value) => {
            if (!value.trim())
              return !0;
            return !isNaN(Number(value)) || "Must be a valid number";
          }
        });
        defaultValue = defaultStr ? Number(defaultStr) : void 0;
      } else
        defaultValue = await esm_default4({
          message: "Default value (optional):"
        });
      if (defaultValue !== void 0 && defaultValue !== "")
        option.default = defaultValue;
    }
    if (optionType === "number") {
      if (await esm_default3({
        message: "Add min/max constraints?",
        default: !1
      })) {
        let min = await esm_default4({
          message: "Minimum value (optional):",
          validate: (value) => {
            if (!value.trim())
              return !0;
            return !isNaN(Number(value)) || "Must be a valid number";
          }
        }), max = await esm_default4({
          message: "Maximum value (optional):",
          validate: (value) => {
            if (!value.trim())
              return !0;
            return !isNaN(Number(value)) || "Must be a valid number";
          }
        });
        if (min)
          option.min = Number(min);
        if (max)
          option.max = Number(max);
      }
    }
    userConfig[optionKey] = option, addMore = await esm_default3({
      message: "Add another configuration option?",
      default: !1
    });
  }
  return userConfig;
}
