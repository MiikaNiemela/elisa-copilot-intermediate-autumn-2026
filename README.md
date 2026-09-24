# 🤖 GitHub Copilot Intermediate Exercises

This repository is a hands-on playground for **GitHub Copilot exercises**.

The exercises can be found in the [exercises directory](exercises/):

- [01-instruction-files.md](exercises/01-instruction-files.md)
- [02-agentic-skills.md](exercises/02-agentic-skills.md)
- [03-custom-agents.md](exercises/03-custom-agents.md)
- [04-mcp.md](exercises/04-mcp.md)

The exercises are performed against the small full-stack **Team Skills Matrix Platform** web app included in this repo. The app is intentionally simple so you can focus on practicing Copilot workflows rather than learning a complex codebase.

> No prior knowledge of TypeScript or Node.js is required for the exercises.

---

## 📊 Team Skills Matrix

A small but production-flavored platform for tracking engineering skills across teams: skills inventory, per-engineer competency levels, team heatmaps, gap analysis, and rule-based training recommendations.

### 🛠️ Technology stack

- **Frontend**: React 18 + Vite + TypeScript, React Router, TanStack Query
- **Backend**: Node + Express + TypeScript, Lowdb (JSON file storage), zod validation
- **Shared**: `@tsm/shared` package with domain types/enums consumed by both apps
- **Unit tests**: Vitest (backend analytics, frontend helpers/components)
- **E2E**: Playwright (Chromium)
- **Lint**: ESLint + @typescript-eslint
- **Monorepo**: npm workspaces (`shared`, `backend`, `frontend`)

### ✅ Requirements

- Node.js >= 20
- npm (workspaces support)

### 🚀 Getting started

```bash
npm install
npm run dev      # backend on :47821, frontend on :51734 (Vite proxies /api)
```

Open <http://localhost:51734>.

### 📁 Project layout

```log
package.json            # workspaces, top-level scripts
playwright.config.ts    # E2E config (boots backend + frontend preview)
shared/                 # @tsm/shared types/enums (source-only package)
backend/                # Express REST API + Lowdb + analytics
frontend/               # Vite React SPA
e2e/                    # Playwright specs
```

### 📜 Scripts

| Command              | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Run backend and frontend concurrently                       |
| `npm run build`      | Type-check & build all workspaces                           |
| `npm test`           | Run all Vitest suites (backend + frontend)                  |
| `npm run e2e`        | Run Playwright tests (boots prod build + isolated DB)       |
| `npm run e2e:install`| Install Playwright browsers                                 |
| `npm run lint`       | Lint all TypeScript                                         |
| `npm run seed:reset` | Delete the backend dev DB (`backend/data/db.json`)          |

### 🗑️ Resetting the data

The backend persists to [backend/data/db.json](backend/data/db.json), which is created from [backend/src/seed.json](backend/src/seed.json) on first start.

- `npm run seed:reset` deletes `db.json` so the next backend start re-seeds from `seed.json`.
- To customize the initial dataset, edit `seed.json` and then reset.
- The E2E database (`db.e2e.json`) is managed by Playwright and reset between runs — no manual action needed.

### 🏛️ Architecture

```text
┌────────────┐    HTTP/JSON     ┌──────────────────┐    JSON file
│  Frontend  │  ───────────▶    │ Express REST API │  ───────────▶  Lowdb (db.json)
│ (Vite SPA) │                  │  (validation,    │
└────────────┘                  │   analytics)     │
                                └──────────────────┘
        ▲                              ▲
        └────────── @tsm/shared types ─┘
```
