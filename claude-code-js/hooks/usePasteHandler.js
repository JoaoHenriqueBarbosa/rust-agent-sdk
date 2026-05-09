// Original: src/hooks/usePasteHandler.ts
import { basename as basename33 } from "path";
function usePasteHandler({
  onPaste,
  onInput,
  onImagePaste
}) {
  let [pasteState, setPasteState] = import_react86.default.useState({ chunks: [], timeoutId: null }), [isPasting, setIsPasting] = import_react86.default.useState(!1), isMountedRef = import_react86.default.useRef(!0), pastePendingRef = import_react86.default.useRef(!1), isMacOS = import_react86.default.useMemo(() => getPlatform() === "macos", []);
  import_react86.default.useEffect(() => {
    return () => {
      isMountedRef.current = !1;
    };
  }, []);
  let checkClipboardForImageImpl = import_react86.default.useCallback(() => {
    if (!onImagePaste || !isMountedRef.current)
      return;
    getImageFromClipboard().then((imageData) => {
      if (imageData && isMountedRef.current)
        onImagePaste(imageData.base64, imageData.mediaType, void 0, imageData.dimensions);
    }).catch((error44) => {
      if (isMountedRef.current)
        logError2(error44);
    }).finally(() => {
      if (isMountedRef.current)
        setIsPasting(!1);
    });
  }, [onImagePaste]), checkClipboardForImage = useDebounceCallback(checkClipboardForImageImpl, CLIPBOARD_CHECK_DEBOUNCE_MS), resetPasteTimeout = import_react86.default.useCallback((currentTimeoutId2) => {
    if (currentTimeoutId2)
      clearTimeout(currentTimeoutId2);
    return setTimeout((setPasteState2, onImagePaste2, onPaste2, setIsPasting2, checkClipboardForImage2, isMacOS2, pastePendingRef2) => {
      pastePendingRef2.current = !1, setPasteState2(({ chunks }) => {
        let pastedText = chunks.join("").replace(/\[I$/, "").replace(/\[O$/, ""), lines2 = pastedText.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((part) => part.split(`
`)).filter((line) => line.trim()), imagePaths = lines2.filter((line) => isImageFilePath(line));
        if (onImagePaste2 && imagePaths.length > 0) {
          let isTempScreenshot = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(pastedText);
          return Promise.all(imagePaths.map((imagePath) => tryReadImageFromPath(imagePath))).then((results) => {
            let validImages = results.filter((r4) => r4 !== null);
            if (validImages.length > 0) {
              for (let imageData of validImages) {
                let filename = basename33(imageData.path);
                onImagePaste2(imageData.base64, imageData.mediaType, filename, imageData.dimensions, imageData.path);
              }
              let nonImageLines = lines2.filter((line) => !isImageFilePath(line));
              if (nonImageLines.length > 0 && onPaste2)
                onPaste2(nonImageLines.join(`
`));
              setIsPasting2(!1);
            } else if (isTempScreenshot && isMacOS2)
              checkClipboardForImage2();
            else {
              if (onPaste2)
                onPaste2(pastedText);
              setIsPasting2(!1);
            }
          }), { chunks: [], timeoutId: null };
        }
        if (isMacOS2 && onImagePaste2 && pastedText.length === 0)
          return checkClipboardForImage2(), { chunks: [], timeoutId: null };
        if (onPaste2)
          onPaste2(pastedText);
        return setIsPasting2(!1), { chunks: [], timeoutId: null };
      });
    }, PASTE_COMPLETION_TIMEOUT_MS, setPasteState, onImagePaste, onPaste, setIsPasting, checkClipboardForImage, isMacOS, pastePendingRef);
  }, [checkClipboardForImage, isMacOS, onImagePaste, onPaste]);
  return {
    wrappedOnInput: (input, key3, event) => {
      let isFromPaste = event.keypress.isPasted;
      if (isFromPaste)
        setIsPasting(!0);
      let hasImageFilePath = input.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((part) => part.split(`
`)).some((line) => isImageFilePath(line.trim()));
      if (isFromPaste && input.length === 0 && isMacOS && onImagePaste) {
        checkClipboardForImage(), setIsPasting(!1);
        return;
      }
      if (onPaste && (input.length > PASTE_THRESHOLD || pastePendingRef.current || hasImageFilePath || isFromPaste)) {
        pastePendingRef.current = !0, setPasteState(({ chunks, timeoutId }) => {
          return {
            chunks: [...chunks, input],
            timeoutId: resetPasteTimeout(timeoutId)
          };
        });
        return;
      }
      if (onInput(input, key3), input.length > 10)
        setIsPasting(!1);
    },
    pasteState,
    isPasting
  };
}
var import_react86, CLIPBOARD_CHECK_DEBOUNCE_MS = 50, PASTE_COMPLETION_TIMEOUT_MS = 100;
var init_usePasteHandler = __esm(() => {
  init_log3();
  init_dist4();
  init_imagePaste();
  init_platform();
  import_react86 = __toESM(require_react_development(), 1);
});
