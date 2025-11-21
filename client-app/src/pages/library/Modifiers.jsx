import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

export default function Modifiers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: '', price_adjustment: '0', type: 'add' });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const res = await api.get('/library/modifiers');
            setData(res.data.modifiers || []);
        } catch (error) {
            console.error('Failed to load modifiers:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await api.put(`/library/modifiers/${editData.id}`, formData);
            } else {
                await api.post('/library/modifiers', formData);
            }
            setShowModal(false);
            setFormData({ name: '', price_adjustment: '0', type: 'add' });
            setEditData(null);
            loadData();
        } catch (error) {
            alert('Gagal menyimpan data: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({
            name: item.name,
            price_adjustment: item.price_adjustment,
            type: item.type
        });
        setShowModal(true);
    };

    const handleDelete = async (item) => {
        if (confirm(`Hapus modifier "${item.name}"?`)) {
            try {
                await api.delete(`/library/modifiers/${item.id}`);
                loadData();
            } catch (error) {
                alert('Gagal menghapus: ' + error.message);
            }
        }
    };

    const columns = [
        { header: 'Nama Modifier', accessor: (item) => item.name || '-' },
        { header: 'Tipe', accessor: (item) => item.type === 'add' ? 'Tambahan' : 'Pengurangan' },
        { header: 'Penyesuaian Harga', accessor: (item) => `Rp ${parseInt(item.price_adjustment || 0).toLocaleString()}` }
    ];

    return (
        <div>
            <PageHeader title="Modifiers" subtitle="Kelola variasi produk (ukuran, topping, dll)" />
            <DataTable columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Cari modifier..." />

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); setFormData({ name: '', price_adjustment: '0', type: 'add' }); }} title={editData ? 'Edit Modifier' : 'Tambah Modifier'}>
                <form onSubmit={handleSubmit}>
                    <FormField label="Nama Modifier" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Contoh: Extra Shot, Large Size" />
                    <FormField label="Tipe" name="type" type="select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[{ value: 'add', label: 'Tambahan' }, { value: 'subtract', label: 'Pengurangan' }]} required />
                    <FormField label="Penyesuaian Harga" name="price_adjustment" type="number" value={formData.price_adjustment} onChange={(e) => setFormData({ ...formData, price_adjustment: e.target.value })} required placeholder="0" />
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" data-testid="cancel-button">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-testid="submit-button">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}