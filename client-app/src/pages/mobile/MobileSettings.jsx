import React from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Printer, Shield, ChevronRight } from "lucide-react";

export default function MobileSettings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm("Keluar dari aplikasi?")) {
            logout();
            navigate("/login");
        }
    };

    return (
        <div className="p-5 bg-gray-50 min-h-full pb-24">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Akun Saya</h1>

            {/* Profile Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <User size={28} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900">{user?.display_name || "Kasir"}</h2>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase">
                        {user?.role || "Staff"}
                    </span>
                </div>
            </div>

            {/* Settings Menu */}
            <div className="space-y-3">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b active:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Printer size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Koneksi Printer</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                    <div className="p-4 flex items-center justify-between active:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Shield size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Keamanan PIN</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full bg-white p-4 rounded-xl border border-red-100 text-red-600 font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
                >
                    <LogOut size={18} /> Keluar Aplikasi
                </button>
                
                <p className="text-center text-[10px] text-gray-400 mt-4">
                    TekraPOS Mobile v1.0.0
                </p>
            </div>
        </div>
    );
}