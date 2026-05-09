// Original: src/commands/tag/tag.tsx
var exports_tag = {};
__export(exports_tag, {
  call: () => call61
});
function ConfirmRemoveTag(t0) {
  let $3 = import_compiler_runtime274.c(11), {
    tagName: tagName19,
    onConfirm,
    onCancel
  } = t0, t1 = `Current tag: #${tagName19}`, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ThemedText, {
      children: "This will remove the tag from the current session."
    }, void 0, !1, void 0, this), $3[0] = t2;
  else
    t2 = $3[0];
  let t3;
  if ($3[1] !== onCancel || $3[2] !== onConfirm)
    t3 = (value) => value === "yes" ? onConfirm() : onCancel(), $3[1] = onCancel, $3[2] = onConfirm, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      label: "Yes, remove tag",
      value: "yes"
    }, {
      label: "No, keep tag",
      value: "no"
    }], $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] !== t3)
    t5 = /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t2,
        /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(Select, {
          onChange: t3,
          options: t4
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[5] = t3, $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== onCancel || $3[8] !== t1 || $3[9] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(Dialog, {
      title: "Remove tag?",
      subtitle: t1,
      onCancel,
      color: "warning",
      children: t5
    }, void 0, !1, void 0, this), $3[7] = onCancel, $3[8] = t1, $3[9] = t5, $3[10] = t6;
  else
    t6 = $3[10];
  return t6;
}
function ToggleTagAndClose(t0) {
  let $3 = import_compiler_runtime274.c(17), {
    tagName: tagName19,
    onDone
  } = t0, [showConfirm, setShowConfirm] = React109.useState(!1), [sessionId, setSessionId] = React109.useState(null), t1;
  if ($3[0] !== tagName19)
    t1 = recursivelySanitizeUnicode(tagName19).trim(), $3[0] = tagName19, $3[1] = t1;
  else
    t1 = $3[1];
  let normalizedTag = t1, t2, t3;
  if ($3[2] !== normalizedTag || $3[3] !== onDone)
    t2 = () => {
      let id = getSessionId();
      if (!id) {
        onDone("No active session to tag", {
          display: "system"
        });
        return;
      }
      if (!normalizedTag) {
        onDone("Tag name cannot be empty", {
          display: "system"
        });
        return;
      }
      setSessionId(id);
      let currentTag = getCurrentSessionTag(id);
      if (currentTag === normalizedTag)
        logEvent("tengu_tag_command_remove_prompt", {}), setShowConfirm(!0);
      else
        logEvent("tengu_tag_command_add", {
          is_replacing: !!currentTag
        }), (async () => {
          let fullPath = getTranscriptPath();
          await saveTag(id, normalizedTag, fullPath), onDone(`Tagged session with ${source_default.cyan(`#${normalizedTag}`)}`, {
            display: "system"
          });
        })();
    }, t3 = [normalizedTag, onDone], $3[2] = normalizedTag, $3[3] = onDone, $3[4] = t2, $3[5] = t3;
  else
    t2 = $3[4], t3 = $3[5];
  if (React109.useEffect(t2, t3), showConfirm && sessionId) {
    let t4;
    if ($3[6] !== normalizedTag || $3[7] !== onDone || $3[8] !== sessionId)
      t4 = async () => {
        logEvent("tengu_tag_command_remove_confirmed", {});
        let fullPath_0 = getTranscriptPath();
        await saveTag(sessionId, "", fullPath_0), onDone(`Removed tag ${source_default.cyan(`#${normalizedTag}`)}`, {
          display: "system"
        });
      }, $3[6] = normalizedTag, $3[7] = onDone, $3[8] = sessionId, $3[9] = t4;
    else
      t4 = $3[9];
    let t5;
    if ($3[10] !== normalizedTag || $3[11] !== onDone)
      t5 = () => {
        logEvent("tengu_tag_command_remove_cancelled", {}), onDone(`Kept tag ${source_default.cyan(`#${normalizedTag}`)}`, {
          display: "system"
        });
      }, $3[10] = normalizedTag, $3[11] = onDone, $3[12] = t5;
    else
      t5 = $3[12];
    let t6;
    if ($3[13] !== normalizedTag || $3[14] !== t4 || $3[15] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ConfirmRemoveTag, {
        tagName: normalizedTag,
        onConfirm: t4,
        onCancel: t5
      }, void 0, !1, void 0, this), $3[13] = normalizedTag, $3[14] = t4, $3[15] = t5, $3[16] = t6;
    else
      t6 = $3[16];
    return t6;
  }
  return null;
}
function ShowHelp(t0) {
  let $3 = import_compiler_runtime274.c(3), {
    onDone
  } = t0, t1, t2;
  if ($3[0] !== onDone)
    t1 = () => {
      onDone(`Usage: /tag <tag-name>

Toggle a searchable tag on the current session.
Run the same command again to remove the tag.
Tags are displayed after the branch name in /resume and can be searched with /.

Examples:
  /tag bugfix        # Add tag
  /tag bugfix        # Remove tag (toggle)
  /tag feature-auth
  /tag wip`, {
        display: "system"
      });
    }, t2 = [onDone], $3[0] = onDone, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  return React109.useEffect(t1, t2), null;
}
async function call61(onDone, _context, args) {
  if (args = args?.trim() || "", COMMON_INFO_ARGS.includes(args) || COMMON_HELP_ARGS.includes(args))
    return /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ShowHelp, {
      onDone
    }, void 0, !1, void 0, this);
  if (!args)
    return /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ShowHelp, {
      onDone
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime353.jsxDEV(ToggleTagAndClose, {
    tagName: args,
    onDone
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime274, React109, jsx_dev_runtime353;
var init_tag = __esm(() => {
  init_source();
  init_state();
  init_select();
  init_Dialog();
  init_xml();
  init_ink2();
  init_sessionStorage();
  import_compiler_runtime274 = __toESM(require_react_compiler_runtime_development(), 1), React109 = __toESM(require_react_development(), 1), jsx_dev_runtime353 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
