# Software Engineering Best Practices — AdShield AI

Version: 1.0
Scope: Applies to all components (backend/FastAPI, browser extension, dashboard, infra, docs)

Overview
This document codifies engineering standards for AdShield AI to ensure readability, maintainability, scalability, security, and performance across the monorepo.

1) File & Project Structure
1.1 Recommended Repository Layout (monorepo)
```text path=null start=null
/ (repo root)
├─ backend/                     # FastAPI service (Python)
│  ├─ adshield/                 # Application package
│  │  ├─ api/                   # Routers (v1, health)
│  │  ├─ detectors/             # url, ads, news modules
│  │  ├─ services/              # aggregation, caching, clients
│  │  ├─ db/                    # models, migrations (Alembic)
│  │  ├─ core/                  # config, logging, middleware
│  │  └─ tests/                 # unit/integration tests
│  ├─ pyproject.toml            # black, isort, flake8, mypy
│  └─ README.md
├─ frontend/                    # All Node/React workspaces
│  ├─ apps/
│  │  ├─ extension/             # Chrome MV3 + React
│  │  └─ dashboard/             # React + Tailwind web app
│  ├─ packages/
│  │  ├─ ui/                    # shared React components (RiskBadge, Table, etc.)
│  │  ├─ shared/                # shared TS utils, types
│  │  ├─ api-client/            # optional: generated client from backend OpenAPI
│  │  ├─ tsconfig/              # base tsconfig(s)
│  │  └─ eslint-config/         # shared ESLint config
│  ├─ package.json              # frontend workspace root (pnpm/yarn workspaces)
│  └─ pnpm-workspace.yaml       # or workspaces config in package.json
├─ shared/                      # Cross-language assets (OpenAPI, docs, schemas)
├─ docs/                        # PRD, best practices, ADRs
├─ .github/workflows/           # CI/CD pipelines
├─ scripts/                     # Dev/ops scripts (pwsh, sh)
├─ infra/                       # IaC, docker-compose, k8s (future)
└─ .editorconfig                # unified formatting defaults
```

1.1.1 Frontend App Structures
Extension (MV3 + React + Vite)
```text path=null start=null
frontend/apps/extension/
├─ public/
│  ├─ manifest.json
│  └─ icons/
├─ src/
│  ├─ background/         # service worker entry
│  │  └─ index.ts
│  ├─ content/            # content scripts
│  │  └─ index.ts
│  ├─ popup/              # React UI for popup
│  │  ├─ App.tsx
│  │  └─ components/
│  ├─ options/            # settings page
│  │  └─ App.tsx
│  ├─ lib/                # API client, caching helpers
│  │  ├─ api.ts
│  │  └─ storage.ts
│  └─ types/
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.ts
└─ package.json
```

Dashboard (React + Tailwind + Vite)
```text path=null start=null
frontend/apps/dashboard/
├─ public/
├─ src/
│  ├─ pages/              # routes
│  ├─ components/         # UI atoms/molecules
│  ├─ features/           # domain slices (history, whitelists, settings)
│  ├─ api/                # typed client, hooks
│  │  └─ client.ts
│  ├─ hooks/
│  ├─ styles/
│  └─ main.tsx
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.ts
└─ package.json
```

1.1.2 Shared Frontend Packages
```text path=null start=null
frontend/packages/ui/              # Reusable React components
frontend/packages/shared/          # TS utilities (debounce, types, zod schemas)
frontend/packages/api-client/      # OpenAPI-generated client (optional)
frontend/packages/tsconfig/        # tsconfig.base.json, tsconfig.react.json
frontend/packages/eslint-config/   # shared ESLint preset
```

1.2 Modularization Strategies
- Domain-first structure: Group by feature/domain (detectors, aggregation) rather than by technical layer only.
- Layered boundaries: api -> services -> detectors -> infra (db/clients). Upward imports only; lower layers don’t depend on higher layers.
- Public interfaces: Export a small, stable API from each module; keep internal helpers private.
- Dependency inversion: Higher-level policies depend on abstractions (protocols/interfaces), not concrete implementations.

1.3 Separation of Concerns
- Keep I/O (web, DB) separate from pure business logic.
- Keep configuration and secrets separate from code (env-driven config).
- Avoid god objects; prefer small cohesive modules/functions.

1.4 Avoid Cyclic Dependencies
- Enforce directional imports and review cycles in CI (e.g., Python import linter, TS path aliases with boundaries).

