import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import POSLayout from "./layouts/POSLayout";

// Pages - Auth & POS
import Login from "./pages/Login";
import POSPage from "./pages/pos/POSPage";

// Pages - Admin
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import OutletList from "./pages/admin/OutletList";
import Settings from "./pages/admin/Settings";
import Billing from "./pages/settings/Billing";
import EmployeeList from "./pages/admin/EmployeeList";

// Pages - Reports
import SalesReport from "./pages/reports/SalesReport";
import TransactionsReport from "./pages/reports/TransactionsReport";
import InvoicesReport from "./pages/reports/InvoicesReport";
import ShiftReport from "./pages/reports/ShiftReport";

// Pages - Library
import Modifiers from "./pages/library/Modifiers";
import Categories from "./pages/library/Categories";
import Bundles from "./pages/library/Bundles";
import Promo from "./pages/library/Promo";
import Discounts from "./pages/library/Discounts";
import Taxes from "./pages/library/Taxes";
import Gratuity from "./pages/library/Gratuity";
import SalesType from "./pages/library/SalesType";
import Brands from "./pages/library/Brands";

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
                    Contoh: dashboard.tekrabyte.id/kopikenangan/ 
                */}
                <Route path="/:slug/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    {/* Dashboard */}
                    <Route index element={<Dashboard />} />
                    
                    {/* Reports */}
                    <Route path="reports/sales" element={<SalesReport />} />
                    <Route path="reports/transactions" element={<TransactionsReport />} />
                    <Route path="reports/invoices" element={<InvoicesReport />} />
                    <Route path="reports/shift" element={<ShiftReport />} />
                    
                    {/* Library */}
                    <Route path="products" element={<ProductList />} />
                    <Route path="library/modifiers" element={<Modifiers />} />
                    <Route path="library/categories" element={<Categories />} />
                    <Route path="library/bundles" element={<Bundles />} />
                    <Route path="library/promo" element={<Promo />} />
                    <Route path="library/discounts" element={<Discounts />} />
                    <Route path="library/taxes" element={<Taxes />} />
                    <Route path="library/gratuity" element={<Gratuity />} />
                    <Route path="library/sales-type" element={<SalesType />} />
                    <Route path="library/brands" element={<Brands />} />
                    
                    {/* Inventory - Placeholder routes (pages need to be created) */}
                    <Route path="inventory/summary" element={<div className="p-8"><h1 className="text-2xl font-bold">Inventory Summary</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="inventory/suppliers" element={<div className="p-8"><h1 className="text-2xl font-bold">Suppliers</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="inventory/po" element={<div className="p-8"><h1 className="text-2xl font-bold">Purchase Order</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="inventory/transfer" element={<div className="p-8"><h1 className="text-2xl font-bold">Transfer</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="inventory/adjustment" element={<div className="p-8"><h1 className="text-2xl font-bold">Adjustment</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Online Channels - Placeholder routes */}
                    <Route path="online/tekrapos" element={<div className="p-8"><h1 className="text-2xl font-bold">TekraPOS Order</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="online/gofood" element={<div className="p-8"><h1 className="text-2xl font-bold">Gofood</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Customers - Placeholder routes */}
                    <Route path="customers" element={<div className="p-8"><h1 className="text-2xl font-bold">Customers List</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="customers/feedback" element={<div className="p-8"><h1 className="text-2xl font-bold">Feedback</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="customers/loyalty" element={<div className="p-8"><h1 className="text-2xl font-bold">Loyalty Program</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Employees */}
                    <Route path="employees" element={<EmployeeList />} />
                    <Route path="employees/access" element={<div className="p-8"><h1 className="text-2xl font-bold">Employee Access</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="employees/pin" element={<div className="p-8"><h1 className="text-2xl font-bold">PIN Access</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Customer Display (CDS) - Placeholder routes */}
                    <Route path="cds/campaign" element={<div className="p-8"><h1 className="text-2xl font-bold">Campaign</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="cds/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">CDS Settings</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Table Management - Placeholder routes */}
                    <Route path="tables/group" element={<div className="p-8"><h1 className="text-2xl font-bold">Table Group</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="tables/map" element={<div className="p-8"><h1 className="text-2xl font-bold">Table Map</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="tables/report" element={<div className="p-8"><h1 className="text-2xl font-bold">Table Report</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Payments - Placeholder routes */}
                    <Route path="payments/qris" element={<div className="p-8"><h1 className="text-2xl font-bold">QRIS</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="payments/config" element={<div className="p-8"><h1 className="text-2xl font-bold">Payment Configuration</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    
                    {/* Account Settings */}
                    <Route path="settings/account" element={<Settings />} />
                    <Route path="settings/billing" element={<Billing />} />
                    <Route path="settings/outlets" element={<OutletList />} />
                    <Route path="settings/bank" element={<div className="p-8"><h1 className="text-2xl font-bold">Bank Account</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="settings/profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Public Profile</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="settings/receipt" element={<div className="p-8"><h1 className="text-2xl font-bold">Receipt</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="settings/checkout" element={<div className="p-8"><h1 className="text-2xl font-bold">Checkout</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="settings/inventory" element={<div className="p-8"><h1 className="text-2xl font-bold">Inventory Settings</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
                    <Route path="settings/email" element={<div className="p-8"><h1 className="text-2xl font-bold">Email Notification</h1><p className="mt-4">Halaman ini belum tersedia.</p></div>} />
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