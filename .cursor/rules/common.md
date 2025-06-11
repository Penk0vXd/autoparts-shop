# 🧭 Cursor Project – Common Rules

> 📁 **Location:** `rules/common.md`
> 📌 **Purpose:** Define **non‑negotiable** conventions so every contributor understands the technology stack, languages, architecture, and workflow. If something isn’t covered here, open an issue before acting.

---

## 0. 💻 Tech & Language Stack

*These are the **only** approved technologies & languages. Proposals to add/replace items must be made via PR that updates this file.*

### 0.1 Programming Languages

| Tier        | Language             | Version/Mode                             | Usage                         |
| ----------- | -------------------- | ---------------------------------------- | ----------------------------- |
| **Primary** | **TypeScript**       | `strict`, ES2022                         | All front‑end & shared logic  |
| **Primary** | **SQL (PostgreSQL)** |  15+                                     | Database models, migrations   |
| Secondary   | JavaScript           | Transpiled output only (no new JS files) | Browser runtime               |
| Secondary   | CSS                  | Tailwind utility classes + CSS Modules   | Styling                       |
| Tertiary    | Bash / Shell         | POSIX                                    | CI/CD & local tooling scripts |

### 0.2 Frameworks / Libraries

* **Next.js (App Router)** – React framework & routing
* **Makerkit** – Auth, checkout, dashboard scaffolding
* **Tailwind CSS** – design system & utility classes (do **not** mix with other CSS frameworks)
* **Supabase** – PostgreSQL DB, Storage, optional Auth fallback
* **Stripe** – payment processing
* **React Hook Form + Zod** – forms & validation
* **SWR** *(chosen over React Query)* – data fetching & cache layer
* **Jest + @testing-library/react** – unit/integration tests
* **ESLint + Prettier** – linting & formatting

### 0.3 Infrastructure / Hosting & Containerization

* **Docker** – canonical runtime for all services
* **Docker Compose** – local orchestration (app + db + aux services)
* **Vercel** – primary hosting & serverless functions *(container images where supported)*
* **GitHub Actions** – CI/CD pipeline (build & publish Docker images)
* **Fly.io** – optional edge deployment (must be discussed first)

### 0.4 Natural Languages

| Context             | Language      |
| ------------------- | ------------- |
| Public UI / Catalog | **Bulgarian** |
| Code, docs, commits | **English**   |

*Violating the approved stack requires lead‑dev sign‑off **and** an update to this doc.*

---

## 1. 🔧 Folder & File Structure

* **Folders** → *kebab‑case*
* **React components** → *PascalCase.tsx*
* **CSS Modules** → *camelCase.module.css*
* **Never** nest deeper than **2** levels inside `/components`
* **Utilities** live in `/lib` or `/utils`, **never** inside UI folders

```txt
/components/Header/Header.tsx
/components/ProductCard/ProductCard.tsx
/styles/header.module.css   ❌ WRONG
/styles/headerStyle.module.css ✅ RIGHT
```

---

## 2. 📦 Components & Logic

* Components must be **pure & reusable**
* **No business logic** inside UI; move it to hooks/services
* State management:

  * `useState`, `useReducer` → local
  * `useStore` (Zustand) → shared/global
* Always destructure props & type them with `type` or `interface`

---

## 3. 🎯 TypeScript Rules

* `strict: true` in `tsconfig.json`
* **No `any`** – temporary use requires `// TODO:` + issue link
* Prefer `type` aliases over `interface` *(unless class extension needed)*
* **Never** use `@ts-ignore` without inline justification

---

## 4. 💅 Styling Guidelines

* **Do not** mix Tailwind and CSS Modules in the *same file*
* Tailwind → layout, spacing, color
* CSS Modules → complex animations, component‑specific tweaks
* Module class names ➜ *camelCase*

---

## 5. 🧪 Testing Policy

* Every component ➜ matching test file `Component.test.tsx`
* Use **@testing-library/react**; **no snapshot tests**
* Minimum coverage:

  1. Renders without crashing
  2. Prop rendering/behavior
  3. Key user interactions

---

## 6. 🛡️ Code Quality & Linting

* Run `pnpm lint && pnpm type-check && pnpm test` before each commit
* Commit format:

  ```txt
  [scope] short description
  [ui] refactor nav hover effect
  ```
* One PR template; **one reviewer approval** required for merge

---

## 7. 🌐 Data Layer & API

* Data fetching only in `/services` or `/api/*.ts`
* **No `fetch`** calls inside components
* All response shapes typed in `/types`

---

## 8. 🔒 Security & Secrets

* **Never** commit `.env*` files
* Use `.env.local` for local dev and `.env.docker` for container runs
* Validate & sanitize *all* user inputs

---

## 9. 🌍 Localization

* `next-intl` for i18n
* Texts stored in locale JSON files; **no hard‑coded strings**

---

## 10. 📚 Documentation & Comments

* Public functions/hooks/services must include JSDoc
* Components need a short purpose description at the top

---

## 11. 🐳 Docker & Containerization

1. **Official Dockerfile** at repo root – must build production image via multi‑stage build using `node:20-alpine`.
2. **Image size** target ≤ 250 MB. Use `npm ci --omit=dev` and `prisma generate --data-proxy` to slim images.
3. A **docker-compose.yml** in the project root orchestrates:

   * `app` (Next.js runtime on `3000`)
   * `db` (PostgreSQL 15 on `5432`, persistent volume)
   * Optional other services (e.g. `mailhog`, `minio`).
4. **Environment variables** for containers live in `.env.docker` and are loaded via `env_file` in Compose.
5. **Volumes**: mount `/usr/src/app/.next/cache` as tmpfs only in dev; no volumes in prod images.
6. **Healthchecks**: every service defines a `HEALTHCHECK` to fail‑fast in CI and Compose.
7. **CI workflow** (`.github/workflows/ci.yml`) builds the Docker image, runs tests inside the container, and pushes to GH Container Registry on merge to `main`.
8. **Versioning**: Image tags follow semver (`vMAJOR.MINOR.PATCH`) and `latest` always points to the newest release.
9. **No root**: Final container must run as non‑root user `node` with UID `1000`.
10. **Local overrides**: Developers may create `docker-compose.override.yml`, ignored by git, for personal tweaks.

---

## 12. 🧠 Mental Model Rule

> **“No assumptions. Every decision must be explicit.”**
> If multiple valid approaches exist, **document the chosen one here** before merging.

---

*Last updated: 2025‑06‑10*
