import { useEffect } from 'react';
import { BundleProvider, useBundleDispatch } from './state/BundleContext';
import { loadSavedBundle } from './state/usePersistedBundle';
import StepAccordion from './components/StepAccordion';
import ReviewPanel from './components/ReviewPanel';

// Runs once on mount: if the shopper has a saved system from a previous
// visit, restore it silently so the page reload/return flow "just works".
function AutoRestore() {
  const dispatch = useBundleDispatch();

  useEffect(() => {
    const saved = loadSavedBundle();
    if (saved) {
      dispatch({ type: 'HYDRATE', state: saved });
    }
  }, [dispatch]);

  return null;
}

function BuilderLayout() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-5 text-center sm:hidden">Let's get started!</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5 items-start">
        <div className="order-1">
          <StepAccordion />
        </div>
        <div className="order-2 lg:sticky lg:top-5">
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BundleProvider>
      <AutoRestore />
      <BuilderLayout />
    </BundleProvider>
  );
}
