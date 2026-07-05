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

## Fixes in this pass

- **Product card layout bug.** The card wrapper was a row `flex`, which put the image beside the text instead of above it. Changed to `flex-col` so cards stack image → title → description → variants → stepper/price, matching the Figma layout.
- **Responsive breakpoint.** The builder/review panel switched to the two-column desktop layout at `md` (768px), which squeezed things too early. Moved that switch to `lg` (1024px) so there's a proper wide-but-still-stacked tablet state (full-width builder, full-width review panel below), and the "Let's get started!" mobile heading now hides at `sm` (640px) independently of that.
- **Camera/sensor grid on tablet.** Added a `md:grid-cols-3` step so the product grid uses the extra width on tablet (before the layout goes two-column) instead of staying locked at 2 columns from phone all the way to desktop.
- **Housekeeping.** Removed an empty, unused `App.css` and a duplicate `index.css` import (it was imported in both `main.jsx` and `App.jsx`).
- **Real product photography.** All 15 image paths referenced in `products.json` (`public/images/`) are now the actual Wyze product photos supplied for this exercise, replacing an earlier pass's generated placeholders.
- **Card layout switches with the page layout, not the card's own width.** The product card image sits on top (full width) whenever the page is in its single-column stacked mode — regardless of how many card columns are in the grid at that point — and only becomes a compact side-by-side thumbnail+text row once the page reaches `lg` and switches to the two-column builder+review layout. An earlier pass tried a CSS container query keyed to the card's own rendered width, which looked right at the exact two reference sizes but broke at in-between tablet widths where cards are wide yet the page is still single-column; keying off the same `lg` breakpoint as the page layout fixes that.
- **Quantity stepper shape.** Fixed to a rounded rectangle (`rounded-lg`) matching the reference screenshots — it was previously a full pill (`rounded-full`).

## What's not finished

- Checkout is a placeholder alert, per the assignment's instructions.
- No automated test suite — verification was done manually (and via a scripted browser check during development) against the variant-independence, review-sync, and persistence requirements.
