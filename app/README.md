# Bundle Builder — Frontend Take-Home

A two-column, data-driven bundle builder: a 4-step accordion on the left (cameras → plan → sensors → protection) with a live-syncing order review panel on the right.

## Run instructions

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production / verify it builds cleanly:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── data/products.json        # all steps, products, variants, pricing — the single source of truth
├── state/
│   ├── BundleContext.jsx      # reducer + context: selections, active variants, accordion state
│   └── usePersistedBundle.js  # localStorage save/restore ("Save my system for later")
├── utils/pricing.js           # currency formatting + review panel totals math
├── components/
│   ├── StepAccordion.jsx
│   ├── StepHeader.jsx
│   ├── ProductCard.jsx
│   ├── VariantSelector.jsx
│   ├── QuantityStepper.jsx    # shared by both product cards and review lines
│   └── ReviewPanel.jsx
├── App.jsx
└── index.css                  # single global stylesheet, CSS variables for all design tokens
```
