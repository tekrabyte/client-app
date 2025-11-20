import React, { useEffect, useState } from "react";
import productsAPI from "../../api/products";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    
    useEffect(() => { load(); }, []);

    async function load() {
        const res = await productsAPI.list();
        setProducts(res.data.products);
    }

    async function handleAdd() {
        const name = prompt("Nama Produk:");
        if(!name) return;
        const price = prompt("Harga:", "0");
        
        await productsAPI.create({ 
            name, 
            price: parseInt(price), 
            sku: 'SKU-'+Date.now(),
            stock: 100 
        });
        load();
    }

    async function handleDel(id) {
        if(confirm("Hapus?")) {
            await productsAPI.delete(id);
            load();
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daftar Produk</h1>
                <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Tambah Produk
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Nama</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Harga</th>
                            <th className="p-4">Stok</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4 text-gray-500">{p.sku}</td>
                                <td className="p-4">Rp {parseInt(p.price).toLocaleString()}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDel(p.id)} className="text-red-500 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}