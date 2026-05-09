// Original: src/utils/yaml.ts
function parseYaml(input) {
  if (typeof Bun < "u")
    return Bun.YAML.parse(input);
  return require_dist6().parse(input);
}
