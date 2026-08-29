// function: isKmsi
function isKmsi(idTokenClaims) {
  if (!idTokenClaims.signin_state)
    return !1;
  let kmsiClaims = ["kmsi", "dvc_dmjd"];
  return idTokenClaims.signin_state.some((value) => kmsiClaims.includes(value.trim().toLowerCase()));
}
