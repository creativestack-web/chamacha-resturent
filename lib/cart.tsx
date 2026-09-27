"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { site } from "@/data/site";
import type { FulfilmentType } from "./ordering";
import { track } from "./utils";

export type CartLine = { id: string; name: string; price: number; image: string; quantity: number };

type State = { lines: CartLine[]; fulfilment: FulfilmentType; areaIndex: number | null };

type Action =
  | { type: "add"; line: Omit<CartLine, "quantity">; quantity: number }
  | { type: "setQty"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "fulfilment"; value: FulfilmentType }
  | { type: "area"; index: number | null }
  | { type: "hydrate"; state: State };

const STORAGE_KEY = "chamcha.cart.v1";
const MAX_QTY = 50;

const initial: State = { lines: [], fulfilment: "delivery", areaIndex: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.id === action.line.id);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) => (l.id === action.line.id ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.quantity) } : l)),
        };
      }
      return { ...state, lines: [...state.lines, { ...action.line, quantity: Math.min(MAX_QTY, action.quantity) }] };
    }
    case "setQty":
      if (action.quantity <= 0) return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
      return { ...state, lines: state.lines.map((l) => (l.id === action.id ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l)) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { ...state, lines: [] };
    case "fulfilment":
      return { ...state, fulfilment: action.value };
    case "area":
      return { ...state, areaIndex: action.index };
    case "hydrate":
      return action.state;
  }
}

type CartContextValue = State & {
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQty: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setFulfilment: (value: FulfilmentType) => void;
  setArea: (index: number | null) => void;
  qtyOf: (id: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [isOpen, setOpen] = useState(false);
  const hydrated = useRef(false);

  // Restore cart from localStorage (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (Array.isArray(parsed.lines)) dispatch({ type: "hydrate", state: { ...initial, ...parsed } });
      }
    } catch {
      /* ignore corrupted storage */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = state.lines.reduce((n, l) => n + l.quantity * l.price, 0);
    const areas = site.ordering.deliveryAreas;
    const deliveryFee =
      state.fulfilment === "delivery" && count > 0
        ? state.areaIndex !== null && areas[state.areaIndex]
          ? areas[state.areaIndex].fee
          : site.ordering.defaultDeliveryFee
        : 0;
    return {
      ...state,
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (line, quantity = 1) => {
        dispatch({ type: "add", line, quantity });
        track("add_to_cart", { item_id: line.id, item_name: line.name, quantity, price: line.price });
      },
      setQty: (id, quantity) => dispatch({ type: "setQty", id, quantity }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
      setFulfilment: (v) => dispatch({ type: "fulfilment", value: v }),
      setArea: (i) => dispatch({ type: "area", index: i }),
      qtyOf: (id) => state.lines.find((l) => l.id === id)?.quantity ?? 0,
    };
  }, [state, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/* ─────────────────────────── Toasts ─────────────────────────── */

type Toast = { id: number; title: string; body?: string };
type ToastCtx = { toasts: Toast[]; notify: (title: string, body?: string) => void; dismiss: (id: number) => void };
const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback(
    (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-2), { id, title, body }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss]
  );
  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
