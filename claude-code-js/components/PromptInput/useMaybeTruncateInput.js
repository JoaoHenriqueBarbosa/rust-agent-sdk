// Original: src/components/PromptInput/useMaybeTruncateInput.ts
function useMaybeTruncateInput({
  input,
  pastedContents,
  onInputChange,
  setCursorOffset,
  setPastedContents
}) {
  let [hasAppliedTruncationToInput, setHasAppliedTruncationToInput] = import_react254.useState(!1);
  import_react254.useEffect(() => {
    if (hasAppliedTruncationToInput)
      return;
    if (input.length <= 1e4)
      return;
    let { newInput, newPastedContents } = maybeTruncateInput(input, pastedContents);
    onInputChange(newInput), setCursorOffset(newInput.length), setPastedContents(newPastedContents), setHasAppliedTruncationToInput(!0);
  }, [
    input,
    hasAppliedTruncationToInput,
    pastedContents,
    onInputChange,
    setPastedContents,
    setCursorOffset
  ]), import_react254.useEffect(() => {
    if (input === "")
      setHasAppliedTruncationToInput(!1);
  }, [input]);
}
var import_react254;
var init_useMaybeTruncateInput = __esm(() => {
  init_inputPaste();
  import_react254 = __toESM(require_react_development(), 1);
});
