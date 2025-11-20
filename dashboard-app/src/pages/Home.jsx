import React, { useEffect, useState } from "react";
import api from "../api/tenant";

export default function Home() {
    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await api.get();
            setTenant(res.data.tenant);
        }
        load();
    }, []);

    if (!tenant) return "Loading...";

    return (
        <div style={{ padding: 20 }}>
            <h2>Welcome, {tenant.name}</h2>
            <p>Status: {tenant.status}</p>
            <p>Plan: {tenant.plan_id}</p>
        </div>
    );
}
