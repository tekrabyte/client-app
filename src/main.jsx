import { syncPendingOrders } from "./offline/sync-worker";

setInterval(() => {
    if (navigator.onLine) syncPendingOrders();
}, 5000);
