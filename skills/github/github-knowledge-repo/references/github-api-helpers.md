# GitHub API Helper Patterns

## Token Discovery

```python
# Priority: .env file > git-credentials
token = None
for path in ['/hermes-home/.env', '/root/.hermes/.env']:
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                if line.startswith('GITHUB_TOKEN='):
                    token = line.split('=', 1)[1].strip()
                    break
if not token:
    # Fallback: parse git-credentials
    with open('/root/.git-credentials') as f:
        for line in f:
            if 'github.com' in line:
                token = line.split('://')[1].split(':')[0]
                break
```

## Reliable gh_api() Wrapper

Use `subprocess.run()` with `curl` instead of `urllib.request` — it avoids 404 errors on PUT/POST:

```python
import subprocess, json

def gh_api(method, path, data=None, token=None):
    """GitHub REST API wrapper using curl."""
    cmd = ['curl', '-s', '-X', method]
    cmd.extend(['-H', f'Authorization: token {token}'])
    cmd.extend(['-H', 'Accept: application/vnd.github.v3+json'])
    if not data:
        cmd.append(f'https://api.github.com{path}')
    else:
        cmd.extend(['-H', 'Content-Type: application/json'])
        cmd.extend(['-d', json.dumps(data)])
        cmd.append(f'https://api.github.com{path}')
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        return None
    return json.loads(result.stdout)
```

## Fetching Starred Repos Efficiently

```python
import urllib.request, json

# urllib.request is faster than subprocess for pagination
stars = []
page = 1
while True:
    url = f'https://api.github.com/users/{user}/starred?per_page=100&page={page}'
    req = urllib.request.Request(url, headers={
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    if not data:
        break
    stars.extend(data)
    page += 1
```

## Repo Categorization Heuristics

When organizing starred repos into categories, use name+description keyword matching:

```python
def categorize_repo(repo):
    name = repo['full_name'].lower()
    desc = (repo.get('description') or '').lower()
    
    if any(x in name for x in ['hermes-agent', 'agent-skills', 'workshop-ia', 'orca']):
        return 'IA/Agentes'
    elif any(x in name for x in ['mlx-vlm', 'gazetracking', 'yolo', 'detection', 'boxer3d']):
        return 'Visión/ML'
    elif any(x in name for x in ['nango', 'api-mega-list', 'libreborme', 'searchcraft', 'bicimad']):
        return 'Backend/APIs'
    elif any(x in name for x in ['vibevoice', 'voicebox']):
        return 'Audio/Voz'
    elif any(x in name for x in ['city2graph', 'maptalks', 'transit-map', 'trafficlab', 'gtfs']):
        return 'Frontend/UI'
    elif any(x in name for x in ['postgres-mcp', 'aws-dem', 'model-zoo']):
        return 'DevOps/Infra'
    elif any(x in name for x in ['markitdown', 'eng-practices', 'awesome-transit', 'awesome-design-systems']):
        return 'Listas/Colecciones'
    elif 'metabase' in name:
        return 'BI/Datos'
    elif any(x in name for x in ['drish', 'remote-sensing']):
        return 'Satélites/Datos'
    return 'Otro'
```

## File Structure Convention

```
skills/
├── ia/              # Inteligencia Artificial / ML / Computer Vision
├── herramientas/    # Tools / CLI / Utilities
├── audio/           # Audio / Voice / TTS
├── data/            # Data Science / BI / Analytics
├── frontend/        # UI / CSS / Design Systems / 3D
├── gis/             # Geospatial / Satellite / Maps
├── devops/          # Infrastructure / Database / MCP
└── backend/         # APIs / Integrations / Auth
```
