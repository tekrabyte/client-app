import React, { useEffect, useState } from "react";
import api from "../../api/client";
import { 
    CreditCard, Clock, CheckCircle, AlertTriangle, 
    Package, History, Download, Zap 
} from "lucide-react";

export default function Billing() {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            // 1. Ambil Info Billing User (Subscription + History)
            const billRes = await api.get("/billing/info");
            
            // 2. Ambil Daftar Semua Paket dari API (Untuk Upgrade Dinamis)
            const plansRes = await api.get("/plans");

            setSubscription(billRes.data.subscription);
            setCurrentPlan(billRes.data.plan);
            setInvoices(billRes.data.invoices || []);
            
            // Handle format array
            const plansData = Array.isArray(plansRes.data.plans) ? plansRes.data.plans : plansRes.data;
            setAvailablePlans(plansData);

        } catch (error) {
            console.error("Gagal memuat data billing:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpgrade(plan) {
        if (!confirm(`Buat tagihan untuk paket ${plan.name} seharga Rp ${parseInt(plan.price_month).toLocaleString()}?`)) return;

        setProcessing(plan.id);
        try {
            const res = await api.post("/billing/create-invoice", { 
                plan_id: plan.id,
                amount: plan.price_month 
            });

            if (res.data.success && res.data.pay_url) {
                // Buka Xendit di tab baru
                window.open(res.data.pay_url, "_blank");
                // Refresh data setelah 3 detik
                setTimeout(loadData, 3000);
            } else {
                alert("Gagal membuat invoice. Silakan coba lagi.");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan koneksi.");
        } finally {
            setProcessing(null);
        }
    }

    // Helper hitung sisa hari
    const getDaysLeft = () => {
        if (!subscription?.expires_at) return 0;
        const expires = new Date(subscription.expires_at);
        const now = new Date();
        const diff = expires - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat informasi langganan...</div>;
    if (!currentPlan) return <div className="p-8 text-center text-red-500">Gagal memuat data. Silakan refresh.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            
            {/* --- BAGIAN 1: STATUS LANGGANAN SAAT INI --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <CreditCard size={200} className="text-blue-600" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Paket Aktif</h2>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{currentPlan.name || "Unknown Plan"}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    subscription?.status === 'active' ? 'bg-green-100 text-green-700' : 
                                    subscription?.status === 'trial' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {subscription?.status}
                                </span>
                            </div>
                        </div>
                        
                        {/* Info Sisa Waktu */}
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-2">
                                <Clock size={16} /> Berakhir pada
                            </div>
                            <div className="font-mono font-medium text-gray-700">
                                {subscription?.expires_at ? new Date(subscription.expires_at).toLocaleDateString('id-ID', { dateStyle: 'full' }) : '-'}
                            </div>
                            <div className={`mt-1 text-sm font-bold ${getDaysLeft() < 3 ? 'text-red-600' : 'text-green-600'}`}>
                                {getDaysLeft() > 0 ? `${getDaysLeft()} Hari Lagi` : 'Sudah Berakhir'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BAGIAN 2: PILIHAN UPGRADE (Dinamis dari API) --- */}
            <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={20} /> Pilihan Upgrade
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availablePlans.map(plan => {
                        const isCurrent = parseInt(plan.id) === parseInt(currentPlan?.id);
                        const price = parseInt(plan.price_month);
                        const features = JSON.parse(plan.features || '{}');
                        
                        // Skip plan gratis jika user sudah bayar (opsional)
                        if (price === 0 && parseInt(currentPlan?.price_month) > 0) return null;

                        return (
                            <div key={plan.id} className={`border rounded-xl p-6 flex flex-col transition-all ${
                                isCurrent 
                                ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' 
                                : 'border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1'
                            }`}>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                                        {isCurrent && <CheckCircle className="text-blue-600" size={20} />}
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-2xl font-bold text-gray-800">
                                            {price === 0 ? "GRATIS" : "Rp " + price.toLocaleString('id-ID')}
                                        </span>
                                        {price > 0 && <span className="text-gray-500 text-sm"> /bln</span>}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={12} /></div>
                                        <span><b>{features.multi_outlet || 1}</b> Outlet Cabang</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={12} /></div>
                                        <span><b>{features.multi_user || 1}</b> Akun Karyawan</span>
                                    </li>
                                </ul>

                                <button 
                                    onClick={() => handleUpgrade(plan)}
                                    disabled={isCurrent || processing || price === 0}
                                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                                        isCurrent 
                                            ? 'bg-gray-200 text-gray-500 cursor-default' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                    }`}
                                >
                                    {processing === plan.id ? 'Memproses...' : (
                                        isCurrent ? 'Paket Saat Ini' : (price === 0 ? 'Paket Dasar' : 'Pilih Paket Ini')
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- BAGIAN 3: RIWAYAT INVOICE --- */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <History size={20} /> Riwayat Pembayaran
                </h3>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">ID Invoice</th>
                                <th className="px-6 py-4">Nominal</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Belum ada riwayat pembayaran.</td>
                                </tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(inv.created_at).toLocaleDateString('id-ID')}
                                            <div className="text-xs text-gray-400">{new Date(inv.created_at).toLocaleTimeString('id-ID')}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{inv.invoice_id || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            Rp {parseInt(inv.amount).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {inv.status === 'paid' && <CheckCircle size={12} className="mr-1"/>}
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {inv.status === 'pending' && (
                                                <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Bayar Sekarang</a>
                                            )}
                                            {inv.status === 'paid' && (
                                                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 ml-auto text-sm">
                                                    <Download size={14} /> Kwitansi
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}