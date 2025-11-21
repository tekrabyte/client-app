import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

export default function Promo() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', discount_type: 'percentage', discount_value: '0', start_date: '', end_date: '', is_active: true });

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const res = await api.get('/library/promo');
            setData(res.data.promos || []);
        } catch (error) {
            console.error('Failed to load promos:', error);
            setData([]);
        } finally { setLoading(false); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await api.put(`/library/promo/${editData.id}`, formData);
            } else {
                await api.post('/library/promo', formData);
            }
            setShowModal(false);
            setFormData({ name: '', code: '', discount_type: 'percentage', discount_value: '0', start_date: '', end_date: '', is_active: true });
            setEditData(null);
            loadData();
        } catch (error) {
            alert('Gagal menyimpan data: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({ name: item.name, code: item.code, discount_type: item.discount_type, discount_value: item.discount_value, start_date: item.start_date, end_date: item.end_date, is_active: item.is_active });
        setShowModal(true);
    };

    const handleDelete = async (item) => {
        if (confirm(`Hapus promo "${item.name}"?`)) {
            try {
                await api.delete(`/library/promo/${item.id}`);
                loadData();
            } catch (error) {
                alert('Gagal menghapus: ' + error.message);
            }
        }
    };

    const columns = [
        { header: 'Nama Promo', accessor: (item) => item.name || '-' },
        { header: 'Kode', accessor: (item) => item.code || '-' },
        { header: 'Diskon', accessor: (item) => item.discount_type === 'percentage' ? `${item.discount_value}%` : `Rp ${parseInt(item.discount_value || 0).toLocaleString()}` },
        { header: 'Periode', accessor: (item) => `${item.start_date || '-'} s/d ${item.end_date || '-'}` },
        { header: 'Status', render: (item) => <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.is_active ? 'Aktif' : 'Nonaktif'}</span> }
    ];

    return (
        <div>
            <PageHeader title="Promo" subtitle="Kelola promo dan voucher" />
            <DataTable columns={columns} data={data} loading={loading} onAdd={() => setShowModal(true)} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Cari promo..." />

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); }} title={editData ? 'Edit Promo' : 'Tambah Promo'}>
                <form onSubmit={handleSubmit}>
                    <FormField label="Nama Promo" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <FormField label="Kode Promo" name="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required placeholder="PROMO10" />
                    <FormField label="Tipe Diskon" name="discount_type" type="select" value={formData.discount_type} onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })} options={[{ value: 'percentage', label: 'Persentase (%)' }, { value: 'fixed', label: 'Nominal (Rp)' }]} required />
                    <FormField label="Nilai Diskon" name="discount_value" type="number" value={formData.discount_value} onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })} required />
                    <FormField label="Tanggal Mulai" name="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                    <FormField label="Tanggal Berakhir" name="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}