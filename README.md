# Dentavanta website

Not started yet. This will be the public marketing site — separate from the actual product (`dentavanta-platform-frontend`) and the internal tools, on purpose. Whoever works on marketing pages shouldn't need any access to patient-data-adjacent code.

## One-time setup after cloning

```bash
git config core.hooksPath .githooks
```

This enables the pre-commit hook that scans for accidentally-committed secrets (gitleaks). Once this repo has real code (`package.json`), it should also get husky + the hidden-obfuscated-code scanner used in `dentavanta-backoffice`/`dentavanta-platform-backend` — see those repos' `scripts/security-scan.mjs` for the pattern.
