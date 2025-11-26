import React, { useState, useEffect } from "react";
import { Search, X, ChevronUp, Minus, Plus, Loader, PackageOpen } from "lucide-react";
import productsAPI from "../../api/products";
import ordersAPI from "../../api/orders";
import { useCart } from "../../store/cart";

export default function MobilePOS() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    
    const { items, add, remove, updateQty, total, clear } = useCart();

    // FETCH DATA PRODUK REAL
    useEffect(() => {
        productsAPI.list()
            .then(res => {
                setProducts(res.data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const cartTotal = total();
    const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

    // FUNGSI BAYAR (DATA REAL KE SERVER)
    const handlePay = async () => {
        if(items.length === 0) return;
        setIsPaying(true);
        try {
            const payload = {
                items: items,
                total: cartTotal,
                outlet_id: 1, // Default outlet (bisa diambil dari context user)
                payment_method: 'cash',
                amount_paid: cartTotal,
                status: 'completed'
            };
            await ordersAPI.create(payload);
            alert("Pembayaran Berhasil!");
            clear();
            setIsCartOpen(false);
        } catch (e) {
            alert("Gagal bayar: " + e.message);
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 relative">
            {/* Sticky Search Bar */}
            <div className="sticky top-0 bg-white px-5 py-3 shadow-sm z-10 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                        <Loader className="animate-spin mb-2 text-primary" /> Memuat Produk...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                        <PackageOpen size={40} className="mb-2 opacity-50"/> Produk tidak ditemukan
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(p => (
                            <div key={p.id} onClick={() => add(p)} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-transform flex flex-col">
                                <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden relative">
                                    {p.image_url ? (
                                        <img src={p.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xl select-none bg-gray-100">
                                            {p.name.charAt(0)}
                                        </div>
                                    )}
                                    {/* Badge Stok */}
                                    <div className="absolute top-1 right-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 border shadow-sm">
                                        Stok: {p.stock}
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-xs line-clamp-2 h-8 leading-snug">{p.name}</h3>
                                <p className="text-primary font-bold text-sm mt-auto">Rp {parseInt(p.price).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Cart Button */}
            {itemCount > 0 && (
                <div className="fixed bottom-20 left-4 right-4 z-30">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-primary text-white p-3 rounded-2xl shadow-xl shadow-primary/30 flex justify-between items-center animate-in slide-in-from-bottom-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10">
                                {itemCount}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] opacity-80 uppercase font-bold tracking-wide">Total Bayar</p>
                                <p className="font-bold text-lg leading-none">Rp {cartTotal.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">
                            Buka <ChevronUp size={14}/>
                        </div>
                    </button>
                </div>
            )}

            {/* Cart Modal (BottomSheet) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-t-3xl h-[80vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h2 className="font-bold text-lg">Pesanan ({itemCount})</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-primary text-xs font-bold">Rp {parseInt(item.price).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                                        <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : remove(item.id)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-90"><Minus size={14}/></button>
                                        <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                                        <button onClick={() => add(item)} className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded shadow-sm active:scale-90"><Plus size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 border-t bg-white pb-safe">
                            <div className="flex justify-between mb-4 text-sm">
                                <span className="text-gray-500 font-medium">Total Tagihan</span>
                                <span className="font-bold text-xl text-gray-900">Rp {cartTotal.toLocaleString()}</span>
                            </div>
                            <button 
                                onClick={handlePay}
                                disabled={isPaying}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isPaying ? <Loader className="animate-spin"/> : "Konfirmasi Bayar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}