2) Naming Conventions
2.1 Files & Directories
- Web (JS/TS):
  - React components: PascalCase (e.g., PageHeader.tsx)
  - Utility modules: kebab-case or camelCase (consistent within repo; prefer kebab-case for filenames)
  - Directories: kebab-case
- Python: snake_case for modules and packages (e.g., url_checker.py)
- Config files: use standard names (.eslintrc, pyproject.toml, docker-compose.yml)

2.2 Variables, Functions, Classes
- Variables: camelCase (JS/TS), snake_case (Python)
- Constants: UPPER_SNAKE_CASE in all languages
- Functions: camelCase (JS/TS), snake_case (Python), verbs first (getRiskScore)
- Classes/Components: PascalCase (DetectorService, RiskBadge)
- Interfaces/Types (TS): PascalCase without I-prefix (UrlCheckResult)

2.3 API Naming (REST)
- Base path: /api/v1
- Plural nouns for collections: /flagged-events, /whitelists
- Resource-oriented endpoints; actions as sub-resources: /whitelists/:id
- Use kebab-case for path segments; snake_case or camelCase for JSON fields (choose one per service; prefer camelCase in JSON)
- HTTP verbs: GET (read), POST (create/compute), PUT/PATCH (update), DELETE (delete)
- Status codes: 200/201/204 success; 400 client error; 401/403 auth; 404 not found; 409 conflict; 422 validation; 500 server

2.4 GraphQL (if adopted later)
- Types: PascalCase (FlaggedEvent)
- Fields: camelCase (createdAt)
- Query names: describe data (flaggedEvents)
- Mutation names: verb + resource (createWhitelist)

2.5 Database
- Tables: snake_case, plural (flagged_events)
- Columns: snake_case (created_at)
- Indexes: idx_<table>_<col1>_<col2>

3) Code Readability
3.1 Principles
- Single Responsibility: small functions/classes with one clear job.
- Prefer pure functions; avoid global state.
- Early returns reduce nesting.
- Fail fast: validate inputs at boundaries.
- Limit function length; split complex logic into helpers.

3.2 Comments & Docs
- Explain “why”, not “what” code does.
- Module/class/function docstrings for public APIs.
- Use TODO/FIXME with owner and context.

3.3 Consistent Formatting
- Frontend (JS/TS): Prettier + ESLint
- Backend (Python): Black + isort + flake8 + mypy
- EditorConfig for whitespace and line endings

Example Prettier config
```json path=null start=null
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Example ESLint config (React + TS)
```json path=null start=null
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

Example Python formatting (pyproject.toml)
```toml path=null start=null
[tool.black]
line-length = 100
skip-string-normalization = true

[tool.isort]
profile = "black"

[tool.flake8]
max-line-length = 100
extend-ignore = ["E203", "W503"]

[tool.mypy]
python_version = "3.11"
warn_unused_ignores = true
strict = true
```

3.4 Readability Examples
JS/TS (good)
```ts path=null start=null
type UrlCheckResult = {
  score: number;
  reasons: string[];
};

export function isHighRisk({ score }: UrlCheckResult): boolean {
  return score > 0.6;
}
```

Python (good)
```python path=null start=null
from typing import Sequence

def top_reasons(reasons: Sequence[str], limit: int = 3) -> list[str]:
    """Return up to `limit` concise reasons.

    Keep pure and side-effect free for easy testing.
    """
    return list(reasons)[:limit]
```

4) Maintainability & Scalability
4.1 Extensibility Strategies
- Interfaces/Protocols: program to abstractions (e.g., Detector interface) to swap implementations.
- Configuration over hard-coding: environment variables, typed config layer.
- Feature flags: gate risky features; allow safe rollouts.
- Composition over inheritance.
- Clear module boundaries and dependency direction.

4.2 Documentation Standards
- Each package has a README with setup, scripts, and architecture notes.
- ADRs (Architecture Decision Records) for significant choices in docs/adr/YYYYMMDD-title.md.
- Docstrings for public APIs; type hints required in Python and TS.

4.3 Testing Strategy
- Pyramid: unit (70%+), integration (20-25%), e2e (5-10%).
- Unit tests: pure functions, edge cases, fast.
- Integration tests: API routes, DB interactions (test DB), external clients via test doubles.
- E2E: critical flows (extension <-> backend).
- Coverage thresholds: backend >= 70%, frontend >= 70%.
- Determinism: no network/time randomness; inject clocks/clients.
- Naming: test_<module>.py (pytest); *.spec.tsx for frontend.

