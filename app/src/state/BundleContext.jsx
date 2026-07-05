import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import productData from '../data/products.json';

const BundleStateContext = createContext(null);
const BundleDispatchContext = createContext(null);

// A product with no color options still needs a key to store its quantity under.
const DEFAULT_VARIANT_KEY = 'default';

function variantKeyFor(product, variantId) {
  if (!product.variants || product.variants.length === 0) return DEFAULT_VARIANT_KEY;
  return variantId || product.defaultVariant || DEFAULT_VARIANT_KEY;
}

// Build the starting state directly from products.json's `initialQuantities`,
// so the app loads looking like the seeded design without any extra setup step.
function buildInitialState(data) {
  const selections = {};
  const activeVariant = {};
  let selectedPlanId = null;

  data.steps.forEach((step) => {
    step.products.forEach((product) => {
      selections[product.id] = { ...(product.initialQuantities || {}) };

      if (product.variants && product.variants.length > 0) {
        activeVariant[product.id] = product.defaultVariant || product.variants[0].id;
      } else {
        activeVariant[product.id] = null;
      }

      if (step.selectionType === 'single') {
        const hasInitialQty = Object.values(product.initialQuantities || {}).some((q) => q > 0);
        if (hasInitialQty) selectedPlanId = product.id;
      }
    });
  });

  return {
    openStep: data.steps[0]?.id ?? null,
    selections,
    activeVariant,
    selectedPlanId,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const { productId, variantKey, quantity } = action;
      const clamped = Math.max(0, quantity);
      return {
        ...state,
        selections: {
          ...state.selections,
          [productId]: {
            ...state.selections[productId],
            [variantKey]: clamped,
          },
        },
      };
    }

    case 'SET_ACTIVE_VARIANT': {
      const { productId, variantId } = action;
      return {
        ...state,
        activeVariant: {
          ...state.activeVariant,
          [productId]: variantId,
        },
      };
    }

    case 'SET_OPEN_STEP': {
      return { ...state, openStep: action.stepId };
    }

    case 'SELECT_PLAN': {
      return { ...state, selectedPlanId: action.productId };
    }

    case 'HYDRATE': {
      // Full restore from persisted storage - trust the saved shape as-is.
      return { ...state, ...action.state };
    }

    default:
      return state;
  }
}

export function BundleProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(reducer, initialState ?? buildInitialState(productData));

  return (
    <BundleStateContext.Provider value={state}>
      <BundleDispatchContext.Provider value={dispatch}>
        {children}
      </BundleDispatchContext.Provider>
    </BundleStateContext.Provider>
  );
}

export function useBundleState() {
  const ctx = useContext(BundleStateContext);
  if (!ctx) throw new Error('useBundleState must be used inside a BundleProvider');
  return ctx;
}

export function useBundleDispatch() {
  const ctx = useContext(BundleDispatchContext);
  if (!ctx) throw new Error('useBundleDispatch must be used inside a BundleProvider');
  return ctx;
}

// Flat lookup of every product by id, and its parent step - built once from the JSON.
export function useProductIndex() {
  return useMemo(() => {
    const byId = {};
    productData.steps.forEach((step) => {
      step.products.forEach((product) => {
        byId[product.id] = { product, step };
      });
    });
    return byId;
  }, []);
}

// The main hook components reach for. Wraps state + dispatch with the
// derived helpers everyone actually needs, so components don't touch the
// reducer shape directly.
export function useBundle() {
  const state = useBundleState();
  const dispatch = useBundleDispatch();
  const productIndex = useProductIndex();

  const getQuantity = useCallback(
    (productId, variantId) => {
      const { product } = productIndex[productId] || {};
      if (!product) return 0;
      const key = variantKeyFor(product, variantId);
      return state.selections[productId]?.[key] ?? 0;
    },
    [state.selections, productIndex]
  );

  const getActiveVariant = useCallback(
    (productId) => state.activeVariant[productId] ?? null,
    [state.activeVariant]
  );

  // Sum of every variant's quantity for a product - used for "is this card selected".
  const getProductTotalQuantity = useCallback(
    (productId) => {
      const qtys = state.selections[productId] || {};
      return Object.values(qtys).reduce((sum, q) => sum + q, 0);
    },
    [state.selections]
  );

  const setQuantity = useCallback(
    (productId, variantId, quantity) => {
      const { product } = productIndex[productId] || {};
      if (!product || product.required) return; // required products can't be edited
      const key = variantKeyFor(product, variantId);
      dispatch({ type: 'SET_QUANTITY', productId, variantKey: key, quantity });
    },
    [dispatch, productIndex]
  );

  const setActiveVariant = useCallback(
    (productId, variantId) => {
      dispatch({ type: 'SET_ACTIVE_VARIANT', productId, variantId });
    },
    [dispatch]
  );

  const setOpenStep = useCallback(
    (stepId) => dispatch({ type: 'SET_OPEN_STEP', stepId }),
    [dispatch]
  );

  const selectPlan = useCallback(
    (productId) => dispatch({ type: 'SELECT_PLAN', productId }),
    [dispatch]
  );

  // Number of distinct products with a positive quantity in a given step -
  // this is the "N selected" count shown in each step header.
  const getStepSelectedCount = useCallback(
    (step) => {
      if (step.selectionType === 'single') {
        return state.selectedPlanId ? 1 : 0;
      }
      return step.products.filter((p) => getProductTotalQuantity(p.id) > 0).length;
    },
    [state.selectedPlanId, getProductTotalQuantity]
  );

  return {
    state,
    dispatch,
    productIndex,
    steps: productData.steps,
    orderExtras: productData.orderExtras,
    getQuantity,
    getActiveVariant,
    getProductTotalQuantity,
    setQuantity,
    setActiveVariant,
    setOpenStep,
    selectPlan,
    getStepSelectedCount,
  };
}

export { buildInitialState, variantKeyFor, DEFAULT_VARIANT_KEY };
