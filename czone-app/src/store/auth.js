import { create } from "zustand";

export const useAuth = create((set) => ({
    token: null,
    tenant: null,
    user: null,

    login: (token, tenant, user) =>
        set({ token, tenant, user }),

    logout: () => set({ token: null, tenant: null, user: null }),
}));
