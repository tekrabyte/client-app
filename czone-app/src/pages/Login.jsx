import React, { useState } from "react";
import { useAuth } from "../store/auth";
import api from "../api/client";

export default function Login() {
    const login = useAuth((s) => s.login);

    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [error, setErr] = useState(null);

    async function submit(e) {
        e.preventDefault();
        const res = await api.post("/auth/login", { email, password });

        if (!res.data.success) return setErr("Login gagal.");

        login(
            "token-demo",
            res.data.user.tenant,
            res.data.user
        );

        window.location.href = "/pos";
    }

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Login</h2>

            <form onSubmit={submit}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={e=>setPass(e.target.value)} placeholder="Password"/>
                <button>Login</button>
            </form>

            {error && <p style={{color:"red"}}>{error}</p>}
        </div>
    );
}
