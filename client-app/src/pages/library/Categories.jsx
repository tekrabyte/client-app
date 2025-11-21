import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

export default function Categories() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', sort_order: '0' });

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const res = await api.get('/library/categories');
            setData(res.data.categories || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setData([]);
        } finally { setLoading(false); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await api.put(`/library/categories/${editData.id}`, formData);
            } else {
                await api.post('/library/categories', formData);
            }
            setShowModal(false);
            setFormData({ name: '', description: '', sort_order: '0' });
            setEditData(null);
            loadData();
        } catch (error) {
            alert('Gagal menyimpan data: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({ name: item.name, description: item.description || '', sort_order: item.sort_order || '0' });
        setShowModal(true);
    };

    const handleDelete = async (item) => {
        if (confirm(`Hapus kategori "${item.name}"?`)) {
            try {
                await api.delete(`/library/categories/${item.id}`);
                loadData();
            } catch (error) {
                alert('Gagal menghapus: ' + error.message);
            }
        }
    };

    const columns = [
        { header: 'Nama Kategori', accessor: (item) => item.name || '-' },
        { header: 'Deskripsi', accessor: (item) => item.description || '-' },
        { header: 'Urutan', accessor: (item) => item.sort_order || '0' }
    ];

    return (
        <div>
            <PageHeader title="Kategori Produk" subtitle="Kelola kategori untuk mengorganisir produk" />
            <DataTable columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Cari kategori..." />

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); }} title={editData ? 'Edit Kategori' : 'Tambah Kategori'}>
                <form onSubmit={handleSubmit}>
                    <FormField label="Nama Kategori" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Contoh: Minuman, Makanan" />
                    <FormField label="Deskripsi" name="description" type="textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi kategori (opsional)" />
                    <FormField label="Urutan Tampilan" name="sort_order" type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} placeholder="0" />
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}