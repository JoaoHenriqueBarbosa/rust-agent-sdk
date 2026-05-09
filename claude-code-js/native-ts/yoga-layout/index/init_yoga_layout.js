// var: init_yoga_layout
var init_yoga_layout = __esm(() => {
  init_enums3();
  UNDEFINED_VALUE = { unit: Unit.Undefined, value: NaN }, AUTO_VALUE = { unit: Unit.Auto, value: NaN };
  DEFAULT_CONFIG = createConfig();
  YOGA_INSTANCE = {
    Config: {
      create: createConfig,
      destroy() {}
    },
    Node: {
      create: (config8) => new Node(config8),
      createDefault: () => new Node,
      createWithConfig: (config8) => new Node(config8),
      destroy() {}
    }
  }, yoga_layout_default = YOGA_INSTANCE;
});
