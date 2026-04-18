import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SetorSampah from './pages/SetorSampah';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ManajemenHarga from './pages/ManajemenHarga';
import ManajemenUser from './pages/ManajemenUser';
import RiwayatTransaksi from './pages/RiwayatTransaksi';
import TarikSaldo from './pages/TarikSaldo';
import { AppProvider, useAppContext } from './context/AppContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAppContext();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';

  if (isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main className="main-layout">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/setor" element={<ProtectedRoute allowedRoles={['nasabah', 'petugas']}><SetorSampah /></ProtectedRoute>} />
            <Route path="/harga" element={<ProtectedRoute allowedRoles={['admin']}><ManajemenHarga /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><ManajemenUser /></ProtectedRoute>} />
            <Route path="/riwayat" element={<ProtectedRoute><RiwayatTransaksi /></ProtectedRoute>} />
            <Route path="/tarik" element={<ProtectedRoute allowedRoles={['nasabah']}><TarikSaldo /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
