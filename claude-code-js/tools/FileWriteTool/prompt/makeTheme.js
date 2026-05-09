// function: makeTheme
function makeTheme(...themes) {
  let themesToMerge = [
    defaultTheme,
    ...themes.filter((theme) => theme != null)
  ];
  return deepMerge(...themesToMerge);
}
