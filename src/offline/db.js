import { openDB } from 'idb';

export const db = await openDB("tekra_pos_db", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("products")) {
            db.createObjectStore("products", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("pending_orders")) {
            db.createObjectStore("pending_orders", { keyPath: "local_id" });
        }
    }
});
