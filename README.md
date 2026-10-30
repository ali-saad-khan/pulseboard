# Pulseboard

A responsive, accessible sales analytics dashboard. A front-end showcase project by [Saad Ali Khan](https://saadconsulting.tech).

**Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS v4, Vitest + Testing Library.

## Features
- Live search, status and region filters, sortable columns, pagination
- KPI cards and a dependency-free SVG bar chart with a screen-reader text alternative
- Light/dark mode (follows system preference, toggleable)
- Keyboard-friendly: labelled controls, `aria-sort` on headers, visible focus, live-region result counts
- Deterministic mock data (seeded generator), so the demo and tests are stable
- Business rule kept in one tested place: revenue counts **paid** orders only

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 10 tests
npm run build
```
