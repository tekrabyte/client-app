import api from "./client";

export default {
    list() {
        return api.get("/tenant/products");
    },
    create(data) {
        return api.post("/tenant/products", data);
    },
    update(id, data) {
        return api.put(`/tenant/products/${id}`, data);
    },
    delete(id) {
        return api.delete(`/tenant/products/${id}`);
    }
};
