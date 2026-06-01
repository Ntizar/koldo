# Autonomous Learning Session Patterns

## Session Architecture (Cron-Driven)

When running as a scheduled cron job for autonomous repo exploration:

### Reliable Pattern (Parent-Only API)
1. **Parent fetches** all starred repos via `execute_code` + `subprocess.run(curl)`
2. **Parent categorizes** repos by keyword matching on name + description
3. **Parent creates** learning-plan.md and INDEX.md
4. **Parent delegates** subagents with GOAL only (no API calls) — subagents write skill files locally to `/root/skills/{category}/`
5. **Parent collects** skill files from `/root/skills/`
6. **Parent pushes** everything to the knowledge repo via `git clone` + commit + push

### Anti-Pattern (Avoid)
- Delegating GitHub API calls to subagents — 60%+ timeout rate
- Using `curl | python3` pipes — security scanner blocks them
- Using `urllib.request` for PUT — returns 404 even when file exists
- Creating files via `PUT /contents/` on empty repos — returns 422 "sha wasn't supplied"

### Subagent Delegation Template
```
Task: "Explore repo {owner}/{repo} and write skill file to /root/skills/{category}/{name}.md"
Context: "Token from /root/.git-credentials. ONLY read README.md and pyproject.toml. Do NOT read all source files."
Toolsets: ["terminal"]
```

Key: Keep subagent tasks SHORT and focused. Read only 1-2 files max. Don't enumerate full repo structure.

## Skill File Naming Convention
```
skills/{category}/{repo-slug}.md
```
Categories: `herramientas-dev`, `mcp-integraciones`, `audio-voz`, `vision-modelos`, `agentes`, `datos-transit`, `geoespacial-maps`, `frontend-diseño`, `ia-aplicada`

## Push Strategy
```python
# 1. git clone the repo
# 2. Create category dirs + copy skill files
# 3. Update INDEX.md with new entries
# 4. Update learning-plan.md with progress
# 5. git add + commit + push
```

## Token Extraction (Reliable)
```python
with open('/root/.git-credentials') as f:
    for line in f:
        if 'github.com' in line:
            parts = line.strip().split('@')
            token = parts[0].replace('https://', '').split(':')[1]
            break
```
