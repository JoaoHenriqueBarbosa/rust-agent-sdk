// Original: src/utils/exampleCommands.ts
function isCoreFile(path26) {
  return !NON_CORE_PATTERNS.some((p4) => p4.test(path26));
}
function pickDiverseCoreFiles(sortedPaths, want) {
  let picked = [], seenBasenames = /* @__PURE__ */ new Set, dirTally = /* @__PURE__ */ new Map;
  for (let cap = 1;picked.length < want && cap <= want; cap++)
    for (let p4 of sortedPaths) {
      if (picked.length >= want)
        break;
      if (!isCoreFile(p4))
        continue;
      let lastSep = Math.max(p4.lastIndexOf("/"), p4.lastIndexOf("\\")), base2 = lastSep >= 0 ? p4.slice(lastSep + 1) : p4;
      if (!base2 || seenBasenames.has(base2))
        continue;
      let dir = lastSep >= 0 ? p4.slice(0, lastSep) : ".";
      if ((dirTally.get(dir) ?? 0) >= cap)
        continue;
      picked.push(base2), seenBasenames.add(base2), dirTally.set(dir, (dirTally.get(dir) ?? 0) + 1);
    }
  return picked.length >= want ? picked : [];
}
async function getFrequentlyModifiedFiles() {
  if (env3.platform === "win32")
    return [];
  if (!await getIsGit())
    return [];
  try {
    let userEmail = await getGitEmail(), logArgs = [
      "log",
      "-n",
      "1000",
      "--pretty=format:",
      "--name-only",
      "--diff-filter=M"
    ], counts = /* @__PURE__ */ new Map, tallyInto = (stdout) => {
      for (let line of stdout.split(`
`)) {
        let f = line.trim();
        if (f)
          counts.set(f, (counts.get(f) ?? 0) + 1);
      }
    };
    if (userEmail) {
      let { stdout } = await execFileNoThrowWithCwd("git", [...logArgs, `--author=${userEmail}`], { cwd: getCwd() });
      tallyInto(stdout);
    }
    if (counts.size < 10) {
      let { stdout } = await execFileNoThrowWithCwd(gitExe(), logArgs, {
        cwd: getCwd()
      });
      tallyInto(stdout);
    }
    let sorted = Array.from(counts.entries()).sort((a2, b) => b[1] - a2[1]).map(([p4]) => p4);
    return pickDiverseCoreFiles(sorted, 5);
  } catch (err2) {
    return logError2(err2), [];
  }
}
var NON_CORE_PATTERNS, ONE_WEEK_IN_MS = 604800000, getExampleCommandFromCache, refreshExampleCommands;
var init_exampleCommands = __esm(() => {
  init_memoize();
  init_sample();
  init_cwd2();
  init_config4();
  init_env();
  init_execFileNoThrow();
  init_git();
  init_log3();
  init_user();
  NON_CORE_PATTERNS = [
    /(?:^|\/)(?:package-lock\.json|yarn\.lock|bun\.lock|bun\.lockb|pnpm-lock\.yaml|Pipfile\.lock|poetry\.lock|Cargo\.lock|Gemfile\.lock|go\.sum|composer\.lock|uv\.lock)$/,
    /\.generated\./,
    /(?:^|\/)(?:dist|build|out|target|node_modules|\.next|__pycache__)\//,
    /\.(?:min\.js|min\.css|map|pyc|pyo)$/,
    /\.(?:json|ya?ml|toml|xml|ini|cfg|conf|env|lock|txt|md|mdx|rst|csv|log|svg)$/i,
    /(?:^|\/)\.?(?:eslintrc|prettierrc|babelrc|editorconfig|gitignore|gitattributes|dockerignore|npmrc)/,
    /(?:^|\/)(?:tsconfig|jsconfig|biome|vitest\.config|jest\.config|webpack\.config|vite\.config|rollup\.config)\.[a-z]+$/,
    /(?:^|\/)\.(?:github|vscode|idea|claude)\//,
    /(?:^|\/)(?:CHANGELOG|LICENSE|CONTRIBUTING|CODEOWNERS|README)(?:\.[a-z]+)?$/i
  ];
  getExampleCommandFromCache = memoize_default(() => {
    let projectConfig = getCurrentProjectConfig(), frequentFile = projectConfig.exampleFiles?.length ? sample_default(projectConfig.exampleFiles) : "<filepath>", commands7 = [
      "fix lint errors",
      "fix typecheck errors",
      `how does ${frequentFile} work?`,
      `refactor ${frequentFile}`,
      "how do I log an error?",
      `edit ${frequentFile} to...`,
      `write a test for ${frequentFile}`,
      "create a util logging.py that..."
    ];
    return `Try "${sample_default(commands7)}"`;
  }), refreshExampleCommands = memoize_default(async () => {
    let projectConfig = getCurrentProjectConfig(), now2 = Date.now(), lastGenerated = projectConfig.exampleFilesGeneratedAt ?? 0;
    if (now2 - lastGenerated > ONE_WEEK_IN_MS)
      projectConfig.exampleFiles = [];
    if (!projectConfig.exampleFiles?.length)
      getFrequentlyModifiedFiles().then((files3) => {
        if (files3.length)
          saveCurrentProjectConfig((current) => ({
            ...current,
            exampleFiles: files3,
            exampleFilesGeneratedAt: Date.now()
          }));
      });
  });
});
