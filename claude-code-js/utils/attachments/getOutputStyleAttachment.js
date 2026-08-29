// function: getOutputStyleAttachment
function getOutputStyleAttachment() {
  let outputStyle = getSettings_DEPRECATED()?.outputStyle || "default";
  if (outputStyle === "default")
    return [];
  return [
    {
      type: "output_style",
      style: outputStyle
    }
  ];
}
