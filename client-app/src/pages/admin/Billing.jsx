import React, { useEffect, useState } from "react";
import api from "../../api/client";

export default function Billing() {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/billing/info?tenant=" + JSON.parse(localStorage.getItem('erpos_auth')).state.tenant.id)
           .then(res => setInfo(res.data))
           .finally(() => setLoading(false));
    }, []);

    async function handleUpgrade(planId) {
        try {
            const res = await api.post("/billing/create-invoice", { plan_id: planId, amount: planId === 2 ? 79000 : 149000 });
            if (res.data.pay_url) {
                window.open(res.data.pay_url, '_blank');
            }
        } catch (e) {
            alert("Gagal membuat invoice");
        }
    }

    if (loading) return <div className="p-6">Memuat data billing...</div>;

    const planName = info?.plan?.name || 'Unknown';
    const status = info?.subscription?.status || 'inactive';
    const expires = info?.subscription?.expires_at || '-';

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Langganan & Billing</h1>

            <div className="bg-white p-6 rounded shadow mb-8 border-l-4 border-blue-500">
                <h2 className="text-lg font-bold text-gray-700">Paket Saat Ini</h2>
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-3xl font-bold text-blue-600">{planName}</p>
                        <p className="text-gray-500 mt-1">Status: <span className="font-bold uppercase">{status}</span></p>
                        <p className="text-gray-500">Berakhir pada: {expires}</p>
                    </div>
                    {planName !== 'Enterprise' && (
                        <button onClick={() => handleUpgrade(3)} className="bg-orange-500 text-white px-6 py-3 rounded font-bold hover:bg-orange-600">
                            Upgrade ke Enterprise
                        </button>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Riwayat Invoice</h3>
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-50 text-left">
                        <th className="p-3">ID Invoice</th>
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Jumlah</th>
                        <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {(info?.invoices || []).map(inv => (
                        <tr key={inv.id} className="border-t">
                            <td className="p-3 text-sm font-mono">{inv.invoice_id}</td>
                            <td className="p-3">{inv.created_at}</td>
                            <td className="p-3">Rp {parseInt(inv.amount).toLocaleString()}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {inv.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}