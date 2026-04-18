import React, { useMemo, useState } from 'react';
import { History, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const RiwayatTransaksi = () => {
  const { transactions, currentUser, users } = useAppContext();
  const [filterType, setFilterType] = useState('all'); // 'all', 'setor', 'tarik'

  const filteredTransactions = useMemo(() => {
    let list = transactions;

    // Filter by user role
    if (currentUser?.role === 'nasabah') {
      list = list.filter(t => t.userId === currentUser.id);
    }

    // Filter by type
    if (filterType !== 'all') {
      list = list.filter(t => t.type === filterType);
    }

    return list;
  }, [transactions, currentUser, filterType]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
        <History className="text-primary" size={28} />
        <h1>Riwayat Transaksi</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        {currentUser?.role === 'nasabah' ? 'Lihat semua riwayat setoran dan penarikan Anda.' : 'Lihat semua transaksi yang terjadi dalam sistem.'}
      </p>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ fontWeight: '500' }}>Filter:</div>
        <select 
          className="form-input" 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="all">Semua Transaksi</option>
          <option value="setor">Setoran Saja</option>
          <option value="tarik">Penarikan Saja</option>
        </select>
      </div>

      <div className="card">
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ marginBottom: '1rem', color: 'var(--border-color)', display: 'inline-block' }}>
              <Search size={48} />
            </div>
            <p className="text-muted">Tidak ada transaksi ditemukan.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
                  <th style={{ padding: '1rem' }}>Tanggal</th>
                  {currentUser?.role !== 'nasabah' && <th style={{ padding: '1rem' }}>Nasabah</th>}
                  <th style={{ padding: '1rem' }}>Jenis</th>
                  <th style={{ padding: '1rem' }}>Keterangan</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => {
                  const txUser = currentUser?.role !== 'nasabah' ? users.find(u => u.id === tx.userId) : null;
                  
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        {new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      {currentUser?.role !== 'nasabah' && (
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{txUser?.name || 'Unknown'}</td>
                      )}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          backgroundColor: tx.type === 'setor' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: tx.type === 'setor' ? 'var(--primary)' : '#dc2626'
                        }}>
                          {tx.type === 'setor' ? 'SETOR' : 'TARIK'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {tx.details} {tx.type === 'setor' && <span className="text-muted" style={{fontSize: '0.85rem'}}>({tx.weight} Kg)</span>}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: tx.type === 'setor' ? 'var(--primary)' : '#dc2626' }}>
                        {tx.type === 'setor' ? '+' : '-'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatTransaksi;
