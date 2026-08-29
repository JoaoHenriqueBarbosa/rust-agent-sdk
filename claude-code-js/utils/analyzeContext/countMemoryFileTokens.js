// function: countMemoryFileTokens
async function countMemoryFileTokens() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return { memoryFileDetails: [], claudeMdTokens: 0 };
  let memoryFilesData = filterInjectedMemoryFiles(await getMemoryFiles()), memoryFileDetails = [], claudeMdTokens = 0;
  if (memoryFilesData.length < 1)
    return {
      memoryFileDetails: [],
      claudeMdTokens: 0
    };
  let claudeMdTokenCounts = await Promise.all(memoryFilesData.map(async (file2) => {
    let tokens = await countTokensWithFallback([{ role: "user", content: file2.content }], []);
    return { file: file2, tokens: tokens || 0 };
  }));
  for (let { file: file2, tokens } of claudeMdTokenCounts)
    claudeMdTokens += tokens, memoryFileDetails.push({
      path: file2.path,
      type: file2.type,
      tokens
    });
  return { claudeMdTokens, memoryFileDetails };
}
