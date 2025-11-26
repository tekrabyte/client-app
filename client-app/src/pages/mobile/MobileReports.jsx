import React, { useState, useEffect } from "react";
import api from "../../api/client";
import { Calendar, ArrowDown, ArrowUp, TrendingUp, Loader } from "lucide-react";

export default function MobileReports() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ total: 0, count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            // FETCH DATA ORDER HARI INI
            const res = await api.get('/tenant/orders', { params: { start_date: today, end_date: today } });
            
            const orders = res.data.orders || [];
            setTransactions(orders);
            
            const total = orders.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
            setSummary({ total, count: orders.length });

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-50 min-h-full pb-24">
            <div className="bg-white p-5 border-b sticky top-0 z-10 shadow-sm">
                <h1 className="text-lg font-bold text-gray-800">Laporan Harian</h1>
                <p className="text-xs text-gray-500">Ringkasan transaksi hari ini</p>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                        <TrendingUp size={16} />
                        <span className="text-xs font-bold">Pendapatan</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">Rp {summary.total.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Calendar size={16} />
                        <span className="text-xs font-bold">Transaksi</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{summary.count}</p>
                </div>
            </div>

            <div className="bg-white mt-2 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-[50vh] p-5">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Riwayat Transaksi</h3>
                
                {loading ? (
                    <div className="text-center py-10 text-gray-400 text-xs"><Loader className="animate-spin inline mr-2"/> Memuat data...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs">Belum ada transaksi hari ini.</div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {tx.status === 'completed' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm truncate w-32">{tx.customer_name || "Umum"}</p>
                                        <p className="text-[10px] text-gray-400">#{tx.order_number.slice(-6)} • {new Date(tx.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-sm ${tx.status === 'completed' ? 'text-green-600' : 'text-gray-400 line-through'}`}>
                                        +Rp {parseFloat(tx.total).toLocaleString('id-ID')}
                                    </p>
                                    <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase font-bold tracking-wide">{tx.payment_method}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}