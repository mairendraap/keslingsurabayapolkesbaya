import React, { useState } from 'react';
import { Settings, Save, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2';

const ManajemenHarga = () => {
  const { categories, updateCategoryPrice } = useAppContext();
  const [editingId, setEditingId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setTempPrice(cat.pricePerKg);
  };

  const handleSave = async (id) => {
    if (isNaN(tempPrice) || tempPrice < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Harga Invalid',
        text: 'Masukkan harga yang valid!'
      });
      return;
    }
    await updateCategoryPrice(id, tempPrice);
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
        <Settings className="text-primary" size={28} />
        <h1>Manajemen Harga Sampah</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Atur harga per kilogram untuk setiap kategori sampah (Khusus Admin).
      </p>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>ID Kategori</th>
                <th style={{ padding: '1rem' }}>Nama Kategori</th>
                <th style={{ padding: '1rem' }}>Harga per Kg (Rp)</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem' }}>{cat.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{cat.name}</td>
                  <td style={{ padding: '1rem' }}>
                    {editingId === cat.id ? (
                      <input 
                        type="number" 
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="form-input"
                        style={{ padding: '0.5rem', width: '120px' }}
                      />
                    ) : (
                      <span>Rp {cat.pricePerKg.toLocaleString('id-ID')}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {editingId === cat.id ? (
                      <button onClick={() => handleSave(cat.id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        <Save size={16} /> Simpan
                      </button>
                    ) : (
                      <button onClick={() => handleEditClick(cat)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Edit Harga
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManajemenHarga;
