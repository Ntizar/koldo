---
name: github-knowledge-repo
description: "Manage a personal GitHub repo as an agent's persistent knowledge base — sync notes, skills, memory, config, and scripts between the local filesystem and version control."
version: 1.0.0
author: Hermes Agent
tags: [github, knowledge-repo, notes, backup]

---

# GitHub Knowledge Repo

Use this skill when the user has a personal GitHub repository that serves as their agent's persistent knowledge base — storing notes, skills, memory backups, configuration, and automation scripts.

## When to use

- User references a personal repo used for agent knowledge (notes, skills, memory backup)
- User wants to sync local knowledge to/from a GitHub repo
- User wants to backup memory, skills, or session notes to version control
- User wants to restore knowledge from a repo after a reset

## Standard repo structure

Most knowledge repos follow this pattern:

```
Repo/
├── README.md              ← System documentation
├── koldo/ or skills/      ← Personal SKILL.md files
├── notes/                 ← Session notes (YYYY-MM-DD-title.md)
│   └── proyectos/         ← Active project tracking
├── memory/                ← Memory backups
├── config/                ← Configuration files
├── scripts/               ← Automation scripts
└── .deploy/               ← Deployment configs (optional)
```

## Setup checklist

1. **Clone the repo** into the user's workspace (e.g., `/root/workspace/<repo-name>`)
2. **Verify GitHub auth** — check `gh auth status` or token in `/hermes-home/.env`
3. **Install skills** — copy personal skill files to `/hermes-home/skills/<name>/`
4. **Configure external_dirs** — add repo path to `config.yaml` under `skills.external_dirs`
5. **Set up cron sync** — schedule regular git pull to keep repo in sync
6. **Create SOUL.md** — define agent identity, rules, and behavior

## Sync workflow

### Push (local → remote)
```bash
cd /root/workspace/<repo-name>
git add -A
git commit -m "description of changes"
git push origin main
```

### Pull (remote → local)
```bash
cd /root/workspace/<repo-name>
git pull origin main
```

### Auto-sync via cron
- Schedule: `0 9 * * *` (daily at 09:00 UTC)
- Action: git pull + copy skills + verify auth
- See `scripts/koldo-autoconfig.sh` for a reference implementation

## Rules

1. **Never delete files from the repo** — only create new files or modify files you created
2. **Date-stamp notes** — use `YYYY-MM-DD-title.md` format in `notes/`
3. **Active projects** go in `notes/proyectos/`
4. **Skills** go in `koldo/` (or equivalent) directory
5. **Scripts** go in `scripts/`
6. **After complex tasks** (5+ tool calls), ask: does this deserve a skill, a note, or memory?

## Skill File Structure

Each skill file in the knowledge base follows a consistent format:
```
skills/{category}/{repo-name}.md
```

Categories: `ia`, `herramientas`, `audio`, `data`, `frontend`, `gis`, `devops`

See `references/github-api-exploration-patterns.md` for the API patterns used during exploration.
See `references/github-api-helpers.md` for reliable helper functions: token discovery, curl-based API wrapper, starred repo fetching, repo categorization heuristics, and file structure conventions.
See `references/session-7-repo-learnings.md` for condensed knowledge from explored repos: markitdown, mlx-vlm, nango, postgres-mcp, gaze-tracking.
See `references/autonomous-learning-session.md` for cron-driven autonomous learning session patterns: parent-only API calls, subagent delegation templates, anti-patterns, and push strategy.

## Autonomous Learning Workflow

When tasked with exploring GitHub repos (starred repos, trending repos, user-curated lists) and extracting knowledge for the knowledge base:

### Phase 1: Planning
1. Fetch the full list of repos to explore (GitHub API: `GET /users/{user}/starred?per_page=100&sort=updated`)
2. Create/update `learning-plan.md` with repos grouped by category (IA, backend, frontend, DevOps, etc.)
3. Prioritize repos by relevance and star count
4. Create `INDEX.md` if it doesn't exist

