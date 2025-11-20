import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </BrowserRouter>
    );
}
