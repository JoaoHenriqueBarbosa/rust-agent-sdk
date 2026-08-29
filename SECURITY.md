# Security Policy

## Supported Versions

This project is at an early stage (`0.x`). Security fixes are applied to the latest
released version on the `main` branch only. There are no long-term support branches yet.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Report privately by email to **joaohenriquebarbosa21@gmail.com**. Include:

- a description of the issue and its impact,
- steps or a proof of concept to reproduce it,
- affected version(s) and environment (OS, Rust toolchain, `claude` CLI version).

You can expect an initial acknowledgement within **72 hours**.

## Process

1. **Acknowledge** — we confirm receipt and start triage within 72 hours.
2. **Assess** — we reproduce the issue and determine severity and scope.
3. **Fix** — we develop and test a fix on a private branch.
4. **Release** — we publish a patched version and, where relevant, a `RUSTSEC`-style advisory.
5. **Disclose** — we credit the reporter (unless anonymity is requested) once a fix is available.

## Scope

The kinds of issues that are in scope for this policy include:

- Memory-safety or unsafe-block soundness issues
- Panics reachable from untrusted input
- Dependency vulnerabilities

Because this crate spawns and communicates with the external `claude` CLI over a
stream-json protocol, also consider in scope any issue where **untrusted transport
input** (data read back from the subprocess) can lead to unsound behavior, resource
exhaustion, or a panic in the parsing layer.

Out of scope: vulnerabilities in the `claude` CLI itself (report those to Anthropic),
and issues that require an already-compromised local environment (e.g. a malicious
`claude` binary the user themselves installed on `PATH`).
