export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Unit price times quantity - used consistently everywhere so totals always
// add up correctly as quantities change (see README for a note on why this
// doesn't always match the Figma mock's exact placeholder numbers).
export function lineTotal(unitPrice, quantity) {
  return unitPrice * quantity;
}

// Builds the review panel's data: line items grouped by category (with every
// variant that has qty > 0 shown as its own line, per the spec), plus the
// order-level totals, savings, and shipping/plan rows.
export function buildReviewData(steps, state, orderExtras) {
  const categories = [];

  steps.forEach((step) => {
    const lines = [];

    if (step.selectionType === 'single') {
      const selected = step.products.find((p) => p.id === state.selectedPlanId);
      if (selected) {
        lines.push({
          key: selected.id,
          productId: selected.id,
          variantId: null,
          name: selected.name,
          image: selected.thumbnail || selected.image,
          quantity: 1,
          showStepper: false,
          disabled: false,
          unitPrice: selected.price,
          compareAtPrice: selected.compareAtPrice,
          priceSuffix: selected.billingPeriod ? `/${selected.billingPeriod}` : '',
          priceLabel: selected.priceLabel,
        });
      }
    } else {
      step.products.forEach((product) => {
        const qtys = state.selections[product.id] || {};
        const variantKeys = Object.keys(qtys).filter((key) => qtys[key] > 0);

        variantKeys.forEach((variantKey) => {
          const variantObj = product.variants?.find((v) => v.id === variantKey);

          lines.push({
            key: `${product.id}:${variantKey}`,
            productId: product.id,
            variantId: variantObj ? variantKey : null,
            name: product.name,
            image: variantObj?.image || product.thumbnail || product.image,
            quantity: qtys[variantKey],
            showStepper: true,
            disabled: !!product.required,
            unitPrice: product.price,
            compareAtPrice: product.compareAtPrice,
            priceSuffix: '',
            priceLabel: product.priceLabel,
          });
        });
      });
    }

    if (lines.length > 0) {
      categories.push({ id: step.id, category: step.category, lines });
    }
  });

  let grandTotal = 0;
  let compareTotal = 0;

  categories.forEach((cat) => {
    cat.lines.forEach((line) => {
      const qty = line.showStepper ? line.quantity : 1;
      grandTotal += line.unitPrice * qty;
      compareTotal += (line.compareAtPrice ?? line.unitPrice) * qty;
    });
  });

  const shipping = orderExtras.shipping;
  grandTotal += shipping.price;
  compareTotal += shipping.compareAtPrice ?? shipping.price;

  const savings = Math.max(0, compareTotal - grandTotal);

  return { categories, grandTotal, compareTotal, savings, shipping };
}
