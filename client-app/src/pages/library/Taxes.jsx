import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

export default function Taxes() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: '', rate: '0', is_active: true });

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const res = await api.get('/library/taxes');
            setData(res.data.taxes || []);
        } catch (error) { console.error('Failed to load taxes:', error); setData([]); } finally { setLoading(false); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) { await api.put(`/library/taxes/${editData.id}`, formData); } else { await api.post('/library/taxes', formData); }
            setShowModal(false); setFormData({ name: '', rate: '0', is_active: true }); setEditData(null); loadData();
        } catch (error) { alert('Gagal menyimpan data: ' + error.message); }
    };

    const columns = [
        { header: 'Nama Pajak', accessor: (item) => item.name || '-' },
        { header: 'Tarif', accessor: (item) => `${item.rate}%` },
        { header: 'Status', render: (item) => <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.is_active ? 'Aktif' : 'Nonaktif'}</span> }
    ];

    return (
        <div>
            <PageHeader title="Taxes" subtitle="Kelola pajak dan biaya tambahan" />
            <DataTable columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} onEdit={(item) => { setEditData(item); setFormData({ name: item.name, rate: item.rate, is_active: item.is_active }); setShowModal(true); }} onDelete={async (item) => { if (confirm(`Hapus pajak "${item.name}"?`)) { await api.delete(`/library/taxes/${item.id}`); loadData(); } }} searchPlaceholder="Cari pajak..." />

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); }} title={editData ? 'Edit Pajak' : 'Tambah Pajak'}>
                <form onSubmit={handleSubmit}>
                    <FormField label="Nama Pajak" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Contoh: PB1, Service Charge" />
                    <FormField label="Tarif (%)" name="rate" type="number" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} required placeholder="10" />
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}