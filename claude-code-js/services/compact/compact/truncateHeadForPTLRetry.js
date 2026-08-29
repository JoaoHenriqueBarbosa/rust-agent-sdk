// function: truncateHeadForPTLRetry
function truncateHeadForPTLRetry(messages, ptlResponse) {
  let input = messages[0]?.type === "user" && messages[0].isMeta && messages[0].message.content === PTL_RETRY_MARKER ? messages.slice(1) : messages, groups = groupMessagesByApiRound(input);
  if (groups.length < 2)
    return null;
  let tokenGap = getPromptTooLongTokenGap(ptlResponse), dropCount;
  if (tokenGap !== void 0) {
    let acc = 0;
    dropCount = 0;
    for (let g of groups)
      if (acc += roughTokenCountEstimationForMessages(g), dropCount++, acc >= tokenGap)
        break;
  } else
    dropCount = Math.max(1, Math.floor(groups.length * 0.2));
  if (dropCount = Math.min(dropCount, groups.length - 1), dropCount < 1)
    return null;
  let sliced = groups.slice(dropCount).flat();
  if (sliced[0]?.type === "assistant")
    return [
      createUserMessage({ content: PTL_RETRY_MARKER, isMeta: !0 }),
      ...sliced
    ];
  return sliced;
}
