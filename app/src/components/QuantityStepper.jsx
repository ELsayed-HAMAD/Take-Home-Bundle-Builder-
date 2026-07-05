
export default function QuantityStepper({ quantity, onDecrement, onIncrement, disabled = false, size = 'md' }) {
  const isSm = size === 'sm';
  const btnSize = isSm ? 'w-[26px] h-[26px] text-[13px]' : 'w-[30px] h-[30px] text-base';
  const valueSize = isSm ? 'min-w-[26px] h-[26px] text-[13px]' : 'min-w-[30px] h-[30px] text-sm';
  const valueBg = isSm ? 'bg-review' : 'bg-white';

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        className={`${btnSize} bg-white border border-line rounded-md leading-none text-ink disabled:text-muted disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
        onClick={onDecrement}
        disabled={disabled || quantity <= 0}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span
        className={`${valueSize} ${valueBg} border border-line rounded-md inline-flex items-center justify-center font-bold text-ink`}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        className={`${btnSize} bg-white border border-line rounded-md leading-none text-ink disabled:text-muted disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
