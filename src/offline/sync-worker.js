import { db } from "./db";
import api from "../api/client";

export async function syncPendingOrders() {
    const tx = db.transaction("pending_orders", "readwrite");
    const store = tx.objectStore("pending_orders");
    const all = await store.getAll();

    for (let order of all) {
        try {
            const res = await api.post("/orders/create", order.payload);
            await store.delete(order.local_id);
        } catch (e) {
            console.log("Still offline, retry later");
        }
    }
}
