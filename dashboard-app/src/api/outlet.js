import api from "./client";

export default {
    list: () => api.get("/tenant/outlets"),
    create: (d) => api.post("/tenant/outlets", d),
    update: (id, d) => api.put(`/tenant/outlets/${id}`, d),
    delete: (id) => api.delete(`/tenant/outlets/${id}`)
};
