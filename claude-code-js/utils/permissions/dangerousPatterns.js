// Original: src/utils/permissions/dangerousPatterns.ts
var CROSS_PLATFORM_CODE_EXEC, DANGEROUS_BASH_PATTERNS;
var init_dangerousPatterns = __esm(() => {
  CROSS_PLATFORM_CODE_EXEC = [
    "python",
    "python3",
    "python2",
    "node",
    "deno",
    "tsx",
    "ruby",
    "perl",
    "php",
    "lua",
    "npx",
    "bunx",
    "npm run",
    "yarn run",
    "pnpm run",
    "bun run",
    "bash",
    "sh",
    "ssh"
  ], DANGEROUS_BASH_PATTERNS = [
    ...CROSS_PLATFORM_CODE_EXEC,
    "zsh",
    "fish",
    "eval",
    "exec",
    "env",
    "xargs",
    "sudo"
  ];
});
