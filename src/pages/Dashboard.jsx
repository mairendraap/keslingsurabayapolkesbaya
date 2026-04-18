import React, { useMemo } from 'react';
import { Wallet, Scale, History, Users, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { currentUser, transactions, getSystemStats, users } = useAppContext();

  // For Nasabah
  const userTransactions = useMemo(() => {
    return transactions.filter(t => t.userId === currentUser?.id);
  }, [transactions, currentUser]);

  const depositedCategories = useMemo(() => {
    if (!currentUser || currentUser.role !== 'nasabah') return [];
    const categories = new Set();
    userTransactions.forEach(t => {
      if (t.type === 'setor' && t.details) {
        categories.add(t.details);
      }
    });
    return Array.from(categories);
  }, [userTransactions, currentUser]);

  // For Admin/Petugas
  const systemStats = getSystemStats();
  const totalNasabah = users.filter(u => u.role === 'nasabah').length;
  
  if (!currentUser) return null;

  if (currentUser.role === 'admin' || currentUser.role === 'petugas') {
    return (
      <div className="animate-fade-in">
        <h1 style={{ marginBottom: '0.5rem' }}>Dashboard {currentUser.role === 'admin' ? 'Administrator' : 'Petugas'}</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          Selamat Datang, {currentUser.name}. Berikut adalah ringkasan sistem Bank Sampah.
        </p>

        <div className="flex flex-mobile-col gap-6" style={{ marginBottom: '2rem' }}>
          <div className="card flex col justify-between" style={{ flex: 1 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div className="p-4 rounded-full text-primary" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Users size={24} />
              </div>
              <div>
                <p className="text-muted" style={{ fontWeight: 500 }}>Total Nasabah</p>
                <h2 style={{ fontSize: '2rem' }}>{totalNasabah}</h2>
              </div>
            </div>
          </div>

          <div className="card flex col justify-between" style={{ flex: 1 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div className="p-4 rounded-full text-secondary" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                <Scale size={24} />
              </div>
              <div>
                <p className="text-muted" style={{ fontWeight: 500 }}>Total Sampah</p>
                <h2 style={{ fontSize: '2rem' }}>{systemStats.totalWeight.toFixed(1)} Kg</h2>
              </div>
            </div>
          </div>

          <div className="card flex col justify-between" style={{ flex: 1 }}>
            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
              <div className="p-4 rounded-full bg-primary" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
                <Database className="text-primary" style={{color: '#0284c7'}} size={24} />
              </div>
              <div>
                <p className="text-muted" style={{ fontWeight: 500 }}>Total Saldo Nasabah</p>
                <h2 style={{ fontSize: '2rem' }}>Rp {systemStats.totalBalance.toLocaleString('id-ID')}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
            <History className="text-primary" size={20} />
            <h3>Transaksi Terbaru (Semua)</h3>
          </div>
          
          {transactions.length === 0 ? (
            <p className="text-muted text-center p-6" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              Belum ada transaksi di sistem.
            </p>
          ) : (
            <div className="flex col gap-4">
              {transactions.slice(0, 5).map((tx) => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <div key={tx.id} className="flex justify-between items-center p-4 hover-lift" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-full shadow-sm" style={{ backgroundColor: tx.type === 'setor' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', color: tx.type === 'setor' ? 'var(--primary)' : '#ef4444', fontWeight: 'bold' }}>
                        {tx.type === 'setor' ? 'S' : 'T'}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '0.25rem' }}>
                          {tx.type === 'setor' ? 'Setor: ' : 'Tarik: '} {tx.details}
                        </h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {user?.name} • {new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h4 className={tx.type === 'setor' ? 'text-primary' : ''} style={{ color: tx.type === 'tarik' ? '#ef4444' : '' }}>
                        {tx.type === 'setor' ? '+' : '-'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                      </h4>
                      {tx.type === 'setor' && <p className="text-muted" style={{ fontSize: '0.85rem' }}>{tx.weight} Kg</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard Nasabah
  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Selamat datang kembali, {currentUser.name}!
      </p>

      <div className="flex flex-mobile-col gap-6" style={{ marginBottom: '2rem' }}>
        <div className="card flex col justify-between" style={{ flex: 1 }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
            <div className="p-4 rounded-full bg-primary" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <Wallet className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ fontWeight: 500 }}>Total Saldo</p>
              <h2 style={{ fontSize: '2rem' }}>Rp {(currentUser.balance || 0).toLocaleString('id-ID')}</h2>
            </div>
          </div>
        </div>

        <div className="card flex col justify-between" style={{ flex: 1 }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
            <div className="p-4 rounded-full text-secondary" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
              <Scale size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ fontWeight: 500 }}>Sampah Terkumpul</p>
              <h2 style={{ fontSize: '2rem' }}>{Number(currentUser.totalWeight || 0).toFixed(1)} Kg</h2>
            </div>
          </div>
        </div>
      </div>

      {depositedCategories.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Jenis Sampah yang Pernah Disetor</h3>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {depositedCategories.map((cat, idx) => (
              <span key={idx} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '999px', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
          <History className="text-primary" size={20} />
          <h3>Riwayat Transaksi Terakhir</h3>
        </div>
        
        {userTransactions.length === 0 ? (
          <p className="text-muted text-center p-6" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            Belum ada riwayat transaksi. Mari mulai menabung sampah!
          </p>
        ) : (
          <div className="flex col gap-4">
            {userTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-4 hover-lift" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', transition: 'var(--transition)', backgroundColor: 'var(--surface)' }}>
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full shadow-sm" style={{ backgroundColor: tx.type === 'setor' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', color: tx.type === 'setor' ? 'var(--primary)' : '#ef4444', fontWeight: 'bold' }}>
                    {tx.type === 'setor' ? 'S' : 'T'}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>
                      {tx.type === 'setor' ? 'Setor: ' : 'Tarik: '} {tx.details}
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 className={tx.type === 'setor' ? 'text-primary' : ''} style={{ color: tx.type === 'tarik' ? '#ef4444' : '' }}>
                    {tx.type === 'setor' ? '+' : '-'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                  </h4>
                  {tx.type === 'setor' && <p className="text-muted" style={{ fontSize: '0.85rem' }}>{tx.weight} Kg</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
