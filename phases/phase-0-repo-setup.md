# Phase 0 — Repo Setup + Scaffolding

> Gridular · chat 00570 · written 2026-09-13 before execution.
> Parent plan: `../PLAN.md §4`.

## Goal

Turn `17-gridular/` into a versioned, pushed repo with the phase-plan structure
in place, so every later phase has a home and nothing is lost.

## Scope

**In:** git init, `.gitignore`, initial commit, reuse the existing
`signorchuksy/Gridular` remote, `AGENTS.md` stub, `phases/` folder, workspace-map
row, README stub.

**Out:** any application code. No `index.html`, no `grid.js` — those are Phase 1+.

## Steps

1. `git init` in `17-gridular/`; set default branch to `main`.
2. Write `.gitignore` (OS junk, editor files, `.env*`, `node_modules/`).
3. Write `README.md` (what Gridular is, how to open it, phase status).
4. Write `AGENTS.md` (what it is, read order, housekeeping, workspace-map + bridge
   pointers).
5. Create `phases/` and this file.
6. Initial commit.
7. Add the existing remote and push:
   `git remote add origin https://github.com/signorchuksy/Gridular.git`
   `git push -u origin main`
   (The remote currently holds only the stock plugin-template README; the push
   replaces it. Confirm with the user before force-pushing if histories differ.)
8. Add/update the Gridular row in
   `16-loading-bay/01-workspace/WORKSPACE-MAP.md`.

## Checks

- `git status` clean after commit.
- `git log origin/main -1` shows the pushed commit.
- `git check-ignore -v .env` confirms secrets are ignored.
- `phases/phase-0-repo-setup.md` exists.

## Exit criteria

Repo versioned and pushed to the existing Gridular remote; phase plans exist;
workspace map updated. No application code written.

## Results

**Done 2026-09-13.**

- `git init` on `main` (older git — used `git symbolic-ref HEAD refs/heads/main`).
- `.gitignore` written; verified with `git check-ignore -v` that `.env.*` and
  `node_modules/` are ignored.
- `README.md`, `AGENTS.md`, `phases/` (8 phase plans) created.
- Initial commit `1a99f9e` — "chore: scaffold Gridular repo with research, plan,
  and phase plans".
- Remote added: `https://github.com/signorchuksy/Gridular.git`; pushed `main`
  (`git log origin/main -1` → `1a99f9e`).
- Default branch set to `main` via `gh api` (verified: `main`).
- Workspace map row added for `17-gridular`.

**Note:** the remote still carries an unrelated `master` branch (the old
plugin-template README, commit `b399072`). `main` was pushed non-destructively;
`master` was left untouched pending the user's decision to delete it.

**Exit criteria met:** repo versioned and pushed; phase plans exist; workspace map
updated; no application code written.
