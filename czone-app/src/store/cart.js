import { create } from "zustand";

export const useCart = create((set, get) => ({
    items: [],

    add(product) {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === product.id);

        if (idx === -1) {
            items.push({ ...product, qty: 1 });
        } else {
            items[idx].qty++;
        }

        set({ items });
    },

    remove(id) {
        set({ items: get().items.filter((i) => i.id !== id) });
    },

    clear() {
        set({ items: [] });
    },

    total() {
        return get().items.reduce((a, b) => a + b.price * b.qty, 0);
    },
}));
