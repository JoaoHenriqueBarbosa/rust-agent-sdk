// function: normalizeChoices
function normalizeChoices(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return choice;
    if (typeof choice === "string")
      return {
        value: choice,
        name: choice,
        short: choice,
        disabled: !1
      };
    let name3 = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name: name3,
      description: choice.description,
      short: choice.short ?? name3,
      disabled: choice.disabled ?? !1
    };
  });
}
