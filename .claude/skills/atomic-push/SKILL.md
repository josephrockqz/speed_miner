---
name: atomic-push
description: Stage, commit, and push local changes atomically. Trigger with "commit and push", "push my changes", "atomic commit", or "ship it".
user_invocable: true
---

# Atomic Push

Stage local changes, create a single atomic commit, and push to the remote branch.

## Workflow

### 1. Inspect current state

Run these commands in parallel to understand the working tree:

- `git status` (never use `-uall`)
- `git diff` (unstaged changes)
- `git diff --staged` (already staged changes)
- `git log --oneline -5` (recent commit style)
- `git branch --show-current` (current branch name)

If there are no changes (no untracked files, no modifications, no staged changes), stop and inform the user there is nothing to commit.

### 2. Stage changes

- Add changed/new files **by name** — NEVER use `git add -A` or `git add .`
- **Warn and exclude** any files that look like secrets or large binaries:
  - `.env`, `.env.*`, `credentials.json`, `*.pem`, `*.key`, `*.p12`
  - Files larger than 5 MB
- If unsure whether a file should be included, ask the user

### 3. Draft commit message

- Review all staged changes (both previously staged and newly added)
- Write a concise 1-2 sentence commit message following the style of recent commits in the repo
- Use imperative mood (e.g. "Add feature" not "Added feature")
- Focus on **why**, not just **what**

### 4. Confirm with the user

Before committing, show the user:
- The list of files being committed
- The drafted commit message
- Ask for confirmation or edits

### 5. Commit

Create a single atomic commit using a HEREDOC:

```
git commit -m "$(cat <<'EOF'
<commit message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Run `git status` after committing to verify success.

### 6. Determine remote branch and push

- Check if an upstream tracking branch exists: `git rev-parse --abbrev-ref @{u}`
- If tracking exists: `git push`
- If no tracking branch: `git push -u origin <current-branch>`
- Always confirm with the user before pushing
- After pushing, show the result to confirm success

## Safety Rules

- **Never** force push (`--force`, `-f`)
- **Never** skip hooks (`--no-verify`)
- **Never** amend a previous commit unless the user explicitly asks
- **Never** push to `main` or `master` without explicit user confirmation and a warning
- If a pre-commit hook fails, fix the issue and create a **new** commit (do not amend)
