/**
 * @module store/receiptStore
 * @description Lightweight application state store for receipt drawer and
 * navigation state. Uses React context + useReducer pattern for predictable
 * state transitions without an external state management dependency.
 *
 * Architecture: store/ → context providers that wrap the app, consumed
 * by feature components via custom hooks (useReceipt).
 */

/**
 * Receipt store action types for the global receipt drawer.
 * Follows Flux/Redux action pattern for predictable state transitions.
 */
export type ReceiptAction =
  | { type: 'OPEN'; receiptId: string }
  | { type: 'CLOSE' }
  | { type: 'NAVIGATE'; receiptId: string };

/**
 * Receipt drawer state shape.
 */
export interface ReceiptState {
  /** Currently active receipt ID, or null if drawer is closed */
  activeReceiptId: string | null;
  /** Whether the receipt drawer sheet is open */
  isOpen: boolean;
  /** Navigation history for prev/next traversal */
  history: string[];
}

/**
 * Initial state for the receipt store.
 */
export const initialReceiptState: ReceiptState = {
  activeReceiptId: null,
  isOpen: false,
  history: [],
};

/**
 * Reducer function for receipt drawer state transitions.
 * Pure function — no side effects.
 */
export function receiptReducer(state: ReceiptState, action: ReceiptAction): ReceiptState {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        activeReceiptId: action.receiptId,
        isOpen: true,
        history: [...state.history, action.receiptId],
      };
    case 'CLOSE':
      return {
        ...state,
        activeReceiptId: null,
        isOpen: false,
      };
    case 'NAVIGATE':
      return {
        ...state,
        activeReceiptId: action.receiptId,
        history: [...state.history, action.receiptId],
      };
    default:
      return state;
  }
}
