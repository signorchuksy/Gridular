---
description: Run the workspace PROJECT-START protocol for a new or resumed project
---

# Project Start — Workspace Protocol

Execute the 9-step PROJECT-START sequence (`16-loading-bay/01-workspace/PROJECT-START.md`) for the project named below. Work additively; never rewrite existing content.

**Project:** $ARGUMENTS
(If no project name given, ask which project — new or resumed — before proceeding.)

## Steps

### 0. Folder + workspace registration (new standalone projects only)
- Scan `05 Vibe Daddy/` for the highest-numbered `NN-` folder; create the next: `NN+1-<project-name>/` (kebab-case). If the user already created the folder, verify and continue.
- Add the folder to the VS Code workspace (`.code-workspace` file).
- **If invoked from a chat:** first ask whether this is a standalone project. Standalone → do this step. Work inside an existing project → skip to step 1.

### 1. Bridge claim

Use `/bridge` for the claim/release workflow (check → claim → work → release).
Read `04-vibe-chat/bridge/ACTIVE.md`. If the project is claimed by another agent, stop and coordinate via `bridge/00-comms/`. Add your claim row before making changes.

### 1. Session log (plan-first)
Open a chat log in `04-vibe-chat/chats/YYYY/MM/` (next sequential `NNNNN`) stating intent before substantive work.

### 2. Critique (evidence before interpretation)
Ground every claim in evidence. Separate observed / confirmed / inferred / unknown. Record in the chat log.

### 3. Decision log
Numbered rows for contested decisions: decision, status, session, **losing alternative on record**. Open items listed with what they block. Reference: `13-shards/01-pi-1/DECISIONS.md`.

### 4. PRD + plan (proportional)
PRD (what it is, what it refuses to be) + milestone plan with exit criteria. Size per `STANDARD-DOCS.md` types.

**Scope statement (fog of war):** at plan time, state scope three ways — **known** (committed to build), **not yet specified** (open questions, listed with what they block), **out of scope** (explicitly refused). Never leave scope implicit.

Use `/prd` to scaffold the doc set; `/log-decision` for contested decisions.

### 5. Stack decision record
If a stack choice exists: chosen option + rejected alternatives with reasons. Reference: `01-pi-1/TABLES.md`.

### 6. Repo setup (git safety day one)
`git init` + `.gitignore` (include `.env*` patterns) + initial commit + private remote (`gh repo create <name> --private --source . --push`). Then **install ponytail**: `16-loading-bay/02-tools/01-ponytail/install.sh <project-path>`.

### 7. Agent instructions + map
Add `AGENTS.md` stub (what it is, read order, housekeeping, workspace-map + bridge pointers). Add/update the project's row in `16-loading-bay/01-workspace/WORKSPACE-MAP.md`.

### 8. Build notes as you go
Dated build note per non-trivial milestone: what changed, deferred, validated. Write during, not after.

### 9. Bridge release
Release the claim; leave a completion message in `bridge/00-comms/` if the outcome affects others.

## Rules
- Evidence before interpretation; both sides of contested decisions preserved
- Additive-only on existing docs; never rewrite user intent
- No project goes unversioned past its first working session
- Stop for user approval at plan gates (no code before approved plan)
