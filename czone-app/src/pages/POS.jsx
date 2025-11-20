import React, { useEffect } from "react";
import { useCart } from "../store/cart";
import { useAuth } from "../store/auth";
import productsAPI from "../api/products";

export default function POS() {
    const cart = useCart();
    const user = useAuth((s) => s.user);

    const [products, setProducts] = React.useState([]);

    useEffect(() => {
        async function load() {
            const r = await productsAPI.list();
            setProducts(r.data.products);
        }
        load();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>POS - {user?.display_name}</h2>

            <div style={{ display: "flex", gap: 20 }}>
                <div style={{ flex: 2 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 10,
                        }}
                    >
                        {products.map((p) => (
                            <div
                                key={p.id}
                                style={{
                                    padding: 10,
                                    border: "1px solid #ccc",
                                    cursor: "pointer",
                                }}
                                onClick={() => cart.add(p)}
                            >
                                <strong>{p.name}</strong>
                                <br />
                                Rp{p.price}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h3>Cart</h3>

                    {cart.items.map((i) => (
                        <div key={i.id}>
                            {i.name} x {i.qty} = Rp{i.qty * i.price}
                        </div>
                    ))}

                    <h3>Total: Rp{cart.total()}</h3>

                    <button
                        onClick={() => alert("Payment Done")}
                        style={{ padding: 15, marginTop: 20 }}
                    >
                        Complete Order
                    </button>
                </div>
            </div>
        </div>
    );
}
