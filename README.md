# ShopBoard — Interview Exercise

**Stack:** Node.js (Express) · MySQL 8 · React (Vite)  
**Time:** ~45 minutes  
**Tools:** Use whatever you'd normally reach for — Claude Code, Cursor, your own shell scripts, etc.

---

## Getting started

### Option A — GitHub Codespaces (recommended if you don't have Docker)

Click **Code → Codespaces → Create codespace** on the repo. The environment boots in about 60 seconds.

Once the terminal is available, run:

```bash
bash start.sh
```

This waits for MySQL, seeds the database, and starts both the API and frontend. The browser will open automatically at port 5173 when it's ready.

### Option B — VS Code Dev Containers

Requires Docker Desktop. Open the repo in VS Code, accept the "Reopen in Container" prompt, and wait for the build. Then in the terminal:

```bash
bash start.sh
```

### Option C — Run locally without containers

```bash
# Start MySQL however you prefer, then:
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials

cd backend && npm install && npm run dev   # API on :3000
cd frontend && npm install && npm run dev  # UI on :5173

node db/seed.js
```

---

## The app

ShopBoard is a simple internal order management dashboard. It has three pages:

- **Dashboard** — revenue stats and recent orders
- **Orders** — paginated order list with line items
- **Products** — product catalog with search

Explore it for a few minutes before starting the tasks.

---

## Tasks

### Task 1 — Fix a bug

Something is wrong with the revenue figures on the Dashboard. The numbers don't look right. Find the root cause and fix it.

### Task 2 — Add a feature

The Products page currently filters by category in the browser. Add server-side filtering so the API supports filtering by `category_id` and price range (`min_price`, `max_price`). Wire up the frontend so users can filter by price range.

### Task 3 — Find and fix a performance problem

The Orders page is slow to load — noticeably slower than the other pages. Find out why and fix it. Be ready to explain what you changed and why it helps.

---

## Notes for candidates

- Commit your changes as you go, with whatever commit style you normally use.
- There's no single right answer for Task 2 or Task 3 — be ready to walk through your reasoning.
- If you finish early, think about what else you'd improve in a production setting.
