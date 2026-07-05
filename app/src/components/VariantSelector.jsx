
export default function VariantSelector({ variants, activeVariantId, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Choose a color">
      {variants.map((variant) => {
        const isActive = activeVariantId === variant.id;
        return (
          <button
            key={variant.id}
            type="button"
            className={`inline-flex items-center gap-1.5 w-[65px] h-[26px] shrink-0 rounded-[2px] border-[0.5px] pt-[1px] pr-[3px] pb-[1px] pl-[3px] text-ink cursor-pointer transition-colors ${
              isActive ? 'border-[#0AA288] bg-[#1DF0BB]/[0.04]' : 'border-line bg-white'
            }`}
            onClick={() => onSelect(variant.id)}
          >
            {variant.image ? (
              <img
                src={variant.image}
                alt={variant.label}
                className="w-5 h-5 rounded-[5px] object-cover shrink-0 border border-black/10 bg-white"
              />
            ) : (
              <span
                className="w-4 h-4 rounded-[5px] border border-black/15 inline-block shrink-0"
                style={{ backgroundColor: variant.swatch }}
              />
            )}
            <span
              className="text-[10px] leading-none tracking-[0.6px] font-medium truncate"
              style={{ fontFamily: '"Gilroy-Medium", "Gilroy", sans-serif' }}
            >
              {variant.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
