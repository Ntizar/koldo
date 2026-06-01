---
name: git-repo-recovery
version: "1.0.0"
description: Recover a git repo when the remote was replaced with a minimal version while local has full history. Covers diagnosis, safe backup, reset, and force-push restoration.
tags: [github, git, recovery, backup]

---

# Git Repo Recovery — Remote Overwritten, Local Has Full History

When a git remote is replaced with a minimal subset (e.g., single-commit repo) while local has full history with multiple commits, standard `git pull --rebase` or `git push` will fail with massive conflicts or rejection.

## Diagnosis

1. Check remote state: `git fetch origin && git log --oneline origin/main -5`
2. Check local state: `git log --oneline main -5`
3. Compare: if local has more commits or a longer history, the remote was likely replaced/overwritten.
4. Check reflog for clues: `git reflog --all -15`

## Recovery Procedure

### Step 1: Backup local state
```bash
cp -r /path/to/repo /tmp/repo-backup
```

### Step 2: Reset local to match remote (clean slate)
```bash
cd /path/to/repo
git reset --hard origin/main
```

### Step 3: Restore from backup
```bash
rm -rf /path/to/repo
cp -r /tmp/repo-backup /path/to/repo
cd /path/to/repo
```

### Step 4: Force push to restore full history
```bash
git push origin main --force
```

### Step 5: Verify
```bash
git log --oneline -5
git status
```

## Pitfalls

- **Always backup first** — force push is destructive and irreversible without the backup
- **Don't use `git pull --rebase`** when remote was replaced — it will create massive conflicts across all files
- **Don't use `git merge`** either — same conflict problem when histories diverge completely
- **Verify the remote was actually replaced** — check if someone else pushed, or if a CI/CD pipeline reset it
- **After recovery, communicate with the team** — others may have divergent work that needs reconciliation

## When NOT to force push

- If other collaborators have work on the same branch — coordinate first
- If the remote has legitimate commits your local doesn't have — merge them in first
- If you're not sure why the remote was replaced — investigate before overwriting