### Phase 2: Parallel Exploration (30-min sessions)
1. Select 3-5 high-priority repos per session
2. Use the GitHub API to fetch READMEs and key source files:
   - `GET /repos/{owner}/{repo}/readme` → base64 decode for content
   - `GET /repos/{owner}/{repo}/contents/{path}` → fetch specific files
   - `GET /repos/{owner}/{repo}/git/trees/main?recursive=1` → list repo structure
3. Extract: purpose, architecture, key patterns, reusable snippets, integration instructions
4. Write structured skill files to `skills/{category}/{repo-name}.md`

### Phase 3: Skill File Format
Each skill file MUST follow this template:
```
# {Repo Name}

- **URL:** https://github.com/{owner}/{repo}
- **Categoría:** {Category}
- **¿Qué hace?:** {detailed description}
- **Casos de uso:** {list of practical use cases}
- **Snippets útiles:** {copy-paste ready code examples}
- **Cómo integrarlo en proyectos:** {step-by-step integration guide}
- **Fecha de aprendizaje:** {YYYY-MM-DD}
- **Stars:** {star count}
- **Licencia:** {license}
```

### Phase 4: Commit & Push (GitHub REST API — Blobs → Tree → Commit → Ref)

When `gh` CLI is unavailable or unreliable, use the GitHub REST API to push files:

```python
import subprocess, json, base64

# 1. Get token
with open('/hermes-home/.env') as f:
    token = [l.split('=',1)[1].strip() for l in f if l.startswith('GITHUB_TOKEN=')][0]

# 2. Get current branch SHA
resp = subprocess.run(['curl', '-s', '-H', f'Authorization: token {token}',
    'https://api.github.com/repos/Ntizar/koldo/branches/main'],
    capture_output=True, text=True)
base_sha = json.loads(resp.stdout)['commit']['sha']

# 3. Create blobs for each file
tree_entries = []
for rel_path, local_path in files_to_push.items():
    with open(local_path, 'rb') as f:
        content = f.read()
    blob = json.loads(subprocess.run(['curl', '-s', '-X', 'POST',
        '-H', f'Authorization: token {token}',
        '-H', 'Accept: application/vnd.github.v3+json',
        '-d', json.dumps({'content': content.decode(), 'encoding': 'utf-8'}),
        'https://api.github.com/repos/Ntizar/koldo/git/blobs'],
        capture_output=True, text=True).stdout)
    tree_entries.append({'path': rel_path, 'mode': '100644', 'type': 'blob', 'sha': blob['sha']})

# 4. Create tree
tree = json.loads(subprocess.run(['curl', '-s', '-X', 'POST',
    '-H', f'Authorization: token {token}',
    '-H', 'Accept: application/vnd.github.v3+json',
    '-d', json.dumps({'base_tree': base_sha, 'tree': tree_entries}),
    'https://api.github.com/repos/Ntizar/koldo/git/trees'],
    capture_output=True, text=True).stdout)

# 5. Create commit
commit = json.loads(subprocess.run(['curl', '-s', '-X', 'POST',
    '-H', f'Authorization: token {token}',
    '-H', 'Accept: application/vnd.github.v3+json',
    '-d', json.dumps({'message': 'msg', 'tree': tree['sha'], 'parents': [base_sha]}),
    'https://api.github.com/repos/Ntizar/koldo/git/commits'],
    capture_output=True, text=True).stdout)

# 6. Update branch ref — CRITICAL: use FULL 40-char SHA, not truncated
ref = json.loads(subprocess.run(['curl', '-s', '-X', 'PATCH',
    '-H', f'Authorization: token {token}',
    '-H', 'Accept: application/vnd.github.v3+json',
    '-d', json.dumps({'sha': commit['sha']}),  # <-- MUST be full 40 chars!
    'https://api.github.com/repos/Ntizar/koldo/git/refs/heads/main'],
    capture_output=True, text=True).stdout)
```

