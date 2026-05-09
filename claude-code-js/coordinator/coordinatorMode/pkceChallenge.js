// function: pkceChallenge
async function pkceChallenge(length) {
  if (!length)
    length = 43;
  if (length < 43 || length > 128)
    throw `Expected a length between 43 and 128. Received ${length}.`;
  let verifier = await generateVerifier(length), challenge = await generateChallenge(verifier);
  return {
    code_verifier: verifier,
    code_challenge: challenge
  };
}
