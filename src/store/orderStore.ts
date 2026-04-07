import { create } from 'zustand';

interface TakeAwayFields {
    deliveryAddress: string;
    estimatedDeliveryTime: string; // "HH:mm"
}

interface CounterFields {
    ticketNumber: string;
    counterNumber: number | null;
}

interface OrderState {
    tableId: number | null;
    setTableId: (id: number | null) => void;
    clearTableId: () => void;

    takeAway: TakeAwayFields;
    setTakeAwayField: <K extends keyof TakeAwayFields>(key: K, value: TakeAwayFields[K]) => void;
    clearTakeAway: () => void;

    counter: CounterFields;
    setCounterField: <K extends keyof CounterFields>(key: K, value: CounterFields[K]) => void;
    resetCounter: () => void;

    // Shared
    clearAll: () => void;
}

const defaultTakeAway: TakeAwayFields = {
    deliveryAddress: '',
    estimatedDeliveryTime: '',
};

const defaultCounter: CounterFields = {
    ticketNumber: '',
    counterNumber: null,
};

export const useOrderStore = create<OrderState>((set) => ({
    // Mesa
    tableId: null,
    setTableId: (id) => set({ tableId: id }),
    clearTableId: () => set({ tableId: null }),

    // TakeAway
    takeAway: { ...defaultTakeAway },
    setTakeAwayField: (key, value) =>
        set((state) => ({ takeAway: { ...state.takeAway, [key]: value } })),
    clearTakeAway: () => set({ takeAway: { ...defaultTakeAway } }),

    // OrdersCounter
    counter: { ...defaultCounter },
    setCounterField: (key, value) =>
        set((state) => ({ counter: { ...state.counter, [key]: value } })),
    resetCounter: () => set({ counter: { ...defaultCounter } }),

    // Shared
    clearAll: () =>
        set({
            tableId: null,
            takeAway: { ...defaultTakeAway },
            counter: { ...defaultCounter },
        }),
}));