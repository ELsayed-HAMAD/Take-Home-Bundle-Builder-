import { useBundle } from '../state/BundleContext';
import { formatCurrency } from '../utils/pricing';
import VariantSelector from './VariantSelector';
import QuantityStepper from './QuantityStepper';
import PlanBadgeIcon from './icons/PlanBadgeIcon';

export default function ProductCard({ product, step }) {
  const {
    getQuantity,
    getActiveVariant,
    getProductTotalQuantity,
    setQuantity,
    setActiveVariant,
    state,
    selectPlan,
  } = useBundle();

  const isPlanMode = step.selectionType === 'single';
  const activeVariantId = getActiveVariant(product.id);
  const quantity = getQuantity(product.id, activeVariantId);
  const totalQuantity = getProductTotalQuantity(product.id);
  const isSelected = isPlanMode ? state.selectedPlanId === product.id : totalQuantity > 0;

  const activeVariantObj = product.variants?.find((v) => v.id === activeVariantId);
  const image = activeVariantObj?.image || product.image;

  const priceSuffix = product.billingPeriod ? `/${product.billingPeriod}` : '';

  const handleDecrement = () => setQuantity(product.id, activeVariantId, quantity - 1);
  const handleIncrement = () => setQuantity(product.id, activeVariantId, quantity + 1);

  
  const priceRow = (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {!isPlanMode && (
        <QuantityStepper
          quantity={quantity}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          disabled={product.required}
        />
      )}
      {isPlanMode && (
        <span
          className={`w-[18px] h-[18px] rounded-full border-2 inline-block ${
            isSelected ? 'border-primary shadow-[inset_0_0_0_4px_var(--color-primary)]' : 'border-line'
          }`}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col items-end leading-tight">
        {product.compareAtPrice != null && (
          <span className="text-danger line-through text-xs">
            {formatCurrency(product.compareAtPrice)}{priceSuffix}
          </span>
        )}
        <span className="text-primary font-bold text-sm">
          {product.priceLabel ?? formatCurrency(product.price)}{priceSuffix}
        </span>
      </div>
    </div>
  );

  return (
    
    <div
      className={`relative flex flex-col h-full border-[1.5px] rounded-xl p-3 bg-white ${
        isSelected ? 'border-primary' : 'border-line'
      }`}
      onClick={isPlanMode ? () => selectPlan(product.id) : undefined}
      role={isPlanMode ? 'button' : undefined}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          {product.badge}
        </span>
      )}

      <div className="flex flex-col lg:flex-row gap-3 flex-1">
        {image && (
          <img
            className="w-[78px] h-[104px] rounded-[5px] object-cover mx-auto lg:mx-0 lg:w-[90px] lg:h-[122px] lg:shrink-0"
            src={image}
            alt={product.name}
          />
        )}

        <div className={`flex flex-col flex-1 ${isPlanMode && product.badge ? 'mt-6' : ''}`}>
          <h3 className="text-[15px] font-bold mb-0.5 flex items-center gap-1.5">
            {isPlanMode && <PlanBadgeIcon />}
            {product.name}
          </h3>

          <p className="text-xs text-muted leading-snug mb-2">
            {product.description}{' '}
            {product.learnMoreUrl && (
              <a
                href={product.learnMoreUrl}
                className="font-semibold underline whitespace-nowrap text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Learn More
              </a>
            )}
          </p>

          {!isPlanMode && (
            <VariantSelector
              variants={product.variants}
              activeVariantId={activeVariantId}
              onSelect={(variantId) => setActiveVariant(product.id, variantId)}
            />
          )}

          
          <div className="hidden lg:block mt-auto pt-2">{priceRow}</div>
        </div>
      </div>

      
      <div className="lg:hidden mt-auto pt-2">{priceRow}</div>
    </div>
  );
}
