// Original: src/commands/copy/copy.tsx
var exports_copy = {};
__export(exports_copy, {
  fileExtension: () => fileExtension2,
  collectRecentAssistantTexts: () => collectRecentAssistantTexts,
  call: () => call11
});
import { mkdir as mkdir25, writeFile as writeFile31 } from "fs/promises";
import { tmpdir as tmpdir9 } from "os";
import { join as join110 } from "path";
function extractCodeBlocks(markdown) {
  let tokens = marked.lexer(stripPromptXMLTags(markdown)), blocks = [];
  for (let token of tokens)
    if (token.type === "code") {
      let codeToken = token;
      blocks.push({
        code: codeToken.text,
        lang: codeToken.lang
      });
    }
  return blocks;
}
function collectRecentAssistantTexts(messages) {
  let texts = [];
  for (let i5 = messages.length - 1;i5 >= 0 && texts.length < MAX_LOOKBACK; i5--) {
    let msg = messages[i5];
    if (msg?.type !== "assistant" || msg.isApiErrorMessage)
      continue;
    let content = msg.message.content;
    if (!Array.isArray(content))
      continue;
    let text2 = extractTextContent(content, `

`);
    if (text2)
      texts.push(text2);
  }
  return texts;
}
function fileExtension2(lang) {
  if (lang) {
    let sanitized = lang.replace(/[^a-zA-Z0-9]/g, "");
    if (sanitized && sanitized !== "plaintext")
      return `.${sanitized}`;
  }
  return ".txt";
}
async function writeToFile(text2, filename) {
  let filePath = join110(COPY_DIR, filename);
  return await mkdir25(COPY_DIR, {
    recursive: !0
  }), await writeFile31(filePath, text2, "utf-8"), filePath;
}
async function copyOrWriteToFile(text2, filename) {
  let raw = await setClipboard(text2);
  if (raw)
    process.stdout.write(raw);
  let lineCount = countCharInString(text2, `
`) + 1, charCount = text2.length;
  try {
    let filePath = await writeToFile(text2, filename);
    return `Copied to clipboard (${charCount} characters, ${lineCount} lines)
Also written to ${filePath}`;
  } catch {
    return `Copied to clipboard (${charCount} characters, ${lineCount} lines)`;
  }
}
function truncateLine(text2, maxLen) {
  let firstLine = text2.split(`
`)[0] ?? "";
  if (stringWidth(firstLine) <= maxLen)
    return firstLine;
  let result = "", width = 0, targetWidth = maxLen - 1;
  for (let char of firstLine) {
    let charWidth = stringWidth(char);
    if (width + charWidth > targetWidth)
      break;
    result += char, width += charWidth;
  }
  return result + "\u2026";
}
function CopyPicker(t0) {
  let $3 = import_compiler_runtime130.c(33), {
    fullText,
    codeBlocks,
    messageAge,
    onDone
  } = t0, focusedRef = import_react95.useRef("full"), t1 = `${fullText.length} chars, ${countCharInString(fullText, `
`) + 1} lines`, t2;
  if ($3[0] !== t1)
    t2 = {
      label: "Full response",
      value: "full",
      description: t1
    }, $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== codeBlocks || $3[3] !== t2) {
    let t42;
    if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
      t42 = {
        label: "Always copy full response",
        value: "always",
        description: "Skip this picker in the future (revert via /config)"
      }, $3[5] = t42;
    else
      t42 = $3[5];
    t3 = [t2, ...codeBlocks.map(_temp61), t42], $3[2] = codeBlocks, $3[3] = t2, $3[4] = t3;
  } else
    t3 = $3[4];
  let options2 = t3, t4;
  if ($3[6] !== codeBlocks || $3[7] !== fullText)
    t4 = function(selected) {
      if (selected === "full" || selected === "always")
        return {
          text: fullText,
          filename: RESPONSE_FILENAME
        };
      let block_0 = codeBlocks[selected];
      return {
        text: block_0.code,
        filename: `copy${fileExtension2(block_0.lang)}`,
        blockIndex: selected
      };
    }, $3[6] = codeBlocks, $3[7] = fullText, $3[8] = t4;
  else
    t4 = $3[8];
  let getSelectionContent = t4, t5;
  if ($3[9] !== codeBlocks.length || $3[10] !== getSelectionContent || $3[11] !== messageAge || $3[12] !== onDone)
    t5 = async function(selected_0) {
      let content = getSelectionContent(selected_0);
      if (selected_0 === "always") {
        if (!getGlobalConfig().copyFullResponse)
          saveGlobalConfig(_temp213);
        logEvent("tengu_copy", {
          block_count: codeBlocks.length,
          always: !0,
          message_age: messageAge
        });
        let result = await copyOrWriteToFile(content.text, content.filename);
        onDone(`${result}
Preference saved. Use /config to change copyFullResponse`);
        return;
      }
      logEvent("tengu_copy", {
        selected_block: content.blockIndex,
        block_count: codeBlocks.length,
        message_age: messageAge
      });
      let result_0 = await copyOrWriteToFile(content.text, content.filename);
      onDone(result_0);
    }, $3[9] = codeBlocks.length, $3[10] = getSelectionContent, $3[11] = messageAge, $3[12] = onDone, $3[13] = t5;
  else
    t5 = $3[13];
  let handleSelect = t5, t6;
  if ($3[14] !== codeBlocks.length || $3[15] !== getSelectionContent || $3[16] !== messageAge || $3[17] !== onDone) {
    let handleWrite = async function(selected_1) {
      let content_0 = getSelectionContent(selected_1);
      logEvent("tengu_copy", {
        selected_block: content_0.blockIndex,
        block_count: codeBlocks.length,
        message_age: messageAge,
        write_shortcut: !0
      });
      try {
        let filePath = await writeToFile(content_0.text, content_0.filename);
        onDone(`Written to ${filePath}`);
      } catch (t72) {
        let e = t72;
        onDone(`Failed to write file: ${e instanceof Error ? e.message : e}`);
      }
    };
    t6 = function(e_0) {
      if (e_0.key === "w")
        e_0.preventDefault(), handleWrite(focusedRef.current);
    }, $3[14] = codeBlocks.length, $3[15] = getSelectionContent, $3[16] = messageAge, $3[17] = onDone, $3[18] = t6;
  } else
    t6 = $3[18];
  let handleKeyDown = t6, t7;
  if ($3[19] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Select content to copy:"
    }, void 0, !1, void 0, this), $3[19] = t7;
  else
    t7 = $3[19];
  let t8;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t8 = (value) => {
      focusedRef.current = value;
    }, $3[20] = t8;
  else
    t8 = $3[20];
  let t9;
  if ($3[21] !== handleSelect)
    t9 = (selected_2) => {
      handleSelect(selected_2);
    }, $3[21] = handleSelect, $3[22] = t9;
  else
    t9 = $3[22];
  let t10;
  if ($3[23] !== onDone)
    t10 = () => {
      onDone("Copy cancelled", {
        display: "system"
      });
    }, $3[23] = onDone, $3[24] = t10;
  else
    t10 = $3[24];
  let t11;
  if ($3[25] !== options2 || $3[26] !== t10 || $3[27] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(Select, {
      options: options2,
      hideIndexes: !1,
      onFocus: t8,
      onChange: t9,
      onCancel: t10
    }, void 0, !1, void 0, this), $3[25] = options2, $3[26] = t10, $3[27] = t9, $3[28] = t11;
  else
    t11 = $3[28];
  let t12;
  if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(KeyboardShortcutHint, {
            shortcut: "enter",
            action: "copy"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(KeyboardShortcutHint, {
            shortcut: "w",
            action: "write to file"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(KeyboardShortcutHint, {
            shortcut: "esc",
            action: "cancel"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = t12;
  else
    t12 = $3[29];
  let t13;
  if ($3[30] !== handleKeyDown || $3[31] !== t11)
    t13 = /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(Pane, {
      children: /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: handleKeyDown,
        children: [
          t7,
          t11,
          t12
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[30] = handleKeyDown, $3[31] = t11, $3[32] = t13;
  else
    t13 = $3[32];
  return t13;
}
function _temp213(c3) {
  return {
    ...c3,
    copyFullResponse: !0
  };
}
function _temp61(block2, index) {
  let blockLines = countCharInString(block2.code, `
`) + 1;
  return {
    label: truncateLine(block2.code, 60),
    value: index,
    description: [block2.lang, blockLines > 1 ? `${blockLines} lines` : void 0].filter(Boolean).join(", ") || void 0
  };
}
var import_compiler_runtime130, import_react95, jsx_dev_runtime166, COPY_DIR, RESPONSE_FILENAME = "response.md", MAX_LOOKBACK = 20, call11 = async (onDone, context6, args) => {
  let texts = collectRecentAssistantTexts(context6.messages);
  if (texts.length === 0)
    return onDone("No assistant message to copy"), null;
  let age = 0, arg = args?.trim();
  if (arg) {
    let n5 = Number(arg);
    if (!Number.isInteger(n5) || n5 < 1)
      return onDone(`Usage: /copy [N] where N is 1 (latest), 2, 3, \u2026 Got: ${arg}`), null;
    if (n5 > texts.length)
      return onDone(`Only ${texts.length} assistant ${texts.length === 1 ? "message" : "messages"} available to copy`), null;
    age = n5 - 1;
  }
  let text2 = texts[age], codeBlocks = extractCodeBlocks(text2), config10 = getGlobalConfig();
  if (codeBlocks.length === 0 || config10.copyFullResponse) {
    logEvent("tengu_copy", {
      always: config10.copyFullResponse,
      block_count: codeBlocks.length,
      message_age: age
    });
    let result = await copyOrWriteToFile(text2, RESPONSE_FILENAME);
    return onDone(result), null;
  }
  return /* @__PURE__ */ jsx_dev_runtime166.jsxDEV(CopyPicker, {
    fullText: text2,
    codeBlocks,
    messageAge: age,
    onDone
  }, void 0, !1, void 0, this);
};
var init_copy = __esm(() => {
  init_marked_esm();
  init_select();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Pane();
  init_stringWidth();
  init_osc();
  init_ink2();
  init_config4();
  init_messages3();
  import_compiler_runtime130 = __toESM(require_react_compiler_runtime_development(), 1), import_react95 = __toESM(require_react_development(), 1), jsx_dev_runtime166 = __toESM(require_react_jsx_dev_runtime_development(), 1), COPY_DIR = join110(tmpdir9(), "claude");
});
