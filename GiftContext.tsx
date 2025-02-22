// context/GiftContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Product, GiftOption } from '../data/products';

// 1. تعريف أنواع البيانات
type GiftStep = 'chocolates' | 'candies' | 'box' | 'decorations' | 'wrap' | 'summary';

type GiftCartItem = {
  id: string;
  type: 'product' | 'gift';
  quantity: number;
  data: Product | GiftOption;
};

type GiftState = {
  cart: GiftCartItem[];
  selectedBox: GiftOption | null;
  selectedWrap: GiftOption | null;
  currentStep: GiftStep;
};

type GiftAction =
  | { type: 'ADD_TO_CART'; payload: Product | GiftOption }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SELECT_BOX'; payload: GiftOption }
  | { type: 'SELECT_WRAP'; payload: GiftOption }
  | { type: 'CHANGE_STEP'; payload: GiftStep };

// 2. تعريف الثوابت
const GIFT_STATE_KEY = 'giftState';

// 3. الحالة الابتدائية
const getInitialState = (): GiftState => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem(GIFT_STATE_KEY);
    return savedState
      ? JSON.parse(savedState)
      : {
        cart: [],
        selectedBox: null,
        selectedWrap: null,
        currentStep: 'chocolates',
      };
  }
  return {
    cart: [],
    selectedBox: null,
    selectedWrap: null,
    currentStep: 'chocolates',
  };
};

// 4. Reducer function
function giftReducer(state: GiftState, action: GiftAction): GiftState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.data.id === action.payload.id);
      return {
        ...state,
        cart: existingItem
          ? state.cart.map(item =>
            item.data.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          : [
            ...state.cart,
            {
              id: `item-${Date.now()}-${action.payload.id}`,
              type: 'price' in action.payload ? 'product' : 'gift',
              quantity: 1,
              data: action.payload,
            },
          ],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'SELECT_BOX':
      return { ...state, selectedBox: action.payload };

    case 'SELECT_WRAP':
      return { ...state, selectedWrap: action.payload };

    case 'CHANGE_STEP':
      return { ...state, currentStep: action.payload };

    default:
      return state;
  }
}

// 5. حفظ الحالة في localStorage
const useLocalStorage = (reducer: typeof giftReducer, initialState: GiftState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GIFT_STATE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return [state, dispatch] as const;
};

// 6. إنشاء السياق
const GiftContext = createContext<{
  state: GiftState;
  dispatch: React.Dispatch<GiftAction>;
}>({
  state: getInitialState(),
  dispatch: () => null,
});

// 7. Provider component
export const GiftProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useLocalStorage(giftReducer, getInitialState());

  // تزامن localStorage عند التحميل الأولي (للحالات التي قد تتغير فيها بنية البيانات)
  useEffect(() => {
    const savedState = localStorage.getItem(GIFT_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // قم بتحديث الحالة فقط إذا كانت مختلفة عن الحالة الحالية
        if (JSON.stringify(parsedState) !== JSON.stringify(state)) {
          dispatch({ type: 'CHANGE_STEP', payload: parsedState.currentStep });
        }
      } catch (error) {
        console.error("Failed to parse giftState from localStorage:", error);
        // إذا فشل التحليل، يمكنك إعادة تهيئة الحالة
        dispatch({ type: 'CHANGE_STEP', payload: 'chocolates' });
      }
    }
  }, [dispatch, state]); // تأكد من تضمين dispatch و state في قائمة الاعتماديات

  // استخدام useCallback لتغليف dispatch لتقليل عمليات إعادة العرض غير الضرورية
  const memoizedDispatch = useCallback(dispatch, []);

  return (
    <GiftContext.Provider value={{ state, dispatch: memoizedDispatch }}>
      {children}
    </GiftContext.Provider>
  );
};

// 8. Custom hook للاستخدام
export const useGift = () => {
  const context = useContext(GiftContext);
  if (!context) {
    throw new Error('useGift must be used within a GiftProvider');
  }
  return context;
};