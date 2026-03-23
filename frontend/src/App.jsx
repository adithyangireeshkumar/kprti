import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FIRList from './pages/FIRList';
import CasesList from './pages/CasesList';
import CriminalDb from './pages/CriminalDb';
import Officers from './pages/Officers';
import NewsPanel from './pages/NewsPanel';
import Login from './pages/Login';

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'white' }}>Loading securely...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute user={user}><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="firs" element={<FIRList />} />
          <Route path="cases" element={<CasesList />} />
          <Route path="criminals" element={<CriminalDb />} />
          <Route path="officers" element={<Officers />} />
          <Route path="news" element={<NewsPanel />} />
          <Route path="*" element={<div className="glass-card"><h2>Work in Progress</h2><p>This module is under development.</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
