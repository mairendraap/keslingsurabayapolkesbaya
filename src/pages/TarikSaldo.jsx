import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletCards, Send, Gift, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2';

const PilihanTarik = [
  { id: 'tunai', name: 'Uang Tunai', icon: <WalletCards size={24} /> },
  { id: 'pulsa', name: 'Pulsa / Paket Data', icon: <CreditCard size={24} /> },
  { id: 'sembako', name: 'Tukar Sembako', icon: <Gift size={24} /> },
];

const TarikSaldo = () => {
  const { currentUser, addTransaction } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    method: 'tunai',
    amount: '',
    notes: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawAmount = parseInt(formData.amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Nominal Tidak Valid',
        text: 'Masukkan nominal yang valid dan lebih dari 0!'
      });
      return;
    }

    if (withdrawAmount > currentUser.balance) {
      Swal.fire({
        icon: 'warning',
        title: 'Saldo Tidak Cukup',
        text: 'Nominal penarikan melebihi saldo Anda saat ini.'
      });
      return;
    }

    const selectedMethodName = PilihanTarik.find(m => m.id === formData.method)?.name || formData.method;
    const details = `Penarikan via ${selectedMethodName} ${formData.notes ? '(' + formData.notes + ')' : ''}`;

    // Add transaction - amount is negative for Tarik
    await addTransaction(currentUser.id, 'tarik', details, 0, -withdrawAmount);

    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
        <WalletCards className="text-primary" size={28} />
        <h1>Tarik Saldo</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Tarik saldo tabungan sampah Anda menjadi uang tunai, pulsa, atau sembako.
      </p>

      {isSuccess ? (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
            <WalletCards size={48} />
          </div>
          <h2 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>Penarikan Berhasil!</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Penukaran saldo Anda sedang diproses oleh petugas.</p>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }} className="text-muted">Mengalihkan ke dashboard...</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--primary)', color: 'white' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>Saldo Tersedia</p>
              <h2 style={{ color: 'white', fontSize: '2rem' }}>Rp {(currentUser?.balance || 0).toLocaleString('id-ID')}</h2>
            </div>
            <WalletCards size={40} style={{ opacity: 0.5 }} />
          </div>

          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '1rem' }}>Metode Penarikan</label>
              <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                {PilihanTarik.map(met => (
                  <div 
                    key={met.id} 
                    onClick={() => setFormData({...formData, method: met.id})}
                    style={{ 
                      flex: 1, 
                      minWidth: '120px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '1.5rem 1rem', 
                      border: formData.method === met.id ? '2px solid var(--primary)' : '2px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)', 
                      cursor: 'pointer',
                      backgroundColor: formData.method === met.id ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-color)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ color: formData.method === met.id ? 'var(--primary)' : 'var(--text-color)', marginBottom: '0.5rem' }}>
                      {met.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: formData.method === met.id ? 'bold' : 'normal', textAlign: 'center' }}>{met.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="amount">Nominal (Rp)</label>
              <input 
                id="amount"
                type="number" 
                min="1000"
                step="1000"
                className="form-input" 
                placeholder="Contoh: 25000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                *Pastikan saldo Anda cukup.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="notes">Catatan Tambahan (Opsional)</label>
              <input 
                id="notes"
                type="text" 
                className="form-input" 
                placeholder={formData.method === 'pulsa' ? "Contoh: Nomor HP XXXXXX" : "Contoh: Diambil sore hari"}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              disabled={!formData.amount || formData.amount <= 0 || parseInt(formData.amount) > (currentUser?.balance || 0)}
            >
              <Send size={20} />
              Ajukan Penarikan
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TarikSaldo;
