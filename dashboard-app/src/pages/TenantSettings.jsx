import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function TenantSettings() {
    const [data, setData] = useState(null);
    const [form, setForm] = useState({});

    async function load() {
        const r = await api.get("/tenant/settings");
        setData(r.data);
        setForm(r.data.tenant);
    }

    useEffect(() => { load(); }, []);

    async function save() {
        await api.post("/tenant/settings/update", form);
        alert("Saved!");
        load();
    }

    async function upgrade(plan_id) {
        const r = await api.post("/tenant/settings/upgrade", { plan_id });
        window.location.href = r.data.pay_url;
    }

    async function resetPOS() {
        if (!confirm("Reset POS data?")) return;
        await api.post("/tenant/settings/reset-pos");
        alert("POS reset complete");
    }

    if (!data) return "Loading...";

    return (
        <div style={{ padding: 20 }}>
            <h2>Tenant Settings</h2>

            <label>Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>

            <label>Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>

            <label>Phone</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>

            <label>Logo URL</label>
            <input value={form.logo} onChange={e => setForm({...form, logo: e.target.value})}/>

            <button onClick={save}>Save</button>

            <hr />

            <h3>Current Plan: {data.plan.name}</h3>

            <button onClick={() => upgrade(2)}>Upgrade to PRO</button>
            <button onClick={() => upgrade(3)}>Upgrade to Enterprise</button>

            <hr />

            <button onClick={resetPOS} style={{ color: "red" }}>Reset POS Data</button>
        </div>
    );
}
