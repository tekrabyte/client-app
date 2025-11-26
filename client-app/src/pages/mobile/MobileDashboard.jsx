import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import api from "../../api/client";
import { Link, useParams } from "react-router-dom";
import { 
    Wallet, Bell, ArrowUpRight, Package, Users, 
    Settings, Printer, Percent, FileBarChart, 
    History, CreditCard, Loader 
} from "lucide-react";

export default function MobileDashboard() {
    const { user } = useAuth();
    const { slug } = useParams();
    const [stats, setStats] = useState({ revenue: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                // FETCH DATA REAL: Omset Hari Ini
                const res = await api.get("/dashboard/sales", { params: { period: 'today' } });
                if (res.data?.summary) {
                    setStats(res.data.summary);
                }
            } catch (e) {
                console.error("Gagal load dashboard", e);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const shortcuts = [
        { icon: Package, label: "Produk", color: "bg-orange-100 text-orange-600", link: `/${slug}/mobile/inventory` },
        { icon: Users, label: "Pelanggan", color: "bg-blue-100 text-blue-600", link: `/${slug}/customers` },
        { icon: History, label: "Riwayat", color: "bg-purple-100 text-purple-600", link: `/${slug}/mobile/reports` },
        { icon: Percent, label: "Promo", color: "bg-red-100 text-red-600", link: `/${slug}/library/promo` },
        { icon: CreditCard, label: "Bayar", color: "bg-teal-100 text-teal-600", link: `/${slug}/payments/config` },
        { icon: Printer, label: "Printer", color: "bg-gray-100 text-gray-600", link: `/${slug}/mobile/settings` },
        { icon: FileBarChart, label: "Laporan", color: "bg-indigo-100 text-indigo-600", link: `/${slug}/mobile/reports` },
        { icon: Settings, label: "Akun", color: "bg-gray-100 text-gray-600", link: `/${slug}/mobile/settings` },
    ];

    return (
        <div className="pb-10 bg-white min-h-full">
            {/* Header Gradient dengan Warna Custom */}
            <div className="bg-gradient-to-b from-primary to-primary-dark p-5 pt-8 pb-16 rounded-b-[35px] shadow-md text-white relative">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-blue-100 text-xs">Halo, Semangat Bekerja!</p>
                        <h1 className="text-lg font-bold">{user?.display_name || "Kasir"}</h1>
                    </div>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full relative hover:bg-white/30">
                        <Bell size={20} />
                    </button>
                </div>

                {/* Card Omset */}
                <div className="bg-white text-gray-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2 absolute -bottom-12 left-5 right-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Omset Hari Ini</p>
                            {loading ? <Loader size={20} className="animate-spin text-primary"/> : (
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Rp {parseInt(stats.revenue || 0).toLocaleString('id-ID')}
                                </h2>
                            )}
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="border-t border-dashed border-gray-200 mt-2 pt-2">
                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit text-xs font-bold">
                            <ArrowUpRight size={14}/> <span>{stats.orders || 0} Transaksi Berhasil</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Shortcuts */}
            <div className="px-5 mt-20">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Menu Cepat</h3>
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {shortcuts.map((item, idx) => (
                        <Link key={idx} to={item.link} className="flex flex-col items-center gap-2 active:opacity-70">
                            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                <item.icon size={20} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-600 text-center">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}