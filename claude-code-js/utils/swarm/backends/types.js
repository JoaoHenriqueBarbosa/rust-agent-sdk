// Original: src/utils/swarm/backends/types.ts
function isPaneBackend(type) {
  return type === "tmux" || type === "iterm2";
}
