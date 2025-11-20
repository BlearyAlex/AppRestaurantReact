import { create } from 'zustand';

interface TableState {
    tableId: number | null;
    setTableId: (id: number | null) => void;
    clearTableId: () => void;
}

export const useOrderStore = create<TableState>((set) => ({
    tableId: null,
    setTableId: (id) => set({ tableId: id }),
    clearTableId: () => set({ tableId: null })
}));