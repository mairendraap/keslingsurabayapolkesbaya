import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Recycle, Heart, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundImage: `linear-gradient(rgba(240, 253, 244, 0.9), rgba(209, 250, 229, 0.95)), url('/bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', color: 'var(--primary)', opacity: 0.1, animation: 'fadeInUp 2s infinite alternate' }}>
        <Leaf size={100} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', color: 'var(--secondary)', opacity: 0.2, animation: 'fadeInUp 3s infinite alternate-reverse' }}>
        <Sparkles size={120} />
      </div>

      <div className="animate-fade-in card" style={{
        padding: '3.5rem',
        maxWidth: '750px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        border: 'none',
        boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2), 0 3px 6px -3px rgba(0,0,0,0.1)'
      }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '35%',
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.6)',
            transform: 'rotate(-10deg)',
            transition: 'transform 0.3s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(10deg) scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-10deg) scale(1)'}
          >
            <Recycle size={64} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Logo Kemenkes Poltekkes Surabaya" style={{ height: '90px', objectFit: 'contain', zIndex: 2, position: 'relative' }} />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 800 }}>
          Project Bank Sampah
        </h1>

        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.7' }}>
          WebApp Bank Sampah develop by D3 Sanitasi Kelas B
        </p>

        <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            style={{ fontSize: '1.1rem', padding: '1rem 2rem', gap: '0.75rem' }}
            onClick={() => navigate('/dashboard')}
          >
            Lihat Dashboard <ArrowRight size={20} />
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '1.1rem', padding: '1rem 2rem', gap: '0.75rem', backgroundColor: 'var(--surface)', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={() => navigate('/setor')}
          >
            Setor Sampah Mu!
          </button>
        </div>
      </div>

      <div style={{ marginTop: '4rem', color: '#059669', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px', opacity: 0.8 }}>
        © 2026 E-WASTE MANAGEMENT • POLTEKKES SURABAYA
      </div>
    </div>
  );
};

export default LandingPage;
