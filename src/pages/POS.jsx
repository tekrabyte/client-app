import { db } from "../offline/db";

async function completeOrder() {
    const payload = {
        items: cart.items,
        total: cart.total(),
        outlet_id: outlet.id
    };

    if (!navigator.onLine) {
        await db.put("pending_orders", {
            local_id: Date.now(),
            payload
        });
        alert("Offline mode: Order saved locally");
        cart.clear();
        return;
    }

    await api.post("/orders/create", payload);
    cart.clear();
    alert("Order Completed!");
}
