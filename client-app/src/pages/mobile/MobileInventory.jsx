import React, { useState, useEffect } from "react";
import api from "../../api/client";
import { Search, Package, AlertTriangle, Loader } from "lucide-react";

export default function MobileInventory() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // FETCH DATA INVENTORY REAL
        api.get("/tenant/products").then(res => {
            setProducts(res.data.products || []);
            setLoading(false);
        });
    }, []);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-gray-50 min-h-full pb-24">
            <div className="bg-white p-5 border-b sticky top-0 z-10">
                <h1 className="text-lg font-bold text-gray-800 mb-3">Cek Stok Barang</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        className="w-full bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Cari nama produk..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-5 space-y-3">
                {loading ? <div className="text-center text-gray-400 text-xs flex justify-center gap-2"><Loader className="animate-spin" size={16}/> Memuat data...</div> : 
                filtered.map(p => (
                    <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {p.image_url ? (
                                <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><Package size={18}/></div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h4>
                                <p className="text-[10px] text-gray-500">SKU: {p.sku || "-"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${parseInt(p.stock) <= 5 ? 'text-red-600' : 'text-primary'}`}>
                                {p.stock}
                            </p>
                            {parseInt(p.stock) <= 5 && <div className="flex items-center justify-end gap-1 text-[10px] text-red-500 font-medium"><AlertTriangle size={10}/> Menipis</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}