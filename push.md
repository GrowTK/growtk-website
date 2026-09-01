# Pushing to this repo

Repo: https://github.com/GrowTK/growtk-website (public, default branch `main`)

## What was done to set this up

1. Read the GitHub token from `.env` (`GITHUB_TOKEN`, gitignored, never committed).
2. Verified the token's identity before using it: `gh api user` confirmed it
   authenticates as the `GrowTK` account.
3. Created the repo: `gh repo create growtk-website --public`.
4. Pointed the local `origin` remote at it (it previously pointed at the old
   template's `dentavanta/dentavanta-website`, which this repo has no access
   to and no relation to anymore):
   ```
   git remote set-url origin https://github.com/GrowTK/growtk-website.git
   ```
5. Committed with the `growtk` / `growtk.co@gmail.com` identity for this
   commit only, without changing global or repo git config:
   ```
   git -c user.name="growtk" -c user.email="growtk.co@gmail.com" commit -m "..."
   ```
6. Pushed using the token for one-off auth (also without persisting any
   credential helper or config):
   ```
   git -c credential.helper= \
       -c credential.https://github.com.helper="!f() { echo username=x-access-token; echo password=$GH_TOKEN; }; f" \
       push -u origin main
   ```

## To push again later

Normal git from here on, now that `origin` and the upstream branch are set:

```bash
git add -A
git commit -m "..."
git push
```

If push ever fails with a 401/403, the saved credential helper isn't
persisted (by design), so re-export the token first:

```bash
export GH_TOKEN=$(grep GITHUB_TOKEN .env | cut -d= -f2)
git -c credential.helper= \
    -c credential.https://github.com.helper="!f() { echo username=x-access-token; echo password=$GH_TOKEN; }; f" \
    push
```

Or, simpler for day-to-day use: run `gh auth login` once interactively (or
`echo $GH_TOKEN | gh auth login --with-token`) so `gh` and `git` share a
persisted credential, then plain `git push` works without the `-c` flags.

## Notes

- `.env` holds `GITHUB_TOKEN` and is gitignored (`.env*` in `.gitignore`).
  Never commit it. Rotate the token if it's ever exposed.
- The repo is **public**. Flip to private if that changes:
  `gh repo edit GrowTK/growtk-website --visibility private --accept-visibility-change-consequences`.
- Domain in `brand.config.ts` is `growtk.com` (placeholder). Update it once
  the real domain is live, then `npm run brand` to resync.
