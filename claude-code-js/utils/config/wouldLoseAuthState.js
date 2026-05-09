// function: wouldLoseAuthState
function wouldLoseAuthState(fresh) {
  let cached2 = globalConfigCache.config;
  if (!cached2)
    return !1;
  let lostOauth = cached2.oauthAccount !== void 0 && fresh.oauthAccount === void 0, lostOnboarding = cached2.hasCompletedOnboarding === !0 && fresh.hasCompletedOnboarding !== !0;
  return lostOauth || lostOnboarding;
}
