import React, { useEffect, useState } from "react";
import api from "../../api/client";
import { Activity, Database, Server, Globe, AlertCircle, CheckCircle } from "lucide-react";

export default function SystemHealth() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkSystem();
    }, []);

    async function checkSystem() {
        setLoading(true);
        try {
            const res = await api.get("/system/health");
            setHealth(res.data.health);
        } catch (err) {
            setError("Gagal terhubung ke Backend API. Cek koneksi internet atau server.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Mendiagnosa sistem...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    // Komponen Kartu Status
    const StatusCard = ({ title, icon: Icon, status, message, detail }) => (
        <div className={`p-6 rounded-lg border shadow-sm ${status === 'ok' ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${status === 'ok' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">{title}</h3>
                </div>
                {status === 'ok' ? <CheckCircle className="text-green-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
            </div>
            <p className="text-gray-600 font-medium">{message}</p>
            {detail && <p className="text-xs text-gray-400 mt-2">{detail}</p>}
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Health Check</h1>
                    <p className="text-gray-500">Diagnosa koneksi dan integritas sistem.</p>
                </div>
                <button onClick={checkSystem} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Refresh Test
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Database */}
                <StatusCard 
                    title="Database Utama" 
                    icon={Database} 
                    status={health.database.status} 
                    message={health.database.message} 
                />

                {/* 2. Xendit Payment */}
                <StatusCard 
                    title="Koneksi Xendit" 
                    icon={Globe} 
                    status={health.xendit.status} 
                    message={health.xendit.message} 
                    detail={health.xendit.http_code ? `HTTP Response: ${health.xendit.http_code}` : ''}
                />

                {/* 3. Integritas Tabel */}
                <StatusCard 
                    title="Struktur Tabel SaaS" 
                    icon={Server} 
                    status={health.tables.status} 
                    message={health.tables.message} 
                    detail={health.tables.missing.length > 0 ? `Hilang: ${health.tables.missing.join(', ')}` : 'Semua tabel inti tersedia.'}
                />

                {/* 4. Latency & Server Info */}
                <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600"><Activity size={24} /></div>
                        <h3 className="font-bold text-gray-800">Performa Server</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">API Latency:</span>
                            <span className="font-mono font-bold text-blue-600">{health.latency}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">PHP Version:</span>
                            <span>{health.server.php_version}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">WP Version:</span>
                            <span>{health.server.wp_version}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">HTTPS:</span>
                            <span className={health.server.https === 'Yes' ? 'text-green-600' : 'text-red-500'}>{health.server.https}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}