### Phase 5: Update INDEX.md (curl PUT pattern)

Python's `urllib.request` can return 404 on PUT to `/contents/`. Use `curl` via `subprocess` instead:

```python
# Get current SHA
data = json.loads(subprocess.run(['curl', '-s', '-H', f'Authorization: token {token}',
    'https://api.github.com/repos/Ntizar/koldo/contents/INDEX.md'],
    capture_output=True, text=True).stdout)
sha = data['sha']
content = base64.b64decode(data['content']).decode()

# Modify content...
content = content.replace('old', 'new')

# PUT back
payload = json.dumps({'message': 'msg', 'content': base64.b64encode(content.encode()).decode(), 'sha': sha})
result = subprocess.run(['curl', '-s', '-X', 'PUT', '-H', f'Authorization: token {token}',
    '-H', 'Accept: application/vnd.github.v3+json', '-H', 'Content-Type: application/json',
    'https://api.github.com/repos/Ntizar/koldo/contents/INDEX.md', '-d', payload],
    capture_output=True, text=True)
```

### Pitfalls
- **Subagents timeout on GitHub API** — 3+ subagents hitting the GitHub API in parallel reliably hit the 600s timeout (slow API responses, rate limiting). The parent agent MUST handle all GitHub API calls directly via `execute_code` with inline `subprocess.run()`. Subagents should ONLY write files locally (never make API calls). For parallel exploration: parent fetches READMEs via API, writes skill files locally, then pushes.
- **Rate limiting**: GitHub API allows 60 req/hour unauthenticated, 5000/hour with token. Use token from `.env` or `/root/.git-credentials`
- **Large repos**: Don't clone — use the API to fetch only README + key files
- **Branch detection**: Always use `git/trees/{default_branch}` — check `repo.default_branch` first
- **Base64 encoding**: GitHub API returns base64-encoded content — always decode with `base64.b64decode()`
- **SHA truncation in commit objects**: The `commit['sha']` from the API response is the full 40-char SHA. Do NOT use `[:12]` when passing to the ref update — GitHub requires the full SHA or returns HTTP 422 "At least 40 characters are required"
- **Python urllib 404 on PUT**: `urllib.request.urlopen()` can return 404 for PUT requests to `/contents/` even when the file exists. Use `curl` via `subprocess.run()` instead for PUT operations
- **Parallel subagent coordination**: When delegating to subagents for parallel repo exploration, each subagent writes to `/root/skills/{category}/`. The parent agent must collect these files and push them in a single batch to avoid race conditions on the branch ref.
- **Empty repo creation**: If the repo doesn't exist, the `PUT /contents/` API returns 422 "sha wasn't supplied" because there's no base tree. Use `git clone` + local commit + push instead.
- **Pre-existing repo content**: The knowledge repo may already have skills from previous sessions. Always check what exists before creating duplicates. Merge with existing content rather than overwriting.
- **Token sources**: Token may be in `/hermes-home/.env` (GITHUB_TOKEN=) or `/root/.git-credentials` (https://user:token@github.com). Check both.

## Pitfalls

- **Token expiry**: GitHub tokens can expire. Verify auth periodically with `curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user`
- **gh not installed**: Many setups don't have `gh` CLI. Fall back to `git` + `curl` with token from `.env`
- **Private repos**: The GitHub public API can't see private repos. Use the token directly for API calls
- **external_dirs not reloading**: After adding new skill files to the repo, Hermes may need a restart or config reload to pick them up from `external_dirs`
- **Duplicate local clones**: Always verify only ONE local clone exists in the workspace before working. If you find two (e.g., `Koldo/` and `koldo-learning/`), compare them — if identical, delete the extra one. If different, migrate content to the one connected to GitHub and delete the orphan. Never work on both simultaneously.

## Related

- `github-auth` — GitHub authentication setup
- `github-repo-management` — Clone, create, fork repos
- `hermes-agent` — Configuring Hermes Agent itself