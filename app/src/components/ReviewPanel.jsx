import { useBundle } from '../state/BundleContext';
import { usePersistedBundle } from '../state/usePersistedBundle';
import { buildReviewData, formatCurrency, lineTotal } from '../utils/pricing';
import QuantityStepper from './QuantityStepper';
import PlanBadgeIcon from './icons/PlanBadgeIcon';
import ShippingIcon from './icons/ShippingIcon';

export default function ReviewPanel() {
  const { steps, state, orderExtras, setQuantity } = useBundle();
  const { save, justSaved } = usePersistedBundle();

  const { categories: rawCategories, grandTotal, compareTotal, savings, shipping } = buildReviewData(
    steps,
    state,
    orderExtras
  );

  // Reorder categories: Move 'Plan' category to the end
  const categories = [...rawCategories].sort((a, b) => {
    if (a.category === 'Plan') return 1;
    if (b.category === 'Plan') return -1;
    return 0;
  });

  return (
    <div className="bg-review rounded-[10px] p-6">
      <div className="text-[12px] font-[400] tracking-wide text-muted">REVIEW</div>
      <h2 className="text-[22px] font-[400] mt-1 mb-2">Your security system</h2>
      <p className="text-[14px] text-muted leading-snug mb-4">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      {categories.map((cat) => (
        <div key={cat.id} className="border-t border-black/10 pt-3 mb-3">
          <div className="text-[11px] font-[400] tracking-wide text-muted mb-2">
            {cat.category.toUpperCase()}
          </div>
          {cat.lines.map((line) => (
            <div key={line.key} className="flex items-center gap-2 py-2">
              {line.image && (
                <img
                  className="w-9 h-9 object-contain rounded-md bg-white border border-line p-0.5"
                  src={line.image}
                  alt={line.name}
                />
              )}
              <span className="flex-1 text-[13px] font-semibold flex items-center gap-1.5">
                {cat.category === 'Plan' && <PlanBadgeIcon />}
                {cat.category === 'Plan' ? (
                  <>
                    {line.name.split(' ')[0]}{' '}
                    <span className="text-primary">{line.name.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  line.name
                )}
              </span>

              {line.showStepper ? (
                <QuantityStepper
                  size="sm"
                  quantity={line.quantity}
                  disabled={line.disabled}
                  onDecrement={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                  onIncrement={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                />
              ) : (
                <span className="w-14" />
              )}

              <div className="flex flex-col items-end min-w-16">
                {line.compareAtPrice != null && (
                  <span className="text-muted line-through text-[14px]">
                    {formatCurrency(lineTotal(line.compareAtPrice, line.quantity))}{line.priceSuffix}
                  </span>
                )}
                <span className="text-primary font-bold text-[14px]">
                  {line.priceLabel ?? formatCurrency(lineTotal(line.unitPrice, line.quantity))}{line.priceSuffix}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-2 py-2 border-t border-black/10 mt-2">
        <span className="w-[41px] h-[41px] flex items-center justify-center bg-white rounded-[5px]" aria-hidden="true"><ShippingIcon className="w-[29px] h-[29px]" /></span>
        <span className="flex-1 text-[14px] font-semibold">{shipping.label}</span>
        <span className="w-14" />
        <div className="flex flex-col items-end min-w-16">
          {shipping.compareAtPrice != null && (
            <span className="text-muted line-through text-[14px]">
              {formatCurrency(shipping.compareAtPrice)}
            </span>
          )}
          <span className="text-primary font-bold text-[14px]">
            {shipping.price === 0 ? 'FREE' : formatCurrency(shipping.price)}
          </span>
        </div>
      </div>

      <div className="flex py-1.5 justify-between items-center">
        {orderExtras.guarantee?.image && (
          <div className="flex justify-end my-3">
            <img className="w-[78px] h-[78px]" src={orderExtras.guarantee.image} alt={orderExtras.guarantee.label} />
          </div>
        )}
        <div>
          <div className="flex justify-end mb-1">
            <span className="bg-primary text-white text-[12px] font-[400] px-2.5 py-1 rounded-[3px]">
              {orderExtras.financingNote}
            </span>
          </div>
          <div className="flex justify-end items-baseline gap-2 mb-1">
            {compareTotal > grandTotal && (
              <span className="text-muted text-[18px] line-through text-base mr-2">{formatCurrency(compareTotal)}</span>
            )}
            <span className="text-[24px] font-extrabold text-primary">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {savings > 0 && (
        <p className="text-center text-success font-semibold text-[12px] mb-4">
          Congrats! You're saving {formatCurrency(savings)} on your security bundle!
        </p>
      )}

      <button
        type="button"
        className="w-full py-3 bg-primary hover:bg-primary-hover text-white border-none rounded-[4px] text-base font-bold cursor-pointer mb-3"
        onClick={() => window.alert('Checkout is not implemented in this prototype.')}
      >
        Checkout
      </button>

      <button
        type="button"
        className="block w-full text-center bg-transparent border-none text-ink underline text-[14px] cursor-pointer"
        onClick={save}
      >
        {justSaved ? 'Saved!' : 'Save my system for later'}
      </button>
    </div>
  );
}