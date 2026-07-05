import { useBundle } from '../state/BundleContext';
import StepHeader from './StepHeader';
import ProductCard from './ProductCard';

export default function StepAccordion() {
  const { steps, state, setOpenStep, getStepSelectedCount } = useBundle();

  return (
    <div className="border-t border-line">
      {steps.map((step, index) => {
        const isOpen = state.openStep === step.id;
        const nextStep = steps[index + 1];

        return (
          <div
            key={step.id}
            className={`border-b border-line ${isOpen ? 'bg-review rounded-2xl -mx-4 px-4 border-none' : ''}`}
          >
            <StepHeader
              step={step}
              selectedCount={getStepSelectedCount(step)}
              isOpen={isOpen}
              onToggle={() => setOpenStep(isOpen ? null : step.id)}
            />

            {isOpen && (
              <div className="pb-5">
                <div
                  className={`grid gap-3 mb-4 ${
                    step.selectionType === 'single'
                      ? 'grid-cols-1'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2'
                  }`}
                >
                  {step.products.map((product) => (
                    <ProductCard key={product.id} product={product} step={step} />
                  ))}
                </div>

                {nextStep && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-[39px] px-6 py-[5px] gap-2.5 border border-[#4E2FD2] text-primary bg-transparent rounded-[7px] cursor-pointer hover:bg-primary/5 text-[18px] leading-6 tracking-normal"
                      style={{ fontFamily: '"Gilroy-SemiBold", "Gilroy", sans-serif', fontWeight: 600 }}
                      onClick={() => setOpenStep(nextStep.id)}
                    >
                      Next: {nextStep.title}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
