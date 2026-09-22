---
name: "Task Loop"
description: "Keep a request on task in an existing repo: check the repo, claim, pick the home, size it, place it in a phase, write the story, build, close. Use when a request lands in a repo during active development."
argument-hint: "[what was asked for]"
agent: "agent"
---

Run the seven gates for a request against an existing repo. **Report the gates and the next
step — do not execute the whole lifecycle in one response.**

The loop exists to stop drift. Its value is in the gates that say **"no, don't do that"** —
state what you are ruling out, not just what to do next.

## Gate 1 — REPO

Is there a git repo?

- **No repo** → stop. This loop is repo-only. Use the pre-repo path claim
  (`16-loading-bay/00-works/09-branch-claims/`).
- **Repo** → continue.

## Gate 2 — CLAIM

Read `04-vibe-chat/bridge/ACTIVE.md`.

- Another agent holds a branch with an **overlapping scope** → stop; coordinate via
  `00-comms/` or wait.
- **Disjoint scope** → proceed, but claim a branch (`/bridge claim-branch`).

## Gate 3 — HOME

Where does the work live? **The default is: never `master`/`main`.**

| Situation | Home |
| --------- | ---- |
| A worktree exists for related work | **Add to it** — same branch, same scope |
| A branch exists but no worktree | Create the worktree for it |
| Nothing in flight | New branch + worktree |

**Prerequisite check:** is `.worktrees/` in `.gitignore`?

- **No** → the repo has not migrated. Migrating is the first step
  (`16-loading-bay/00-works/09-branch-claims/plans/phase-4-migration.md`). Report this as a
  blocker, not a footnote.
- **Yes** → proceed.

**Rule out explicitly:** working on `main`; creating a second branch when a worktree already
covers the same files.

## Gate 4 — SIZE

Trivial, small, or non-trivial?

| Size | Signal | Response |
| ---- | ------ | -------- |
| **Trivial** | One file, one intent, no design choice | Just do it; no story file |
| **Small** | A few files, clear approach | Story file, no separate plan |
| **Non-trivial** | Design choice, multiple files, unclear scope | Story file + plan |

**Refusal condition:** if you cannot tell which size it is, that is the signal — ask the user
one question rather than guessing.

## Gate 5 — PHASE

**Every story belongs to a phase, and phases are numbered.** There is one standard way to
track work: `project-info/plans/NN-<phase>/`.

Read `project-info/plans/`.

- **No `project-info/`** → the repo predates the standard. **Report it as a finding** —
  migrating is the first step. Do **not** fall back to a root-level `PLAN.md`.
- **`project-info/plans/` exists but is not numbered** (date-prefixed files, a single
  `now-next-later.md`, loose `.md` files) → **report it as a finding.** The repo needs to
  adopt numbered phases before a story has a predictable home. Do not invent a parallel
  convention.
- **A numbered phase is in progress** → does the request fit its scope?
  - **Fits** → add it as a story in that phase
  - **Adjacent, out of scope** → note it as a follow-up in the phase file; do not silently
    expand the phase
  - **Unrelated** → it opens its own numbered phase
- **No phase in progress** → the request opens `NN-<phase>/`

**Rule out explicitly:** opening a parallel track for work that belongs to an existing phase;
inventing a non-numbered plan shape because the repo already has one.

## Gate 5a — STORY

Write the story file — this is the track.

```
project-info/plans/<phase>/stories/STORY-NNN-<slug>.md
```

```markdown
# STORY-NNN — <title>

**PI:** <phase> · **Type:** <design | build | docs> · **Status:** not started
**Plan:** [STORY-NNN-plan.md](../STORY-NNN-plan.md)   <!-- only if non-trivial -->

## Story
> As a <who>, I want <what>, so <why>.

## Acceptance criteria
- [ ] <falsifiable criterion>

## Design notes
**Decided <date>** — <the choice, and what was rejected>
```

**The acceptance criteria are the anti-drift mechanism.** They bound the request so it cannot
quietly grow. Write them before building, not after.

**Trivial work skips the story file** — but then it is a phase item, not a story.

## Gate 6 — BUILD

- Implement the **smallest slice** that satisfies the acceptance criteria
- Verify with the **narrowest check that would fail if the change were wrong** — a test, a
  build, a browser measurement, or an explicit "no runnable check exists"
- **Do not widen scope.** Unrelated fixes found along the way become follow-ups, not
  passengers on this commit

## Gate 7 — CLOSE

- **Story file** — tick the acceptance criteria; update `Status`
- **Build note** — only if non-trivial (`/write-build-note`)
- **Commit** — single intent, staged by path (`/prepare-commit`)
- **Release the claim** (`/bridge release`)
- **Housekeeping** — update the phase file; the PRD if behavior changed; the workspace map if
  the project's state changed

## Output format

Report each gate as a line, then the next step:

```
1. REPO    ✓ 12-garden-neue-fuma
2. CLAIM   ✓ disjoint from the fuma agent's pivot scope
3. HOME    ✗ BLOCKED — .worktrees/ not ignored; migrate first
4. SIZE    small — story file, no separate plan
5. PHASE   ✗ BLOCKED — no project-info/; migrate first
5a. STORY  → project-info/plans/07-portfolio-pivot/stories/STORY-NNN-font-change.md
6. BUILD   pending gates 3 and 5
7. CLOSE   pending

Next: migrate the repo (rung 2 → rung 1, add project-info/), then re-run.
```

## Rules

- **Report, don't execute.** Name the next step; let the user or the next command do it.
- **State what you are ruling out.** The negative answers are the loop's value.
- **Never work on `master`/`main`** — the only exception is the migration commit.
- **Never skip Gate 5.** A request that quietly joins a phase is scope creep; a request
  *recorded* as joining a phase is a decision.
- **Anti-pattern — degrading to root `PLAN.md`:** a missing `project-info/` is a migration
  finding, not a fallback.
- **Anti-pattern — inventing a plan shape:** phases are numbered (`NN-<phase>/`). A repo with
  date-prefixed plans or a `now-next-later.md` needs to adopt the standard, not be
  accommodated.
- **Anti-pattern — building before the criteria exist:** write the acceptance criteria first,
  or the work has no bound.
- **Anti-pattern — widening scope:** unrelated fixes become follow-ups, never passengers.