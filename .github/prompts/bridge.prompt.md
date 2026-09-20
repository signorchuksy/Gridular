---
name: "Bridge"
description: "Inter-agent coordination via the bridge: check claims, claim a branch, merge, release, or read/post comms. Use before touching repos another agent may be in."
argument-hint: "[check | claim-branch <repo> <branch> <scope> | merge <branch> | release <branch> | read | post]"
agent: "agent"
---

Coordinate with other agent sessions through the bridge at `04-vibe-chat/bridge/`.

**Core rule (2026-09-20): a claim is a branch, not a repo. `master`/`main` is read-only
for agents.** One agent = one branch = one worktree. Full protocol:
`04-vibe-chat/bridge/README.md` § Branch claims.

## Mode: check (default when no argument)

1. Read `04-vibe-chat/bridge/ACTIVE.md`
2. Report active claims: agent, repo, branch, scope, since
3. **Staleness rule:** claims older than 48 hours are UNVERIFIED — verify against the repo's actual git state before trusting them
4. Report whether your intended target repo/branch is claimed
5. **Overlap check:** if another claim exists on the same repo, compare Scope file sets. Disjoint → parallel is fine. Overlapping → coordinate or wait.

## Mode: claim-branch <repo> <branch> <scope>

1. Check first (above). If the repo has a claim with an **overlapping scope**, do NOT proceed — post a `00-comms/` message or wait
2. Reserve your chat ID in the row (scan-then-create is not atomic)
3. Add a row to ACTIVE.md: agent, repo, branch, worktree, scope, base, chat, date, status
4. Create the worktree: `git worktree add .worktrees/<branch> -b <branch> origin/master`
5. Work only in the worktree — never in the main tree

**Pre-repo projects:** if the project has no repo, claim the folder instead (`Branch` =
`— (pre-repo)`). The claim converts to a branch claim the moment the repo exists.

## Mode: merge <branch>

The authoring agent merges its own branch (steps 7–10 of the lifecycle):

1. Claim the merge in ACTIVE.md (status `merging`)
2. `git checkout master && git merge --no-ff <branch>`
3. **Run the repo's tests on master** — this step is not optional
4. `git push origin master`
5. Post `00-comms/`: "merged clean, master at `<sha>`, tests N/N"
6. Release the claim; `git worktree remove .worktrees/<branch>`

**On conflict:** post a comms message naming the file and the other agent. Never force-push
a shared branch. Never silently resolve another agent's intent — ask.

## Mode: release <branch>

1. Move your row from active claims to "Released claims" with date + one-line outcome
2. If the outcome affects other agents (commits pushed, repo created, holds resolved), post a dated message in `bridge/00-comms/` linking to the full chat log

## Mode: read

Summarize all messages in `bridge/00-comms/` newest-first: date, agent, one-line summary, and any action items directed at you — flag anything unanswered.

## Mode: post

Write a dated message file (`YYYY-MM-DD-<agent>-<topic>.md`, ≤10 lines) in `00-comms/`: what happened, what it means for other agents, link to the chat log if one exists. Never duplicate conversation content — point to it.

## Rules

- Claim BEFORE work; release AFTER. No exceptions.
- **Never commit to `master`/`main` directly** — branch first, always
- **One agent = one branch = one worktree** — never two agents in one working tree
- **Never migrate a repo with a dirty tree** — commit or stash first
- Never delete other agents' claims or messages
- Conversation logs stay in `chats/` — the bridge is operational signals only
- **Anti-pattern — stale trust:** acting on a 48h+ old claim without verifying git state
- **Anti-pattern — racing a chat ID:** reserve the number in the claim row
