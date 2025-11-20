import React, { useEffect, useState } from "react";
import api from "../api/outlet";

export default function Outlets() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ name: "" });

    async function load() {
        const res = await api.list();
        setList(res.data.outlets);
    }

    useEffect(() => { load(); }, []);

    async function save() {
        await api.create(form);
        load();
        setForm({ name: "" });
    }

    async function del(id) {
        if (!confirm("Delete this outlet?")) return;
        await api.delete(id);
        load();
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Outlets</h2>

            <input
                placeholder="Outlet Name"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
            />
            <button onClick={save}>Add</button>

            <ul>
                {list.map((o) => (
                    <li key={o.id} style={{ marginTop: 10 }}>
                        {o.name}
                        <button style={{ marginLeft: 10 }} onClick={() => del(o.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
