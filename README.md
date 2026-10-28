# MFI Loan Calculator

A bilingual microfinance loan calculator built with **React 18 + Vite**,
modelled on how Cameroonian / CEMAC microfinance institutions actually price
loans. Borrowers enter a loan amount, nominal interest rate and repayment
period, and instantly see their all-in monthly payment, the **TEG (taux
effectif global)** including every fee, the net amount disbursed, the total
cost of credit and a full month-by-month amortization schedule — all in
**FCFA (XAF)**.

The interface works in **English and French** with a **light and dark theme**,
remembers every preference, and can print or save a client quotation as PDF.

## Interest methods

- **Reducing balance (taux dégressif)** — interest is recalculated each month
  on the balance still owed (standard amortizing loan).
- **Flat rate (taux fixe)** — interest is calculated once on the original
  principal and spread evenly across all instalments.

## Real MFI charges, not textbook math

- **Processing fee / frais de dossier** — a one-time, editable percentage of
  the principal, deducted at disbursement (0–5%).
- **Monthly insurance / assurance** — an editable percentage of the principal
  added to every instalment (0–2%).
- **TEG** — the annualised internal rate of return of the client's real cash
  flows (net amount received vs. all-in payments), solved with a bisection IRR
  routine. It reflects the true cost of credit including fees, unlike the
  nominal headline rate.
- **Method comparison** — one click shows reducing-balance vs. flat-rate
  side by side for the same quote, with the cheaper option highlighted.
- **Print / Save PDF** — produces a clean, light-only client quotation
  (controls and sliders are hidden automatically).

## Features

- 🌍 **Bilingual EN/FR** — full UI translation through a lightweight i18n
  dictionary and a React Context; locale-aware number and FCFA formatting
  (`1,500,000 FCFA` / `1 500 000 FCFA`)
- 🌙 **Light / dark mode** — manual toggle, saved to `localStorage`, respecting
  the operating-system preference on first visit (no flash of the wrong theme)
- ⚡ **Live recalculation** with React `useState` + `useMemo`
- 🧮 Pure, backend-free calculation engine: annuity amortization, flat-rate
  interest, fee/insurance modelling and IRR-based TEG
- 📊 Summary cards plus a hand-built **SVG donut chart** (no chart library)
- 📋 Full **amortization table** with sticky header on desktop and stacked
  labelled cards on mobile, including the insurance column
- 🔗 **Shareable URLs** — every quote is encoded in the query string, e.g.
  `?principal=1000000&annualRate=15&months=24&method=flat&fee=1.5&ins=0.3&lang=fr&theme=dark&compare=1`
- 📱 Fully **responsive** (mobile, tablet, desktop) and print-ready
- ✅ **20 automated checks** (`npm test`) covering annuity math, flat-rate
  interest, fees, insurance, net disbursement, the IRR/TEG solver, method
  comparison and localised formatting

## Tech stack

- React 18 — function components, hooks, Context API
- Vite 5 — dev server and production build
- Plain CSS with custom properties (theme tokens drive light/dark mode and print)
- `Intl.NumberFormat` for locale-aware currency formatting
- Zero runtime dependencies beyond React

## Project structure

```
loan-calculator/
├── index.html               # Pre-paint theme script + mount point
├── package.json
├── vite.config.js
├── vercel.json / netlify.toml
├── public/
│   └── favicon.svg
├── scripts/
│   └── selftest.mjs         # Zero-dependency test runner (npm test)
└── src/
    ├── main.jsx             # React entry point + SettingsProvider
    ├── App.jsx              # Loan state, URL sync, layout
    ├── styles.css           # Theme tokens, light/dark, print, responsive rules
    ├── context/
    │   └── SettingsContext.jsx   # Language + theme state, t() translator
    ├── i18n/
    │   └── translations.js  # English & French dictionaries
    ├── lib/
    │   └── loan.js          # Loan math, IRR/TEG, fees, formatting
    └── components/
        ├── Header.jsx       # Brand, EN/FR, theme and print controls
        ├── LoanForm.jsx
        ├── ResultsPanel.jsx
        ├── ComparisonPanel.jsx
        ├── Donut.jsx
        └── ScheduleTable.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Test and build

```bash
npm test        # 20 checks for the loan engine, fees, TEG and formatting
npm run build   # production build, outputs static files to dist/
npm run preview # serve the production build locally
```

## Deployment

The repository includes `vercel.json` and `netlify.toml`, so both hosts deploy
with zero configuration (build command `npm run build`, output directory
`dist`). Import the GitHub repository into [Vercel](https://vercel.com) or
[Netlify](https://www.netlify.com); every `git push` redeploys automatically.

Live demo: https://loan-calculator-black-gamma.vercel.app

## License

[MIT](./LICENSE)

## Author

Amaranang Leslie Ubana — Banking & Finance graduate and React/JavaScript
developer. amaraleslie2025@gmail.com · +237 679 646 919.
