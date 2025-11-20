import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import POSLayout from "./layouts/POSLayout";

// Pages
import Login from "./pages/Login";
import POSPage from "./pages/pos/POSPage";
import ProductList from "./pages/admin/ProductList";
import Dashboard from "./pages/admin/Dashboard";
import OutletList from "./pages/admin/OutletList";
import Settings from "./pages/admin/Settings";

function ProtectedRoute({ children }) {
    const user = useAuth((s) => s.user);
    // Jika belum login, lempar ke halaman login umum
    if (!user) return <Navigate to="/login" />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROUTE 1: LOGIN UMUM 
                    Bisa diakses di: dashboard.tekrabyte.id/login
                */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />

                {/* ROUTE 2: LOGIN SPESIFIK TENANT 
                    Contoh: dashboard.tekrabyte.id/kopikenangan/login
                */}
                <Route path="/:slug/login" element={<Login />} />

                {/* ROUTE 3: DASHBOARD ADMIN
                    Contoh: dashboard.tekrabyte.id/kopikenangan/dashboard 
                */}
                <Route path="/:slug/dashboard" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="outlets" element={<OutletList />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* ROUTE 4: MODE KASIR (POS)
                    Contoh: dashboard.tekrabyte.id/kopikenangan/pos
                */}
                <Route path="/:slug/pos" element={<ProtectedRoute><POSLayout /></ProtectedRoute>}>
                    <Route index element={<POSPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}