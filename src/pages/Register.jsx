import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserPlus, Leaf } from 'lucide-react';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama');
      return;
    }
    
    const success = await register({
      name: formData.name,
      username: formData.username,
      password: formData.password
    });
    
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Registrasi berhasil! Silakan login.'
      }).then(() => {
        navigate('/login');
      });
    } else {
      setError('Username sudah digunakan');
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '100vh', padding: '1rem', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="flex justify-center items-center" style={{ marginBottom: '1rem' }}>
            <Leaf className="text-primary" size={40} />
          </div>
          <h2>Daftar Nasabah</h2>
          <p className="text-muted">Buat akun untuk mulai menabung</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <UserPlus size={20} />
            Daftar Sekarang
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p className="text-muted">
            Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
