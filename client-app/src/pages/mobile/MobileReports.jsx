import React, { useState, useEffect } from "react";
import api from "../../api/client";
import { Calendar, ChevronRight, TrendingUp, Wallet, Clock } from "lucide-react";

export default function MobileReports() {
    const [summary, setSummary] = useState({ sales: 0, cash: 0, tx_count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            // Menggunakan endpoint dashboard untuk ringkasan cepat
            const res = await api.get("/dashboard/sales", { params: { period: 'today' } });
            if (res.data && res.data.summary) {
                setSummary({
                    sales: res.data.summary.revenue || 0,
                    tx_count: res.data.summary.orders || 0,
                    cash: (res.data.summary.revenue || 0) // Asumsi semua cash sementara
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const formatRp = (val) => `Rp ${parseInt(val).toLocaleString('id-ID')}`;

    return (
        <div className="p-5 bg-gray-50 min-h-full pb-24">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Laporan Hari Ini</h1>

            {/* Summary Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-xs font-bold uppercase">Total Penjualan</span>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">Live</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">{loading ? "..." : formatRp(summary.sales)}</h2>
                <p className="text-xs text-gray-400">{summary.tx_count} Transaksi berhasil</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center mb-2 shadow-sm text-blue-600">
                        <Wallet size={16} />
                    </div>
                    <p className="text-xs text-gray-500">Uang Tunai</p>
                    <p className="font-bold text-gray-800 text-sm">{formatRp(summary.sales)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center mb-2 shadow-sm text-purple-600">
                        <Clock size={16} />
                    </div>
                    <p className="text-xs text-gray-500">Shift Aktif</p>
                    <p className="font-bold text-gray-800 text-sm">08:00 - Now</p>
                </div>
            </div>

            {/* Menu List */}
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Detail Laporan</h3>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {[
                    { label: "Riwayat Transaksi", icon: Calendar, color: "text-blue-600" },
                    { label: "Rekap Produk Terlaris", icon: TrendingUp, color: "text-orange-600" },
                ].map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between border-b last:border-0 active:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={item.color} />
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
}