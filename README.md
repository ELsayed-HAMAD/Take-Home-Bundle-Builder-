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

## Key decisions & tradeoffs

- **Pricing math.** Everything is computed as `unit price × quantity`, consistently, everywhere (cards and review panel both). The Figma mock's own placeholder numbers don't always multiply out cleanly (e.g. Cam Pan v3's per-unit price × 2 doesn't equal its shown line total), so rather than hardcode a value that would go stale the moment quantity changes, I picked unit prices that keep the math internally consistent. This means the app's initial total is a few dollars off from the exact pixel value in the mock, but every number on screen is always mathematically correct as you interact with it.

- **Per-variant photography.** Battery Cam Pro and Cam Floodlight v2 had real black/white product photos available, so those color chips actually swap the card image. Cam v4 (White/Grey/Black) and Cam Pan v3 (White/Black) only had one photo each, so their color chips currently share a single image. Swapping in real per-variant photos later is a one-line change in `products.json`.

- **Review panel thumbnails.** A few small square crops from the Figma export weren't explicitly labeled, so I matched them to products by shape/silhouette. Worth a quick visual sanity check against the live Figma file.

- **Accordion behavior.** Implemented as single-open (expanding a step collapses whatever else was open), matching how "Next: …" is meant to advance the flow. Nothing in the spec suggested multiple steps should be open simultaneously.

- **Plan step.** No product photography was available for the two plan tiers, so those cards render without an image rather than a broken/placeholder graphic.

- **Variant chip styling.** Per the spec ("don't worry about the selected-chip styling for now"), the active chip only gets a subtle border change — no full redesign of that state.

- **Logo/branding.** No hand-drawn or recreated Wyze wordmark/logo is used anywhere in the UI — any "WYZE" text visible is only what's baked into the real product photography supplied for this exercise (see below), not something added by this app.


## What's not finished

- Checkout is a placeholder alert, per the assignment's instructions.
- No automated test suite — verification was done manually (and via a scripted browser check during development) against the variant-independence, review-sync, and persistence requirements.
