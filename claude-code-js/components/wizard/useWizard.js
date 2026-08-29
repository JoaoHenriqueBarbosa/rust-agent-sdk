// Original: src/components/wizard/useWizard.ts
function useWizard() {
  let context7 = import_react179.useContext(WizardContext);
  if (!context7)
    throw Error("useWizard must be used within a WizardProvider");
  return context7;
}
var import_react179;
var init_useWizard = __esm(() => {
  init_WizardProvider();
  import_react179 = __toESM(require_react_development(), 1);
});
