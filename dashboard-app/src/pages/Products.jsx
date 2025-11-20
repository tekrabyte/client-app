import React, { useEffect, useState } from "react";
import api from "../api/products";

export default function Products() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", sku: "" });

    async function load() {
        const res = await api.list();
        setItems(res.data.products);
    }

    useEffect(() => { load(); }, []);

    async function save() {
        if (!form.name) return alert("Name required");

        await api.create(form);
        load();
        setForm({ name: "", price: "", sku: "" });
    }

    async function del(id) {
        if (!confirm("Delete product?")) return;
        await api.delete(id);
        load();
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Products</h2>

            <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}/>
                <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}/>
                <button onClick={save}>Add</button>
            </div>

            <table border="1" width="100%" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((p) => (
                        <tr key={p.id}>
                            <td>{p.sku}</td>
                            <td>{p.name}</td>
                            <td>Rp{p.price}</td>
                            <td>
                                <button onClick={() => del(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