Example pytest
```python path=null start=null
import pytest
from adshield.services.aggregate import aggregate_score

@pytest.mark.parametrize("inputs,expected", [
    ((0.1, 0.2, 0.0), 0.16),
    ((0.5, 0.3, 0.2), 0.44),
])
def test_aggregate_score(inputs, expected):
    assert aggregate_score(*inputs) == pytest.approx(expected)
```

Example Vitest (frontend)
```ts path=null start=null
import { describe, expect, it } from "vitest";
import { decisionFromScore } from "../src/lib/decision";

describe("decisionFromScore", () => {
  it("classifies safe", () => {
    expect(decisionFromScore(0.2)).toBe("SAFE");
  });
});
```

4.4 CI/CD Best Practices
- CI checks (required): lint, typecheck, test, build.
- Caching: pip/poetry, npm/pnpm caches to speed up builds.
- Artifacts: build extension/dashboard; publish Docker image for backend.
- Environments: dev → staging → prod; protected branches and reviews.
- Secrets in CI: stored in CI secret store; never echoed.

Example GitHub Actions (backend)
```yaml path=null start=null
name: backend-ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - name: Install deps
        run: pip install -e backend[dev]
      - name: Lint & Typecheck
        run: |
          black --check backend
          isort --check-only backend
          flake8 backend
          mypy backend/adshield
      - name: Tests
        run: pytest -q backend/adshield/tests
```

5) Version Control & Collaboration
5.1 Branching Model
- Prefer trunk-based (GitHub Flow):
  - main is always deployable.
  - feature branches from main: feat/<short-desc>
  - short-lived branches; frequent merges behind flags if needed.
- Alternatively, light GitFlow for releases (release/x.y.z branches) when needed.

5.2 Commit Message Style
- Conventional Commits:
  - feat: new feature
  - fix: bug fix
  - docs: documentation
  - refactor: code change not affecting behavior
  - test: adding/updating tests
  - chore: tooling/infra
  - perf: performance improvements
- Format: type(scope): short summary

Examples
```text path=null start=null
feat(backend): add /api/v1/analyze aggregation endpoint
fix(extension): debounce analyze calls on rapid navigation
chore(ci): add mypy to backend workflow
```

5.3 Pull Requests
- Keep PRs small (<400 lines of diff when possible).
- Include description, screenshots for UI, and test plan.
- Link issues and PRs; use draft PRs for work-in-progress.
- Require 1–2 approvals; block self-merge if no reviews.

5.4 Code Ownership
- Use CODEOWNERS for critical paths (detectors, security-sensitive code).
- Owners must review changes in owned directories.

5.5 Releases & Tags
- Semantic versioning: MAJOR.MINOR.PATCH
- Tag releases and generate changelogs (Conventional Changelog).

6) Security & Performance Considerations
6.1 Input Validation & Sanitization
- Backend: Pydantic models validate all inputs; reject unknown fields.
- Frontend: Validate user inputs (zod/yup) before sending.
- Sanitize all strings rendered in UI; avoid dangerouslySetInnerHTML.

6.2 Secrets Management
- Never commit secrets. Use environment variables and secret stores.
- Local: .env.local (gitignored). Production: managed secrets (cloud/KMS).
- Avoid printing secrets; mask in logs; rotate regularly.

6.3 API Security
- Enforce HTTPS and CORS allowlist for extension/dashboard origins.
- Rate limiting and basic abuse protection.
- Authentication: service-to-service API keys for write endpoints (e.g., /logs), user auth in Phase 2.
- Avoid exposing internal error details; map to safe messages.

6.4 Dependency & Supply Chain
- Pin versions; use lockfiles.
- Enable Dependabot/Renovate for updates.
- Validate packages (signatures/SLSA if available); review transitive risks.
- SBOM generation for backend images.

6.5 Logging, Monitoring, and Alerts
- Structured logs (JSON) with trace IDs; no PII.
- Metrics: request rate, latency p50/p95/p99, errors, timeouts, cache hit rate.
- Health checks: liveness/readiness; alert on error rate >1% or latency SLO breaches.

6.6 Performance Optimization
Backend
- Timeouts and circuit breakers for external calls (HF Inference API).
- Connection pooling and keep-alive.
- Caching: in-process LRU; Redis later.
- Avoid N+1 DB queries; use indexes and explain plans.

