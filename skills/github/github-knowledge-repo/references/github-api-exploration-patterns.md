# GitHub API Patterns for Repo Exploration

## Fetching Starred Repos (Unauthenticated)

```python
import subprocess, json

result = subprocess.run(
    ["curl", "-s", "https://api.github.com/users/{user}/starred?per_page=100&sort=updated"],
    capture_output=True, text=True, timeout=30
)
repos = json.loads(result.stdout)
# Each repo has: full_name, html_url, description, language, stargazers_count, updated_at
```

## Fetching README

```python
def fetch_readme(owner, repo):
    result = subprocess.run(
        ["curl", "-s", f"https://api.github.com/repos/{owner}/{repo}/readme"],
        capture_output=True, text=True, timeout=30
    )
    data = json.loads(result.stdout)
    if "content" in data:
        import base64
        return base64.b64decode(data["content"]).decode("utf-8")
    return data.get("message", "Not found")
```

## Fetching Specific File

```python
def fetch_file(owner, repo, path):
    result = subprocess.run(
        ["curl", "-s", f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"],
        capture_output=True, text=True, timeout=30
    )
    data = json.loads(result.stdout)
    if "content" in data:
        import base64
        return base64.b64decode(data["content"]).decode("utf-8")
    return data.get("message", "Not found")
```

## Listing Repo Structure

```python
def fetch_tree(owner, repo, path=""):
    result = subprocess.run(
        ["curl", "-s", f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"],
        capture_output=True, text=True, timeout=30
    )
    data = json.loads(result.stdout)
    if "tree" in data:
        return [item["path"] for item in data["tree"] if item["type"] == "blob"]
    return []
```

## Fetching Repo Metadata

```python
def fetch_repo_info(owner, repo):
    result = subprocess.run(
        ["curl", "-s", f"https://api.github.com/repos/{owner}/{repo}"],
        capture_output=True, text=True, timeout=30
    )
    return json.loads(result.stdout)
    # Returns: description, language, stargazers_count, topics, default_branch, license, etc.
```

## Key Pitfalls Discovered

1. **Subagents timeout on GitHub API** — The GitHub API can be slow; subagents using `terminal` with many curl calls often hit the 600s timeout. Use `execute_code` with inline `subprocess.run()` for reliability.

2. **Branch detection** — Always check `repo.default_branch` before using `git/trees/{branch}`. Default is usually `main` but some repos use `master`.

3. **Base64 encoding** — All GitHub API file contents are base64-encoded. Always decode with `base64.b64decode()`.

4. **Rate limiting** — Unauthenticated: 60 req/hour. With token: 5000 req/hour. For bulk exploration, use token from `.env`.

5. **Don't clone large repos** — Use the API to fetch README + key files only. Cloning is unnecessary for knowledge extraction.

6. **API vs browser** — For getting starred repo lists, the API is faster and more reliable than browser scraping.
