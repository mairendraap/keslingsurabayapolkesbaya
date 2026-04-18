import React from 'react';
import { Users, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2';

const ManajemenUser = () => {
  const { users, currentUser, updateUserRole } = useAppContext();

  const handleRoleChange = (userId, newRole) => {
    // don't let admin demote themselves directly ideally, but for demo it's fine
    if (userId === currentUser.id && newRole !== 'admin') {
      Swal.fire({
        title: 'Perhatian!',
        text: 'Anda yakin ingin mengubah peran Anda sendiri? Anda mungkin akan kehilangan akses halaman ini.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Ubah',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          updateUserRole(userId, newRole);
          Swal.fire('Berhasil!', 'Peran berhasil diubah.', 'success');
        }
      });
      return;
    }

    updateUserRole(userId, newRole);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Peran pengguna diperbarui',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
        <Users className="text-primary" size={28} />
        <h1>Manajemen Pengguna</h1>
      </div>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        Atur hak akses pengguna di dalam sistem (Khusus Admin).
      </p>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
                <th style={{ padding: '1rem' }}>ID & Username</th>
                <th style={{ padding: '1rem' }}>Nama Lengkap</th>
                <th style={{ padding: '1rem' }}>Saldo</th>
                <th style={{ padding: '1rem' }}>Peran (Role)</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600' }}>{user.username}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user.id}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    {user.name} {user.id === currentUser.id && <span style={{fontSize: '0.8rem', color: 'var(--primary)'}}>(Anda)</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    Rp {user.balance.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      className="form-input" 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{ padding: '0.5rem', minWidth: '130px', cursor: 'pointer' }}
                    >
                      <option value="nasabah">Nasabah</option>
                      <option value="petugas">Petugas</option>
                      <option value="admin">Admin</option>
                    </select>
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

export default ManajemenUser;
