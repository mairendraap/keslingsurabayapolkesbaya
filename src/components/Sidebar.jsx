import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Recycle, Settings, History, WalletCards, LogOut, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar flex col justify-between">
      <div>
        <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem 1.5rem 1rem' }}>
          <img src="/logo.png" alt="Poltekkes Surabaya Logo" style={{ width: '100%', maxWidth: '180px', objectFit: 'contain', marginBottom: '0.5rem' }} />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {(currentUser?.role === 'nasabah' || currentUser?.role === 'petugas') && (
            <NavLink to="/setor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Recycle size={20} />
              <span>Setor Sampah</span>
            </NavLink>
          )}

          {currentUser?.role === 'nasabah' && (
            <NavLink to="/tarik" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <WalletCards size={20} />
              <span>Tarik Saldo</span>
            </NavLink>
          )}

          <NavLink to="/riwayat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <History size={20} />
            <span>Riwayat Transaksi</span>
          </NavLink>

          {currentUser?.role === 'admin' && (
            <>
              <NavLink to="/harga" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Settings size={20} />
                <span>Manajemen Harga</span>
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={20} />
                <span>Manajemen Pengguna</span>
              </NavLink>
            </>
          )}

          <button onClick={handleLogout} className="nav-item mobile-logout" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', color: '#ef4444' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', margin: '0 1rem', padding: '1.5rem 0' }}>
        <div className="flex items-center gap-3" style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentUser?.name}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{currentUser?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
