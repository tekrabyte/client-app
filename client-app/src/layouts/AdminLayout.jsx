import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Store } from "lucide-react";

export default function AdminLayout() {
    const { tenant, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold">{tenant?.name || "Dashboard"}</h2>
                    <span className="text-xs text-gray-400 uppercase">{tenant?.plan_id === '3' ? 'Enterprise' : 'Basic'} Plan</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
                        <LayoutDashboard size={20} /> Overview
                    </Link>
                    <Link to="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
                        <ShoppingBag size={20} /> Products
                    </Link>
                    <Link to="/pos" className="flex items-center gap-3 px-4 py-3 text-green-400 hover:bg-gray-800 rounded mt-4 font-bold">
                        <Store size={20} /> Buka Kasir (POS)
                    </Link>
                    <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
                        <Settings size={20} /> Settings
                    </Link>
                    <Link to="/dashboard/outlets" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
    <Store size={20} /> Outlets
</Link>
<Link to="/dashboard/employees" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
    <Users size={20} /> Karyawan
</Link>
<Link to="/dashboard/billing" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded">
    <CreditCard size={20} /> Billing
</Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}