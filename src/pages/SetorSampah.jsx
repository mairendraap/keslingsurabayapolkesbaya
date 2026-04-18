import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Send, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2';

const SetorSampah = () => {
  const { addTransaction, categories, currentUser, users } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    userId: currentUser?.id,
    type: categories.length > 0 ? categories[0].name : '',
    itemName: '',
    weight: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !formData.type) {
      setFormData(prev => ({ ...prev, type: categories[0].name }));
    }
    if (currentUser?.id && !formData.userId) {
      setFormData(prev => ({ ...prev, userId: currentUser.id }));
    }
  }, [categories, currentUser]);

  const nasabahList = users.filter(u => u.role === 'nasabah');

  const selectedCategory = categories.find(k => k.name === formData.type) || categories[0];
  const pricePerKg = selectedCategory ? selectedCategory.pricePerKg : 0;
  const estimatedAmount = (parseFloat(formData.weight) || 0) * pricePerKg;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight || isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Input Invalid',
        text: 'Masukkan berat sampah yang valid!'
      });
      return;
    }

    if (!formData.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Nasabah Kosong',
        text: 'Pilih nasabah terlebih dahulu!'
      });
      return;
    }

    if (!formData.itemName) {
      Swal.fire({
        icon: 'warning',
        title: 'Nama Spesifik Kosong',
        text: 'Masukkan nama spesifik sampah (contoh: Botol Plastik, dll)'
      });
      return;
    }

    // targetUserId, type, details, weight, amount
    const details = `${formData.type} - ${formData.itemName}`;
    await addTransaction(formData.userId, 'setor', details, parseFloat(formData.weight), estimatedAmount);
    
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (categories.length === 0) return <div>Memuat kategori sampah...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
        <Leaf className="text-primary" size={28} />
        <h1>Setor Sampah</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Ayo ubah sampahmu menjadi saldo yang bermanfaat!
      </p>

      {isSuccess ? (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            <Sparkles size={48} />
          </div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Yey! Berhasil Setor</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Saldo telah bertambah <b>Rp {estimatedAmount.toLocaleString('id-ID')}</b>.</p>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }} className="text-muted">Mengalihkan ke dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          
          {currentUser?.role === 'petugas' && (
            <div className="form-group">
              <label className="form-label" htmlFor="userId">Pilih Nasabah</label>
              <select 
                id="userId"
                className="form-input" 
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                required
              >
                <option value="">-- Pilih Nasabah --</option>
                {nasabahList.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} (@{n.username})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="type">Jenis Sampah</label>
            <select 
              id="type"
              className="form-input" 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {categories.map(kat => (
                <option key={kat.id} value={kat.name}>
                  {kat.name} (Rp {kat.pricePerKg.toLocaleString('id-ID')}/Kg)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="itemName">Nama Barang / Spesifik</label>
            <input 
              id="itemName"
              type="text" 
              className="form-input" 
              placeholder="Contoh: Botol Plastik Bekas, Kardus TV"
              value={formData.itemName}
              onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="weight">Berat Sampah (Kg)</label>
            <input 
              id="weight"
              type="number" 
              step="0.1"
              min="0.1"
              className="form-input" 
              placeholder="Contoh: 1.5"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              required
            />
          </div>

          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px dashed var(--primary)' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Estimasi Saldo Didapat</p>
            <h3 className="text-primary" style={{ fontSize: '1.75rem' }}>Rp {estimatedAmount.toLocaleString('id-ID')}</h3>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            <Send size={20} />
            Setor Sekarang
          </button>
        </form>
      )}
    </div>
  );
};

export default SetorSampah;