Frontend/Extension
- Debounce/throttle API calls; single analyze per navigation.
- Code-splitting and lazy-loading for dashboard.
- Avoid heavy DOM operations in content scripts; run at document_idle.
- Use Web Workers only if needed; keep memory footprint low.

Data
- Minimize data sent/stored; strip query params by default; hash sensitive paths.

6.7 Privacy by Design
- Opt-in telemetry; clear explanation.
- Data retention defaults (e.g., 30 days) and user-controlled.
- Redact PII and avoid storing raw page content without explicit consent.

7) Example Patterns & Anti-Patterns
7.1 Good: Dependency Inversion (Python)
```python path=null start=null
from typing import Protocol

class UrlDetector(Protocol):
    def check(self, url: str) -> tuple[str, float, list[str]]: ...

class HeuristicUrlDetector:
    def check(self, url: str) -> tuple[str, float, list[str]]:
        # ... implementation
        return ("safe", 0.1, [])

class Aggregator:
    def __init__(self, detector: UrlDetector):
        self.detector = detector

    def analyze(self, url: str) -> float:
        _, score, _ = self.detector.check(url)
        return score
```

7.2 Good: Small React Components
```tsx path=null start=null
type RiskBadgeProps = { decision: "SAFE" | "WARN" | "BLOCK" };

export function RiskBadge({ decision }: RiskBadgeProps) {
  const color = decision === "SAFE" ? "green" : decision === "WARN" ? "amber" : "red";
  return <span className={`badge badge-${color}`}>{decision}</span>;
}
```

7.3 Anti-Pattern: Mixed Concerns
```ts path=null start=null
// BAD: fetch, parse, and render combined; hard to test
export async function checkAndRender(url: string) {
  const res = await fetch(`/api/v1/url/check`, { method: "POST", body: JSON.stringify({ url }) });
  const data = await res.json();
  document.body.innerHTML = `<div>${data.score}</div>`;
}
```

7.4 Better: Separate Layers
```ts path=null start=null
export async function checkUrl(url: string) {
  const res = await fetch(`/api/v1/url/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return (await res.json()) as { score: number };
}

export function renderScore(score: number) {
  const el = document.createElement("div");
  el.textContent = String(score);
  document.body.appendChild(el);
}
```

8) Checklists
8.1 PR Checklist
- [ ] Code compiles, tests pass locally
- [ ] Linting/formatting clean
- [ ] Types added/updated
- [ ] Public APIs documented
- [ ] Added/updated tests
- [ ] Security/privacy review if touching data paths
- [ ] Screenshots for UI changes

8.2 Release Checklist
- [ ] CI green on main
- [ ] Version bumped and changelog updated
- [ ] Environment variables and secrets in place
- [ ] Rollback plan documented
- [ ] Monitoring dashboards updated

References & Tools
- Frontend: Prettier, ESLint, TypeScript, Vitest, Playwright
- Backend: FastAPI, Pydantic, Black, isort, flake8, mypy, pytest
- Security: OWASP ASVS/Top 10, Bandit (Python), npm audit
- DevEx: EditorConfig, Husky + lint-staged, Commitlint

Appendix A — Canonical Web Pages & Routes (Demo-first MVP)
- / (Home): tagline, CTAs (Start Scanning, Learn)
- /dashboard (Main Hub): tiles/tabs for Text, Documents, Audio; recent scans; quick chart
- /analyze/text: paste/upload text → highlights + score
- /analyze/doc: upload image/doc → overlays + score
- /analyze/audio: upload audio → deepfake score (+ transcript highlight if available)
- /results/:id: drill-down report with per-modality breakdown
- /learn: tutorials, examples, mini-quizzes
- /settings: local preferences, dark mode, history toggle

Appendix B — API Endpoints & Upload Limits
- Endpoints
  - POST /api/v1/text/analyze
  - POST /api/v1/doc/analyze
  - POST /api/v1/audio/analyze
  - (optional) POST/GET /api/v1/history
- Upload limits (server-enforced; align frontend validation)
  - Text: ≤32 KB characters; UTF-8 only
  - Images: PNG/JPG ≤1 MB (MVP). PDF optional; if enabled, ≤5 MB
  - Audio: WAV/MP3 ≤10 seconds or ≤2 MB
- Sanitization & safety
  - Use magic/MIME sniffing; reject mismatches
  - Strip or redact obvious PII in logs; never store raw uploads by default
  - Timeouts: text 700ms, doc 2.5s, audio 4s; return partial results on timeout

