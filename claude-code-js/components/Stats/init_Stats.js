// var: init_Stats
var init_Stats = __esm(() => {
  init_source();
  init_figures();
  init_strip_ansi();
  init_useTerminalSize();
  init_colorize();
  init_stringWidth();
  init_ink2();
  init_useKeybinding();
  init_config4();
  init_format();
  init_heatmap();
  init_model();
  init_screenshotClipboard();
  init_stats();
  init_theme();
  init_Pane();
  init_Tabs();
  init_Spinner2();
  import_compiler_runtime278 = __toESM(require_react_compiler_runtime_development(), 1), import_asciichart = __toESM(require_asciichart(), 1), import_react192 = __toESM(require_react_development(), 1), jsx_dev_runtime359 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  DATE_RANGE_LABELS = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    all: "All time"
  }, DATE_RANGE_ORDER = ["all", "7d", "30d"];
  BOOK_COMPARISONS = [{
    name: "The Little Prince",
    tokens: 22000
  }, {
    name: "The Old Man and the Sea",
    tokens: 35000
  }, {
    name: "A Christmas Carol",
    tokens: 37000
  }, {
    name: "Animal Farm",
    tokens: 39000
  }, {
    name: "Fahrenheit 451",
    tokens: 60000
  }, {
    name: "The Great Gatsby",
    tokens: 62000
  }, {
    name: "Slaughterhouse-Five",
    tokens: 64000
  }, {
    name: "Brave New World",
    tokens: 83000
  }, {
    name: "The Catcher in the Rye",
    tokens: 95000
  }, {
    name: "Harry Potter and the Philosopher's Stone",
    tokens: 103000
  }, {
    name: "The Hobbit",
    tokens: 123000
  }, {
    name: "1984",
    tokens: 123000
  }, {
    name: "To Kill a Mockingbird",
    tokens: 130000
  }, {
    name: "Pride and Prejudice",
    tokens: 156000
  }, {
    name: "Dune",
    tokens: 244000
  }, {
    name: "Moby-Dick",
    tokens: 268000
  }, {
    name: "Crime and Punishment",
    tokens: 274000
  }, {
    name: "A Game of Thrones",
    tokens: 381000
  }, {
    name: "Anna Karenina",
    tokens: 468000
  }, {
    name: "Don Quixote",
    tokens: 520000
  }, {
    name: "The Lord of the Rings",
    tokens: 576000
  }, {
    name: "The Count of Monte Cristo",
    tokens: 603000
  }, {
    name: "Les Mis\xE9rables",
    tokens: 689000
  }, {
    name: "War and Peace",
    tokens: 730000
  }], TIME_COMPARISONS = [{
    name: "a TED talk",
    minutes: 18
  }, {
    name: "an episode of The Office",
    minutes: 22
  }, {
    name: "listening to Abbey Road",
    minutes: 47
  }, {
    name: "a yoga class",
    minutes: 60
  }, {
    name: "a World Cup soccer match",
    minutes: 90
  }, {
    name: "a half marathon (average time)",
    minutes: 120
  }, {
    name: "the movie Inception",
    minutes: 148
  }, {
    name: "watching Titanic",
    minutes: 195
  }, {
    name: "a transatlantic flight",
    minutes: 420
  }, {
    name: "a full night of sleep",
    minutes: 480
  }];
});
