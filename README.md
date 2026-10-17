# Pathway — Internship discovery, with a little more intention

Pathway is a responsive front-end application for discovering internships and early-career roles. It is designed around a simple idea: a job search should help people understand their next step, not just scroll through a list of openings.

This project was built for the Front-End Application Development task. It includes a landing page, an interactive opportunity dashboard, saved roles, and a detailed opportunity view with an application flow.

## Highlights

- **Landing page** — introduces the product, shows the product point of view, and surfaces featured roles.
- **Discover dashboard** — search by role, company, skill, or keyword; filter by category, location, and work arrangement; and sort-ready result presentation.
- **Opportunity detail view** — role information, responsibilities, skills, match reasoning, related opportunities, and a clear apply action.
- **Saved roles** — shortlist roles and keep them available across refreshes with `localStorage`.
- **Quick application** — submit an optional note from an accessible modal; application state is persisted locally and reflected in the role detail and saved views.
- **Responsive behavior** — desktop navigation, responsive cards, mobile-friendly layout, and a fixed mobile navigation bar.
- **Accessible interaction** — semantic landmarks, form labels, visible keyboard focus, button labels, dialog semantics, and keyboard activation for opportunity cards.

## Tech stack

- React 18 + TypeScript
- Vite 6
- `lucide-react` for consistent interface icons
- Vitest + jsdom for lightweight behavior checks
- CSS with design tokens and responsive media queries; no UI framework

The current version uses typed local fixture data so the complete user flow works without a backend or credentials. The API boundary is intentionally simple: `VITE_API_URL` is documented in `.env.example` for replacing the fixture data with a real service later.

## Development process

1. Started with the required user outcomes: discover a role, understand whether it fits, save it for later, and apply without losing context.
2. Created a small design system in CSS first: evergreen ink, warm coral actions, mint status surfaces, generous whitespace, serif editorial headings, and reusable card/badge/button patterns.
3. Modeled opportunity and application data with TypeScript types before building the views.
4. Built the reusable app shell and responsive components: header, mobile navigation, opportunity cards, filters, match badges, and modal.
5. Added client-side navigation with the History API so the views have real URLs without introducing a large routing dependency.
6. Added local persistence for saved roles and applications so interactions survive a page refresh.
7. Added filter behavior tests and verified typecheck/build output.

## Design patterns used

- **Component composition** — shared components such as `JobCard`, `Button`, `SaveButton`, `Header`, and `CompanyMark` keep repeated interaction patterns consistent.
- **Single source of truth** — `App` owns navigation and persisted saved/application state, while child views receive focused props and callbacks.
- **Pure filtering utility** — `filterJobs` is a pure function in `src/data.ts`, which makes search/filter behavior easy to test independently of the UI.
- **Progressive enhancement** — the app uses normal buttons and form controls first, then enhances them with client-side navigation and local persistence.
- **Local-first mock service** — fixture data and `localStorage` provide a deterministic offline experience while leaving a clear seam for a future API.

## Run locally

### Requirements

- Node.js `20.18.1` (the version is pinned in `.nvmrc`)
- npm 10+

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

### Run the checks

The single required test command is:

```bash
npm test
```

Additional project checks:

```bash
npm run typecheck
npm run build
```

The same commands are available through `make`:

```bash
make test
make build
```

### Preview a production build

```bash
npm run build
npm run preview
```

### Docker

```bash
docker run --rm -p 4173:4173 pathway-frontend
```

Then open `http://localhost:4173`.

## Routes

| Route                | View                                    |
| -------------------- | --------------------------------------- |
| `/`                  | Landing page                            |
| `/dashboard`         | Discover dashboard and filters          |
| `/saved`             | Saved roles and application status      |
| `/opportunities/:id` | Opportunity detail and application flow |

The landing page includes the first three featured roles. Click a card to open its detail view, use **Save** to add it to the shortlist, or choose **Apply now** to submit an application.

## Project structure

```text
.
├── src/
│   ├── App.tsx          # App shell, views, navigation, and interactions
│   ├── data.ts          # Typed fixture opportunities and pure filter helper
│   ├── data.test.ts     # Search and filter behavior tests
│   ├── index.css        # Design tokens, components, and responsive layout
│   ├── main.tsx         # React entry point
│   └── types.ts         # Shared domain types
├── .env.example         # Optional future API URL
├── .nvmrc               # Reproducible Node version
├── Dockerfile           # Production container build
├── Makefile             # Shortcuts for install/build/test
└── README.md
```

## Notes for backend integration

The UI currently keeps fixture data in memory and saved/application data in `localStorage` so it can be evaluated offline. To connect it to a backend, replace the `jobs` source in `src/data.ts` with a typed fetch layer that uses `import.meta.env.VITE_API_URL`, and move the saved/application handlers in `App.tsx` to the authenticated API mutations. The view contracts and domain types are already isolated to make that change focused.
